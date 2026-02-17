
import { NextRequest, NextResponse } from 'next/server';
import { LeadSubmission } from '@/types';
import { sendNewLeadEmail, sendAdminLeadEmail, sendClientConfirmationEmail } from '@/lib/email';

// In production, import supabase
// import { supabase } from '@/lib/supabase';

// Mock professional data - in production, fetch from Supabase
const mockProfessionals: Record<string, { name: string; email: string }> = {
  '1': { name: 'Sarah Johnson', email: 'sarah@cleanpro.co.uk' },
  '2': { name: 'Mike Thompson', email: 'mike@powerwash.uk' },
  '3': { name: 'David Brown', email: 'david@sparkyelectrics.co.uk' },
  '4': { name: 'Emma Williams', email: 'emma@handyhelp.co.uk' },
  '5': { name: 'Lisa Green', email: 'lisa@gardeners.uk' },
  '6': { name: 'James Miller', email: 'james@carpetcare.co.uk' },
};

export async function POST(request: NextRequest) {
  try {
    const body: LeadSubmission = await request.json();

    // Validate required fields
    const requiredFields = ['pro_id', 'client_name', 'client_email', 'client_phone', 'service_type'];
    const missingFields = requiredFields.filter(field => !body[field as keyof LeadSubmission]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.client_email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 }
      );
    }

    // Validate phone format (basic UK phone validation)
    const phoneRegex = /^(\+44|0)[1-9]\d{8,10}$/;
    const cleanPhone = body.client_phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid UK phone number format',
        },
        { status: 400 }
      );
    }

    // In production, insert into Supabase
    /*
    const { data, error } = await supabase
      .from('leads')
      .insert({
        assigned_pro_id: body.pro_id,
        client_name: body.client_name,
        client_email: body.client_email,
        client_phone: body.client_phone,
        service_type: body.service_type,
        message: body.message || null,
        urgency: body.urgency || 'medium',
        postcode: body.postcode || null,
        city: body.city || null,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }
    */

    // Generate lead ID
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Get professional info (in production, fetch from Supabase)
    const professional = mockProfessionals[body.pro_id] || { name: 'The Professional', email: 'pro@example.com' };

    // Send email notification to the professional
    const emailResult = await sendNewLeadEmail({
      professional_name: professional.name,
      professional_email: professional.email,
      client_name: body.client_name,
      client_phone: body.client_phone,
      client_email: body.client_email,
      service_type: body.service_type,
      message: body.message,
      urgency: body.urgency || 'medium',
      postcode: body.postcode,
    });

    // Send admin notification
    await sendAdminLeadEmail({
      professional_name: professional.name,
      professional_email: professional.email,
      client_name: body.client_name,
      client_phone: body.client_phone,
      client_email: body.client_email,
      service_type: body.service_type,
      message: body.message,
      urgency: body.urgency || 'medium',
      postcode: body.postcode,
    });

    // Send confirmation to client
    await sendClientConfirmationEmail(
      body.client_email,
      body.client_name,
      professional.name,
      body.service_type
    );

    console.log('Lead created:', {
      id: leadId,
      pro_id: body.pro_id,
      professional: professional.name,
      client: {
        name: body.client_name,
        email: body.client_email,
        phone: body.client_phone,
      },
      service: body.service_type,
      email_sent: emailResult.success,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: leadId,
        status: 'new',
        message: 'Lead submitted successfully',
      },
      message: 'Your request has been sent! Check your email for confirmation. The professional will contact you shortly.',
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit lead. Please try again.',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch leads for a professional
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const proId = searchParams.get('pro_id');
    const status = searchParams.get('status');

    if (!proId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Professional ID is required',
        },
        { status: 400 }
      );
    }

    // In production, query Supabase
    /*
    let query = supabase
      .from('leads')
      .select('*')
      .eq('assigned_pro_id', proId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    */

    // Mock data
    const mockLeads = [
      {
        id: 'lead_1',
        created_at: new Date().toISOString(),
        client_name: 'John Smith',
        client_email: 'john@example.com',
        client_phone: '07123456789',
        service_type: 'house-cleaning',
        message: 'Need a deep clean for my 3-bedroom house',
        status: 'new',
        urgency: 'medium',
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockLeads,
    });
  } catch (error) {
    console.error('Fetch leads error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch leads',
      },
      { status: 500 }
    );
  }
}

// PUT endpoint to update lead status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead_id, status } = body;

    if (!lead_id || !status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Lead ID and status are required',
        },
        { status: 400 }
      );
    }

    // Valid statuses
    const validStatuses = ['new', 'contacted', 'quoted', 'booked', 'completed', 'lost'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status value',
        },
        { status: 400 }
      );
    }

    // In production, update Supabase
    /*
    const { data, error } = await supabase
      .from('leads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', lead_id)
      .select()
      .single();

    if (error) throw error;
    */

    return NextResponse.json({
      success: true,
      data: {
        id: lead_id,
        status,
      },
      message: 'Lead status updated successfully',
    });
  } catch (error) {
    console.error('Update lead error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update lead',
      },
      { status: 500 }
    );
  }
}

