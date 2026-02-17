/**
 * Email Notification Service using Resend
 * Sends instant email notifications to professionals when they receive a new lead
 * 
 * Setup:
 * 1. Sign up at resend.com
 * 2. Get your API key from Resend dashboard
 * 3. Add to .env.local:
 *    - RESEND_API_KEY=re_xxxxx
 * 4. Verify your sender domain in Resend
 */

import { Resend } from 'resend';

interface LeadEmailData {
  professional_name: string;
  professional_email: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  service_type: string;
  message?: string;
  urgency: string;
  postcode?: string;
}

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

const FROM_EMAIL = process.env.EMAIL_FROM || 'Apex Leads <noreply@apexleads.co.uk>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'moazzin.zaman@outlook.com';

/**
 * Send an email notification to a professional about a new lead
 */
export async function sendNewLeadEmail(data: LeadEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // If Resend is not configured, log the email (for development)
  if (!resend) {
    console.log('📧 Email Notification (Not Configured):', {
      to: data.professional_email,
      subject: `New Lead: ${data.client_name} - ${data.service_type.replace('-', ' ')}`,
    });
    return { success: true, messageId: 'dev-mode' };
  }

  try {
    const serviceLabels: Record<string, string> = {
      'house-cleaning': 'House Cleaning',
      'pressure-washing': 'Pressure Washing',
      'gutter-cleaning': 'Gutter Cleaning',
      'car-detailing': 'Car Detailing',
      'garden-maintenance': 'Garden Maintenance',
      'carpet-cleaning': 'Carpet Cleaning',
      'electricians': 'Electrical Work',
      'handywoman': 'Handywoman Services',
      'plumbing': 'Plumbing',
      'painting': 'Painting & Decorating',
    };

    const urgencyEmojis: Record<string, string> = {
      'low': '🟢',
      'medium': '🟡',
      'high': '🟠',
      'emergency': '🔴',
    };

    const serviceLabel = serviceLabels[data.service_type] || data.service_type.replace('-', ' ');
    const urgencyEmoji = urgencyEmojis[data.urgency] || '';

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0e27; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0e27; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #151d3b; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #0a0e27; font-size: 24px; font-weight: 700;">🔔 New Lead Received!</h1>
              <p style="margin: 8px 0 0 0; color: #0a0e27; font-size: 16px;">You have a new inquiry from Apex Leads</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <!-- Service Type -->
              <div style="background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <p style="margin: 0; color: #00d4ff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Service Required</p>
                <p style="margin: 8px 0 0 0; color: #ffffff; font-size: 20px; font-weight: 600;">${serviceLabel}</p>
              </div>

              <!-- Client Details -->
              <h3 style="color: #ffffff; font-size: 16px; margin: 0 0 15px 0;">Client Information</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <p style="margin: 0; color: #a0aec0; font-size: 12px;">Name</p>
                    <p style="margin: 4px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 500;">${data.client_name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <p style="margin: 0; color: #a0aec0; font-size: 12px;">Phone</p>
                    <p style="margin: 4px 0 0 0; color: #00d4ff; font-size: 16px; font-weight: 500;"><a href="tel:${data.client_phone}" style="color: #00d4ff; text-decoration: none;">${data.client_phone}</a></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <p style="margin: 0; color: #a0aec0; font-size: 12px;">Email</p>
                    <p style="margin: 4px 0 0 0; color: #00d4ff; font-size: 16px; font-weight: 500;"><a href="mailto:${data.client_email}" style="color: #00d4ff; text-decoration: none;">${data.client_email}</a></p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <p style="margin: 0; color: #a0aec0; font-size: 12px;">Urgency</p>
                    <p style="margin: 4px 0 0 0; color: #ffffff; font-size: 16px; font-weight: 500;">${urgencyEmoji} ${data.urgency.charAt(0).toUpperCase() + data.urgency.slice(1)}</p>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              ${data.message ? `
              <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; color: #a0aec0; font-size: 12px;">Client Message</p>
                <p style="margin: 0; color: #ffffff; font-size: 14px; line-height: 1.6;">${data.message}</p>
              </div>
              ` : ''}

              <!-- Location -->
              ${data.postcode ? `
              <div style="margin-bottom: 20px;">
                <p style="margin: 0; color: #a0aec0; font-size: 12px;">Location</p>
                <p style="margin: 4px 0 0 0; color: #ffffff; font-size: 14px;">${data.postcode}</p>
              </div>
              ` : ''}

              <!-- CTA Button -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://apexleads.co.uk/dashboard/leads" style="display: inline-block; background: linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%); color: #0a0e27; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">View Lead in Dashboard</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: rgba(0,0,0,0.3); padding: 20px; text-align: center;">
              <p style="margin: 0; color: #a0aec0; font-size: 12px;">Sent by Apex Leads Analytics</p>
              <p style="margin: 8px 0 0 0; color: #a0aec0; font-size: 11px;">
                <a href="https://apexleads.co.uk" style="color: #00d4ff; text-decoration: none;">Website</a> • 
                <a href="https://apexleads.co.uk/dashboard" style="color: #00d4ff; text-decoration: none;">Dashboard</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.professional_email,
      subject: `🔔 New Lead: ${data.client_name} - ${serviceLabel}`,
      html: emailHtml,
    });

    if (result.error) {
      console.error('Resend Error:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log('📧 Email sent successfully:', result.data?.id);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email notification' };
  }
}

