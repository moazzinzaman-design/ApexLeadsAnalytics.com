/**
 * WhatsApp Notification Service
 * Sends instant notifications to professionals when they receive a new lead
 * 
 * Setup:
 * 1. Create a WhatsApp Business Account
 * 2. Set up WhatsApp Business API (Meta for Developers)
 * 3. Add credentials to .env.local:
 *    - WHATSAPP_PHONE_NUMBER_ID
 *    - WHATSAPP_ACCESS_TOKEN
 *    - ADMIN_WHATSAPP_NUMBER
 */

interface WhatsAppMessage {
  to: string;
  type: string;
  template?: {
    name: string;
    language: { code: string };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text: string;
      }>;
    }>;
  };
}

interface LeadNotificationData {
  professional_name: string;
  professional_phone: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  service_type: string;
  message?: string;
  urgency: string;
  postcode?: string;
}

/**
 * Send a WhatsApp notification to a professional about a new lead
 */
export async function sendNewLeadNotification(data: LeadNotificationData): Promise<boolean> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;

  // If WhatsApp is not configured, log the notification (for development)
  if (!phoneNumberId || !accessToken) {
    console.log('📱 WhatsApp Notification (Not Configured):', {
      to: data.professional_phone,
      message: `New lead for ${data.service_type}: ${data.client_name} - ${data.client_phone}`,
    });
    return true; // Return true to prevent errors in development
  }

  try {
    // Format phone number (remove spaces and leading +)
    const formattedPhone = data.professional_phone.replace(/\s/g, '').replace(/^\+/, '');
    
    // Use Meta's WhatsApp Business API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'template',
          template: {
            name: 'new_lead_notification', // Must be created in WhatsApp Business Manager
            language: { code: 'en_GB' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: data.client_name },
                  { type: 'text', text: data.service_type.replace('-', ' ') },
                  { type: 'text', text: data.urgency },
                  { type: 'text', text: data.client_phone },
                ],
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('WhatsApp API Error:', error);
      return false;
    }

    const result = await response.json();
    console.log('WhatsApp notification sent:', result.messages?.[0]?.id);
    return true;
  } catch (error) {
    console.error('Failed to send WhatsApp notification:', error);
    return false;
  }
}

/**
 * Send admin notification when a new lead is created
 */
export async function sendAdminLeadNotification(data: LeadNotificationData): Promise<boolean> {
  const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
  
  if (!adminNumber) {
    console.log('📱 Admin WhatsApp Notification (Not Configured):', data);
    return true;
  }

  // Format admin number
  const formattedAdmin = adminNumber.replace(/\s/g, '').replace(/^\+/, '');
  
  const message = `
🔔 *New Lead Received*

*Service:* ${data.service_type.replace('-', ' ')}
*Client:* ${data.client_name}
*Phone:* ${data.client_phone}
*Email:* ${data.client_email}
*Urgency:* ${data.urgency}
${data.message ? `\n*Message:* ${data.message}` : ''}
${data.postcode ? `\n*Location:* ${data.postcode}` : ''}

*Pro:* ${data.professional_name}
  `.trim();

  console.log('Admin notification would send:', message);
  
  // In production, send via WhatsApp API
  return true;
}

/**
 * Send a simple text WhatsApp message (fallback)
 */
export async function sendWhatsAppText(to: string, message: string): Promise<boolean> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.log('WhatsApp Text (Not Configured):', { to, message });
    return true;
  }

  try {
    const formattedPhone = to.replace(/\s/g, '').replace(/^\+/, '');

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: { body: message },
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Failed to send WhatsApp text:', error);
    return false;
  }
}

/**
 * Format phone number for WhatsApp (must include country code)
 */
export function formatPhoneForWhatsApp(phone: string, countryCode: string = '44'): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If doesn't start with country code, add it
  if (!cleaned.startsWith(countryCode)) {
    // If starts with 0, remove it first
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    cleaned = countryCode + cleaned;
  }
  
  return cleaned;
}

