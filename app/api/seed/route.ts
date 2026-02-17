import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This endpoint seeds the database with sample professionals
// Only call this once to populate initial data

const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseKey);
};

const sampleProfessionals = [
  {
    name: 'Sarah Johnson',
    email: 'sarah@cleanpro.co.uk',
    phone: '07700900001',
    business_name: 'CleanPro Services',
    category: 'house-cleaning',
    city: 'Manchester',
    county: 'Greater Manchester',
    postcode: 'M1 1AA',
    latitude: 53.4808,
    longitude: -2.2446,
    hourly_rate: 25.00,
    starting_price: 50.00,
    verified_status: true,
    subscription_tier: 'pro',
    bio: 'Professional cleaner with 10 years experience. DBS checked and fully insured. Specializing in deep cleans, regular maintenance, and end-of-tenancy cleaning.',
    total_jobs_completed: 450,
    years_experience: 10,
    available_weekdays: true,
    available_weekends: true,
    emergency_calls: false,
    is_featured: true,
  },
  {
    name: 'Mike Thompson',
    email: 'mike@powerwash.uk',
    phone: '07700900002',
    business_name: 'PowerWash Pro',
    category: 'pressure-washing',
    city: 'Leeds',
    county: 'West Yorkshire',
    postcode: 'LS1 1AA',
    latitude: 53.7965,
    longitude: -1.5462,
    hourly_rate: 35.00,
    starting_price: 75.00,
    verified_status: true,
    subscription_tier: 'pro',
    bio: 'Expert pressure washing for driveways, patios, decks, and commercial properties. Fully insured with professional equipment.',
    total_jobs_completed: 280,
    years_experience: 7,
    available_weekdays: true,
    available_weekends: true,
    emergency_calls: true,
    is_featured: true,
  },
  {
    name: 'Emma Williams',
    email: 'emma@handyhelp.co.uk',
    phone: '07700900003',
    business_name: 'HandyHelp Services',
    category: 'handywoman',
    city: 'Birmingham',
    county: 'West Midlands',
    postcode: 'B1 1AA',
    latitude: 52.4862,
    longitude: -1.8904,
    hourly_rate: 30.00,
    starting_price: 40.00,
    verified_status: true,
    subscription_tier: 'basic',
    bio: 'General handywoman services. TV mounting, furniture assembly, shelves, odd jobs, and minor repairs. No job too small!',
    total_jobs_completed: 120,
    years_experience: 4,
    available_weekdays: true,
    available_weekends: false,
    emergency_calls: false,
    is_featured: false,
  },
  {
    name: 'David Brown',
    email: 'david@sparkyelectrics.co.uk',
    phone: '07700900004',
    business_name: 'Sparky Electrics',
    category: 'electricians',
    city: 'London',
    county: 'Greater London',
    postcode: 'SW1A 1AA',
    latitude: 51.5074,
    longitude: -0.1278,
    hourly_rate: 50.00,
    starting_price: 80.00,
    verified_status: true,
    subscription_tier: 'enterprise',
    bio: 'Fully qualified NICEIC electrician with 15 years experience. Emergency callouts, rewiring, fuse boards, PAT testing, and all electrical work.',
    total_jobs_completed: 680,
    years_experience: 15,
    available_weekdays: true,
    available_weekends: true,
    emergency_calls: true,
    is_featured: true,
  },
  {
    name: 'Lisa Green',
    email: 'lisa@gardeners.uk',
    phone: '07700900005',
    business_name: 'Green Gardens',
    category: 'garden-maintenance',
    city: 'Bristol',
    county: 'Somerset',
    postcode: 'BS1 1AA',
    latitude: 51.4545,
    longitude: -2.5879,
    hourly_rate: 28.00,
    starting_price: 35.00,
    verified_status: false,
    subscription_tier: 'free',
    bio: 'Local gardener offering lawn mowing, hedge trimming, weeding, and general garden maintenance. Friendly and reliable.',
    total_jobs_completed: 45,
    years_experience: 3,
    available_weekdays: true,
    available_weekends: false,
    emergency_calls: false,
    is_featured: false,
  },
  {
    name: 'James Miller',
    email: 'james@carpetcare.co.uk',
    phone: '07700900006',
    business_name: 'Carpet Care Experts',
    category: 'carpet-cleaning',
    city: 'Liverpool',
    county: 'Merseyside',
    postcode: 'L1 1AA',
    latitude: 53.4084,
    longitude: -2.9916,
    hourly_rate: 40.00,
    starting_price: 60.00,
    verified_status: true,
    subscription_tier: 'pro',
    bio: 'Professional carpet and upholstery cleaning using hot water extraction. Stain removal specialist. Domestic and commercial.',
    total_jobs_completed: 310,
    years_experience: 8,
    available_weekdays: true,
    available_weekends: true,
    emergency_calls: false,
    is_featured: true,
  },
  {
    name: 'Anna White',
    email: 'anna@sparkleclean.co.uk',
    phone: '07700900007',
    business_name: 'Sparkle Auto Detailing',
    category: 'car-detailing',
    city: 'Sheffield',
    county: 'South Yorkshire',
    postcode: 'S1 1AA',
    latitude: 53.3811,
    longitude: -1.4701,
    hourly_rate: 45.00,
    starting_price: 85.00,
    verified_status: true,
    subscription_tier: 'pro',
    bio: 'Mobile car detailing service. Interior/exterior detailing, ceramic coating, paint correction, and valeting. We come to you!',
    total_jobs_completed: 195,
    years_experience: 6,
    available_weekdays: true,
    available_weekends: true,
    emergency_calls: false,
    is_featured: true,
  },
  {
    name: 'Robert Taylor',
    email: 'robert@gutterpro.co.uk',
    phone: '07700900008',
    business_name: 'Gutter Pro',
    category: 'gutter-cleaning',
    city: 'Newcastle',
    county: 'Tyne and Wear',
    postcode: 'NE1 1AA',
    latitude: 54.9783,
    longitude: -1.6178,
    hourly_rate: 35.00,
    starting_price: 50.00,
    verified_status: false,
    subscription_tier: 'free',
    bio: 'Gutter cleaning and minor repairs. Free quotes. Fully insured. Also offer conservatory and window cleaning.',
    total_jobs_completed: 60,
    years_experience: 2,
    available_weekdays: true,
    available_weekends: false,
    emergency_calls: false,
    is_featured: false,
  },
  {
    name: 'John Parker',
    email: 'john@plumbfix.co.uk',
    phone: '07700900009',
    business_name: 'PlumbFix Solutions',
    category: 'plumbing',
    city: 'London',
    county: 'Greater London',
    postcode: 'E1 1AA',
    latitude: 51.5099,
    longitude: -0.0059,
    hourly_rate: 55.00,
    starting_price: 70.00,
    verified_status: true,
    subscription_tier: 'pro',
    bio: 'Gas safe registered plumber. Emergency repairs, boiler installation, bathroom fitting, and all plumbing work.',
    total_jobs_completed: 420,
    years_experience: 12,
    available_weekdays: true,
    available_weekends: true,
    emergency_calls: true,
    is_featured: true,
  },
  {
    name: 'Sophie Adams',
    email: 'sophie@freshpaint.co.uk',
    phone: '07700900010',
    business_name: 'Fresh Paint Decorating',
    category: 'painting',
    city: 'Glasgow',
    county: 'Lanarkshire',
    postcode: 'G1 1AA',
    latitude: 55.8642,
    longitude: -4.2518,
    hourly_rate: 32.00,
    starting_price: 150.00,
    verified_status: true,
    subscription_tier: 'basic',
    bio: 'Professional painting and decorating. Interior, exterior, wallpaper removal, and feature walls. Clean and tidy work.',
    total_jobs_completed: 180,
    years_experience: 5,
    available_weekdays: true,
    available_weekends: false,
    emergency_calls: false,
    is_featured: false,
  },
  {
    name: 'Chris Wilson',
    email: 'chris@leedscleaners.co.uk',
    phone: '07700900011',
    business_name: 'Leeds Premier Cleaning',
    category: 'house-cleaning',
    city: 'Leeds',
    county: 'West Yorkshire',
    postcode: 'LS2 1AB',
    latitude: 53.7970,
    longitude: -1.5480,
    hourly_rate: 22.00,
    starting_price: 45.00,
    verified_status: true,
    subscription_tier: 'basic',
    bio: 'Reliable house cleaning service in Leeds. Regular cleans, one-off deep cleans, and move-in/move-out cleaning.',
    total_jobs_completed: 95,
    years_experience: 3,
    available_weekdays: true,
    available_weekends: true,
    emergency_calls: false,
    is_featured: false,
  },
  {
    name: 'Paul Davis',
    email: 'paul@brightonpressure.co.uk',
    phone: '07700900012',
    business_name: 'Brighton Pressure Washing',
    category: 'pressure-washing',
    city: 'Brighton',
    county: 'East Sussex',
    postcode: 'BN1 1AB',
    latitude: 50.8276,
    longitude: -0.1525,
    hourly_rate: 38.00,
    starting_price: 80.00,
    verified_status: false,
    subscription_tier: 'free',
    bio: 'Pressure washing services in Brighton and surrounding areas. Driveways, patios, decks, and render cleaning.',
    total_jobs_completed: 35,
    years_experience: 2,
    available_weekdays: true,
    available_weekends: true,
    emergency_calls: false,
    is_featured: false,
  },
];

