import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseKey);
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const supabase = getSupabaseAdmin();
    
    const { data: professional, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !professional) {
      return NextResponse.json({
        success: false,
        error: 'Professional not found',
      }, { status: 404 });
    }

    // Get reviews for this professional
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('pro_id', id)
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      professional,
      reviews: reviews || [],
    });
  } catch (error) {
    console.error('Error fetching professional:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch professional',
    }, { status: 500 });
  }
}

