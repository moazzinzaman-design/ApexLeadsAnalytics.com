import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseKey);
};

// UK cities with coordinates
const ukCities = [
  { city: 'London', county: 'Greater London', lat: 51.5074, lon: -0.1278 },
  { city: 'Birmingham', county: 'West Midlands', lat: 52.4862, lon: -1.8904 },
  { city: 'Manchester', county: 'Greater Manchester', lat: 53.4808, lon: -2.2446 },
  { city: 'Leeds', county: 'West Yorkshire', lat: 53.7965, lon: -1.5462 },
  { city: 'Glasgow', county: 'Lanarkshire', lat: 55.8642, lon: -4.2518 },
  { city: 'Liverpool', county: 'Merseyside', lat: 53.4084, lon: -2.9916 },
  { city: 'Newcastle', county: 'Tyne and Wear', lat: 54.9783, lon: -1.6178 },
  { city: 'Sheffield', county: 'South Yorkshire', lat: 53.3811, lon: -1.4701 },
  { city: 'Bristol', county: 'Somerset', lat: 51.4545, lon: -2.5879 },
  { city: 'Edinburgh', county: 'Midlothian', lat: 55.9533, lon: -3.1883 },
  { city: 'Cardiff', county: 'South Glamorgan', lat: 51.4816, lon: -3.1791 },
  { city: 'Belfast', county: 'Antrim', lat: 54.5964, lon: -5.9300 },
  { city: 'Nottingham', county: 'Nottinghamshire', lat: 52.9536, lon: -1.1505 },
  { city: 'Southampton', county: 'Hampshire', lat: 50.9097, lon: -1.4044 },
  { city: 'Brighton', county: 'East Sussex', lat: 50.8276, lon: -0.1525 },
  { city: 'Leicester', county: 'Leicestershire', lat: 52.6347, lon: -1.1315 },
  { city: 'Oxford', county: 'Oxfordshire', lat: 51.7548, lon: -1.2544 },
  { city: 'Cambridge', county: 'Cambridgeshire', lat: 52.2053, lon: 0.1218 },
  { city: 'Bournemouth', county: 'Dorset', lat: 50.7208, lon: -1.8795 },
  { city: 'Plymouth', county: 'Devon', lat: 50.3755, lon: -4.1427 },
  { city: 'Derby', county: 'Derbyshire', lat: 52.9225, lon: -1.4746 },
  { city: 'Wolverhampton', county: 'West Midlands', lat: 52.5914, lon: -2.0684 },
  { city: 'Coventry', county: 'West Midlands', lat: 52.4068, lon: -1.5197 },
  { city: 'York', county: 'North Yorkshire', lat: 53.9600, lon: -1.0800 },
  { city: 'Exeter', county: 'Devon', lat: 50.7236, lon: -3.5275 },
  { city: 'Chelmsford', county: 'Essex', lat: 51.7358, lon: 0.4731 },
  { city: 'Blackpool', county: 'Lancashire', lat: 53.8175, lon: -3.0357 },
  { city: 'Doncaster', county: 'South Yorkshire', lat: 53.5228, lon: -1.1312 },
  { city: 'Swindon', county: 'Wiltshire', lat: 51.5558, lon: -1.7792 },
  { city: 'Bury', county: 'Greater Manchester', lat: 53.5350, lon: -2.3518 },
  { city: 'Preston', county: 'Lancashire', lat: 53.7596, lon: -2.7015 },
  { city: 'Middlesbrough', county: 'North Yorkshire', lat: 54.5742, lon: -1.2349 },
  { city: 'Sunderland', county: 'Tyne and Wear', lat: 54.8964, lon: -1.4903 },
  { city: 'Wigan', county: 'Greater Manchester', lat: 53.5443, lon: -2.6371 },
  { city: 'Stockport', county: 'Greater Manchester', lat: 53.4106, lon: -2.1575 },
  { city: 'Oldham', county: 'Greater Manchester', lat: 53.5408, lon: -2.1182 },
  { city: 'Rochdale', county: 'Greater Manchester', lat: 53.6136, lon: -2.1550 },
  { city: 'Warrington', county: 'Cheshire', lat: 53.3900, lon: -2.5970 },
  { city: 'Bolton', county: 'Greater Manchester', lat: 53.5769, lon: -2.4180 },
  { city: 'Stoke-on-Trent', county: 'Staffordshire', lat: 53.0027, lon: -2.1794 },
  { city: 'Swansea', county: 'West Glamorgan', lat: 51.6248, lon: -3.9443 },
  { city: 'Bradford', county: 'West Yorkshire', lat: 53.7959, lon: -1.7594 },
  { city: 'Southend-on-Sea', county: 'Essex', lat: 51.5378, lon: 0.7143 },
  { city: 'Huddersfield', county: 'West Yorkshire', lat: 53.6419, lon: -1.7768 },
  { city: 'Salford', county: 'Greater Manchester', lat: 53.4877, lon: -2.2909 },
  { city: 'Kingston upon Hull', county: 'East Riding', lat: 53.7441, lon: -0.3320 },
];

