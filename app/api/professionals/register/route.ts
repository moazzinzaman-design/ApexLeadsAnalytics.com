import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseKey);
};

// UK city coordinates mapping
const cityCoords: Record<string, { lat: number; lon: number }> = {
  'London': { lat: 51.5074, lon: -0.1278 },
  'Birmingham': { lat: 52.4862, lon: -1.8904 },
  'Manchester': { lat: 53.4808, lon: -2.2446 },
  'Leeds': { lat: 53.7965, lon: -1.5462 },
  'Glasgow': { lat: 55.8642, lon: -4.2518 },
  'Liverpool': { lat: 53.4084, lon: -2.9916 },
  'Newcastle': { lat: 54.9783, lon: -1.6178 },
  'Sheffield': { lat: 53.3811, lon: -1.4701 },
  'Bristol': { lat: 51.4545, lon: -2.5879 },
  'Edinburgh': { lat: 55.9533, lon: -3.1883 },
  'Cardiff': { lat: 51.4816, lon: -3.1791 },
  'Belfast': { lat: 54.5964, lon: -5.9300 },
  'Nottingham': { lat: 52.9536, lon: -1.1505 },
  'Southampton': { lat: 50.9097, lon: -1.4044 },
  'Brighton': { lat: 50.8276, lon: -0.1525 },
  'Leicester': { lat: 52.6347, lon: -1.1315 },
  'Oxford': { lat: 51.7548, lon: -1.2544 },
  'Cambridge': { lat: 52.2053, lon: 0.1218 },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      email,
      phone,
      business_name,
      category,
      city,
      postcode,
      hourly_rate,
      bio,
      subscription_tier = 'free',
    } = body;

    // Validation
    if (!name || !email || !phone || !category || !city || !postcode) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Check if email already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Get coordinates from city
    const coords = cityCoords[city] || { lat: 53.0, lon: -1.0 };
    
    // Add some randomness to coordinates so they're not all the same
    const latitude = coords.lat + (Math.random() - 0.5) * 0.1;
    const longitude = coords.lon + (Math.random() - 0.5) * 0.1;

    // Create the profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        name,
        email: email.toLowerCase(),
        phone,
        business_name: business_name || null,
        category,
        city,
        postcode: postcode.toUpperCase(),
        latitude,
        longitude,
        hourly_rate: hourly_rate || null,
        bio: bio || null,
        subscription_tier,
        verified_status: false, // New signups need verification
        total_jobs_completed: 0,
        years_experience: 0,
        available_weekdays: true,
        available_weekends: false,
        emergency_calls: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create profile: ' + error.message },
        { status: 500 }
      );
    }

    // TODO: Send welcome email to the new professional

    return NextResponse.json({
      success: true,
      message: 'Profile created successfully!',
      profile: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        category: profile.category,
        city: profile.city,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}

