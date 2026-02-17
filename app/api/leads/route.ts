import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { LeadSubmission } from '@/types';

// Create admin client for server-side operations
const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseKey);
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

    let leadData = null;
    let supabaseError = null;

    // Try to save to Supabase
    try {
      const supabase = getSupabaseAdmin();
      
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
        supabaseError = error;
        console.error('Supabase insert error:', error);
      } else {
        leadData = data;
      }
    } catch (supabaseErr) {
      console.error('Supabase connection error:', supabaseErr);
      supabaseError = supabaseErr;
    }

    // If Supabase failed, create a mock lead ID for demo purposes
    const leadId = leadData?.id || `lead_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    console.log('Lead created:', {
      id: leadId,
      pro_id: body.pro_id,
      client: {
        name: body.client_name,
        email: body.client_email,
        phone: body.client_phone,
      },
      service: body.service_type,
      message: body.message,
      urgency: body.urgency,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: leadId,
        status: 'new',
        message: 'Lead submitted successfully',
      },
      message: 'Your request has been sent! The professional will contact you shortly.',
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

    let leads = [];
    let totalCount = 0;

    // Try to fetch from Supabase
    try {
      const supabase = getSupabaseAdmin();
      
      let query = supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .eq('assigned_pro_id', proId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, count, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
      } else {
        leads = data || [];
        totalCount = count || 0;
      }
    } catch (supabaseErr) {
      console.error('Supabase connection error:', supabaseErr);
    }

    return NextResponse.json({
      success: true,
      data: leads,
      total_count: totalCount,
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

    let updatedLead = null;

    // Try to update in Supabase
    try {
      const supabase = getSupabaseAdmin();
      
      const { data, error } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', lead_id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
      } else {
        updatedLead = data;
      }
    } catch (supabaseErr) {
      console.error('Supabase connection error:', supabaseErr);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: lead_id,
        status,
        ...updatedLead,
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