const serviceCategories = [
  'house-cleaning',
  'pressure-washing',
  'gutter-cleaning',
  'car-detailing',
  'garden-maintenance',
  'carpet-cleaning',
  'electricians',
  'handywoman',
  'plumbing',
  'painting'
];

const firstNames = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
  'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen',
  'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
  'Mohammed', 'Ahmed', 'Ali', 'Hassan', 'Hussain', 'Omar', 'Yusuf', 'Ibrahim', 'Khan', 'Patel'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

const businessSuffixes = [
  'Services', 'Solutions', 'Ltd', 'Co', 'Pros', 'Experts', 'Specialists', 'Masters',
  'Team', 'Company', 'Works', 'Care', 'Clean', 'Fix', 'Build', 'Handy', 'Pro'
];

const bioTemplates = [
  'Professional {service} with over {years} years of experience. Fully insured and DBS checked. Providing quality workmanship across {city} and surrounding areas.',
  'Expert {service} specialist serving {city} for {years} years. Customer satisfaction guaranteed. Free quotes available.',
  'Reliable and trustworthy {service} professional. {years} years in the trade. No job too small. Available for emergency callouts.',
  'Quality {service} services in {city}. Experienced, vetted, and verified. Competitive pricing with no hidden fees.',
  'Family-run {service} business with {years} years of experience. We treat every home as if it were our own.',
  '{years} years providing {service} to happy customers in {city}. Fully equipped and insured. References available.',
  'Specialist {service} provider covering {city} and wider area. Professional, punctual, and polite. Get in touch for a free consultation.',
  'Your local {service} expert in {city}. {years} years of experience means the job gets done right first time.',
];

const serviceLabels: Record<string, string> = {
  'house-cleaning': 'house cleaning',
  'pressure-washing': 'pressure washing',
  'gutter-cleaning': 'gutter cleaning',
  'car-detailing': 'car detailing',
  'garden-maintenance': 'garden maintenance',
  'carpet-cleaning': 'carpet cleaning',
  'electricians': 'electrical services',
  'handywoman': 'handyman services',
  'plumbing': 'plumbing services',
  'painting': 'painting and decorating',
};