/**
 * Send admin notification when a new lead is created
 */
export async function sendAdminLeadEmail(data: LeadEmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!resend) {
    console.log('📧 Admin Email Notification (Not Configured):', data);
    return { success: true, messageId: 'dev-mode' };
  }

  try {
    const serviceLabels: Record<string, string> = {
      'house-cleaning': 'House Cleaning',
      'pressure-washing': 'Pressure Washing',
      'gutter-cleaning': 'Gutter Cleaning',
      'car-detailing': 'Car Detailing',
      'garden-maintenance': 'Garden Maintenance',
      'carpet-cleaning': 'Carpet Cleaning',
      'electricians': 'Electrical Work',
      'handywoman': 'Handywoman Services',
      'plumbing': 'Plumbing',
      'painting': 'Painting & Decorating',
    };

    const adminHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 20px; background-color: #0a0e27; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: #151d3b; border-radius: 16px; padding: 30px;">
    <h2 style="color: #00d4ff; margin: 0 0 20px 0;">📊 New Lead Created</h2>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <strong style="color: #a0aec0;">Service:</strong> <span style="color: #ffffff;">${serviceLabels[data.service_type] || data.service_type}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <strong style="color: #a0aec0;">Client:</strong> <span style="color: #ffffff;">${data.client_name}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <strong style="color: #a0aec0;">Phone:</strong> <span style="color: #00d4ff;">${data.client_phone}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <strong style="color: #a0aec0;">Email:</strong> <span style="color: #00d4ff;">${data.client_email}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <strong style="color: #a0aec0;">Pro:</strong> <span style="color: #ffffff;">${data.professional_name} (${data.professional_email})</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0;">
          <strong style="color: #a0aec0;">Urgency:</strong> <span style="color: #ffffff;">${data.urgency}</span>
        </td>
      </tr>
    </table>
    <p style="color: #a0aec0; font-size: 12px; margin-top: 20px;">Apex Leads Analytics</p>
  </div>
</body>
</html>
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `📊 New Lead: ${data.client_name} - ${serviceLabels[data.service_type] || data.service_type}`,
      html: adminHtml,
    });

    return { success: !!result.data?.id, messageId: result.data?.id };
  } catch (error) {
    console.error('Failed to send admin email:', error);
    return { success: false, error: 'Failed to send admin notification' };
  }
}

/**
 * Send confirmation email to the client
 */
export async function sendClientConfirmationEmail(
  clientEmail: string, 
  clientName: string, 
  proName: string, 
  serviceType: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!resend) {
    console.log('📧 Client Confirmation (Not Configured):', { clientEmail, clientName, proName });
    return { success: true, messageId: 'dev-mode' };
  }

  try {
    const serviceLabels: Record<string, string> = {
      'house-cleaning': 'House Cleaning',
      'pressure-washing': 'Pressure Washing',
      'gutter-cleaning': 'Gutter Cleaning',
      'car-detailing': 'Car Detailing',
      'garden-maintenance': 'Garden Maintenance',
      'carpet-cleaning': 'Carpet Cleaning',
      'electricians': 'Electrical Work',
      'handywoman': 'Handywoman Services',
      'plumbing': 'Plumbing',
      'painting': 'Painting & Decorating',
    };

    const confirmationHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0e27; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0e27; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #151d3b; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #0a0e27; font-size: 24px;">✅ Request Submitted!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="color: #ffffff; font-size: 16px; margin: 0 0 20px 0;">Hi ${clientName},</p>
              <p style="color: #a0aec0; font-size: 14px; margin: 0 0 20px 0;">
                Your request for <strong style="color: #00d4ff;">${serviceLabels[serviceType] || serviceType}</strong> has been sent to <strong style="color: #ffffff;">${proName}</strong>.
              </p>
              <p style="color: #a0aec0; font-size: 14px; margin: 0 0 20px 0;">
                They will contact you shortly to discuss your requirements and provide a quote.
              </p>
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://apexleads.co.uk" style="display: inline-block; background: #00d4ff; color: #0a0e27; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Browse More Pros</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: clientEmail,
      subject: '✅ Your Quote Request - Apex Leads',
      html: confirmationHtml,
    });

    return { success: !!result.data?.id, messageId: result.data?.id };
  } catch (error) {
    console.error('Failed to send client confirmation:', error);
    return { success: false, error: 'Failed to send confirmation email' };
  }
}