const sampleReviews = [
  {
    pro_email: 'sarah@cleanpro.co.uk',
    client_name: 'John D.',
    rating: 5,
    title: 'Excellent Service',
    comment: 'Sarah did a fantastic job. My house has never been cleaner. Highly recommend!',
    service_type: 'house-cleaning',
    is_verified: true,
  },
  {
    pro_email: 'sarah@cleanpro.co.uk',
    client_name: 'Mary S.',
    rating: 5,
    title: 'Very Professional',
    comment: 'Arrived on time, very thorough. Will book again.',
    service_type: 'house-cleaning',
    is_verified: true,
  },
  {
    pro_email: 'mike@powerwash.uk',
    client_name: 'Steve R.',
    rating: 5,
    title: 'Amazing Results',
    comment: 'My driveway looks brand new. Great price too!',
    service_type: 'pressure-washing',
    is_verified: true,
  },
  {
    pro_email: 'david@sparkyelectrics.co.uk',
    client_name: 'Patricia K.',
    rating: 5,
    title: 'Very Reliable',
    comment: 'David is brilliant. Fixed my electrical issues quickly and safely.',
    service_type: 'electricians',
    is_verified: true,
  },
  {
    pro_email: 'james@carpetcare.co.uk',
    client_name: 'Linda M.',
    rating: 5,
    title: 'Carpets Like New',
    comment: 'Professional service, carpets look amazing. Would highly recommend.',
    service_type: 'carpet-cleaning',
    is_verified: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    
    // Check if data already exists
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (existingProfiles && existingProfiles.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already seeded',
        professionals_count: existingProfiles.length,
      });
    }

    // Insert sample professionals
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .insert(sampleProfessionals)
      .select();

    if (profileError) {
      console.error('Error seeding profiles:', profileError);
      return NextResponse.json({
        success: false,
        error: 'Failed to seed profiles: ' + profileError.message,
      }, { status: 500 });
    }

    // Get profile IDs and insert reviews
    if (profiles && profiles.length > 0) {
      const profileMap: Record<string, string> = {};
      
      // Build email to ID mapping
      sampleProfessionals.forEach((pro, index) => {
        if (profiles[index]) {
          profileMap[pro.email] = profiles[index].id;
        }
      });

      // Prepare reviews with correct pro_id
      const reviewsToInsert = sampleReviews
        .map(review => ({
          pro_id: profileMap[review.pro_email],
          client_name: review.client_name,
          rating: review.rating,
          title: review.title,
          comment: review.comment,
          service_type: review.service_type,
          is_verified: review.is_verified,
        }))
        .filter(r => r.pro_id); // Only include reviews with valid pro_id

      if (reviewsToInsert.length > 0) {
        const { error: reviewError } = await supabase
          .from('reviews')
          .insert(reviewsToInsert);

        if (reviewError) {
          console.error('Error seeding reviews:', reviewError);
          // Don't fail the whole operation for review errors
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      professionals_count: profiles?.length || 0,
      reviews_count: sampleReviews.length,
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to seed database',
    }, { status: 500 });
  }
}