function generatePostcode(city: string): string {
  const prefixes = ['AB', 'AL', 'B', 'BA', 'BB', 'BD', 'BH', 'BL', 'BN', 'BR', 'BS', 'BT', 'CA', 'CB', 'CF', 'CH', 'CM', 'CO', 'CR', 'CT', 'CV', 'CW', 'DA', 'DD', 'DE', 'DG', 'DH', 'DL', 'DN', 'DT', 'DY', 'E', 'EC', 'EH', 'EX', 'FK', 'FY', 'G', 'GL', 'GY', 'HA', 'HD', 'HG', 'HP', 'HR', 'HS', 'HU', 'HX', 'IG', 'IP', 'IV', 'JE', 'KA', 'KT', 'KW', 'KY', 'L', 'LA', 'LD', 'LE', 'LL', 'LN', 'LS', 'LU', 'M', 'ME', 'MK', 'ML', 'N', 'NE', 'NG', 'NN', 'NP', 'NR', 'NW', 'OL', 'OX', 'PA', 'PE', 'PH', 'PL', 'PO', 'PR', 'RG', 'RH', 'RM', 'S', 'SA', 'SE', 'SG', 'SK', 'SL', 'SM', 'SN', 'SO', 'SP', 'SR', 'SS', 'ST', 'SW', 'SY', 'TA', 'TD', 'TF', 'TN', 'TQ', 'TR', 'TS', 'TW', 'UB', 'W', 'WA', 'WC', 'WD', 'WF', 'WN', 'WR', 'WS', 'WV', 'YO', 'ZE'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = Math.floor(Math.random() * 99) + 1;
  const letter1 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const letter2 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${prefix}${number} ${letter1}${letter2}${letter2}`;
}

function generateProfessional(index: number) {
  const cityData = ukCities[index % ukCities.length];
  const category = serviceCategories[Math.floor(Math.random() * serviceCategories.length)];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const fullName = `${firstName} ${lastName}`;
  const businessName = `${firstName}'s ${businessSuffixes[Math.floor(Math.random() * businessSuffixes.length)]}`;
  
  const yearsExp = Math.floor(Math.random() * 15) + 1;
  const jobsCompleted = Math.floor(Math.random() * 500) + 10;
  const hourlyRate = Math.floor(Math.random() * 40) + 20;
  
  const bio = bioTemplates[Math.floor(Math.random() * bioTemplates.length)]
    .replace('{service}', serviceLabels[category])
    .replace('{city}', cityData.city)
    .replace('{years}', yearsExp.toString());
  
  // Add some random jitter to coordinates
  const lat = cityData.lat + (Math.random() - 0.5) * 0.3;
  const lon = cityData.lon + (Math.random() - 0.5) * 0.3;
  
  const verified = Math.random() > 0.3;
  const tiers: Array<'free' | 'basic' | 'pro' | 'enterprise'> = verified 
    ? ['basic', 'pro', 'pro', 'enterprise'] 
    : ['free', 'free', 'basic'];
  const tier = tiers[Math.floor(Math.random() * tiers.length)];
  
  const emailName = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${firstName.toLowerCase()}services.co.uk`;

  return {
    name: fullName,
    email: emailName,
    phone: `07${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`,
    business_name: businessName,
    category,
    city: cityData.city,
    county: cityData.county,
    postcode: generatePostcode(cityData.city),
    latitude: lat,
    longitude: lon,
    hourly_rate: hourlyRate,
    starting_price: hourlyRate * 2,
    verified_status: verified,
    subscription_tier: tier,
    bio,
    total_jobs_completed: jobsCompleted,
    years_experience: yearsExp,
    available_weekdays: Math.random() > 0.2,
    available_weekends: Math.random() > 0.6,
    emergency_calls: tier === 'pro' || tier === 'enterprise' ? Math.random() > 0.5 : false,
    is_featured: tier === 'enterprise',
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    
    // Check how many profiles exist
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const currentCount = count || 0;
    const targetCount = 250;
    const toAdd = Math.max(0, targetCount - currentCount);
    
    if (toAdd === 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already has sufficient professionals',
        professionals_count: currentCount,
        target: targetCount,
      });
    }

    console.log(`Adding ${toAdd} professionals to the database...`);
    
    // Generate and insert professionals in batches
    const batchSize = 50;
    let added = 0;
    
    for (let i = 0; i < toAdd; i += batchSize) {
      const batch = [];
      for (let j = 0; j < batchSize && (i + j) < toAdd; j++) {
        batch.push(generateProfessional(currentCount + i + j));
      }
      
      const { error } = await supabase
        .from('profiles')
        .insert(batch);
      
      if (error) {
        console.error('Error inserting batch:', error);
      } else {
        added += batch.length;
        console.log(`Added ${added}/${toAdd} professionals...`);
      }
    }

    // Get final count
    const { count: finalCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      message: `Successfully added ${added} professionals`,
      added_count: added,
      total_count: finalCount,
      cities_covered: ukCities.length,
      categories: serviceCategories.length,
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to seed database',
    }, { status: 500 });
  }
}

