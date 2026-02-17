import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Edge runtime for ultra-fast response
export const runtime = 'edge';

// Create admin client for server-side operations
const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseKey);
};

// Haversine formula to calculate distance between two coordinates
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// UK postcode to coordinates (simplified lookup)
const postcodeCoords: Record<string, { lat: number; lon: number }> = {
  'M1': { lat: 53.4808, lon: -2.2446 }, // Manchester
  'M2': { lat: 53.4808, lon: -2.2446 },
  'LS1': { lat: 53.7965, lon: -1.5462 }, // Leeds
  'LS2': { lat: 53.7965, lon: -1.5462 },
  'B1': { lat: 52.4862, lon: -1.8904 }, // Birmingham
  'B2': { lat: 52.4862, lon: -1.8904 },
  'SW1': { lat: 51.5074, lon: -0.1278 }, // London
  'W1': { lat: 51.5074, lon: -0.1278 },
  'EC1': { lat: 51.5176, lon: -0.1062 },
  'E1': { lat: 51.5099, lon: -0.0059 },
  'N1': { lat: 51.5465, lon: -0.1058 },
  'BS1': { lat: 51.4545, lon: -2.5879 }, // Bristol
  'L1': { lat: 53.4084, lon: -2.9916 }, // Liverpool
  'S1': { lat: 53.3811, lon: -1.4701 }, // Sheffield
  'NE1': { lat: 54.9783, lon: -1.6178 }, // Newcastle
  'G1': { lat: 55.8642, lon: -4.2518 }, // Glasgow
  'EH1': { lat: 55.9533, lon: -3.1883 }, // Edinburgh
  'CF1': { lat: 51.4816, lon: -3.1791 }, // Cardiff
  'BT1': { lat: 54.5964, lon: -5.9300 }, // Belfast
  'NG1': { lat: 52.9536, lon: -1.1505 }, // Nottingham
  'SO1': { lat: 50.9097, lon: -1.4044 }, // Southampton
  'BN1': { lat: 50.8276, lon: -0.1525 }, // Brighton
  'LE1': { lat: 52.6347, lon: -1.1315 }, // Leicester
};

// Get coordinates from postcode (simplified)
function getCoordsFromPostcode(postcode: string): { lat: number; lon: number } | null {
  const prefix = postcode.substring(0, 3).toUpperCase();
  const coords = postcodeCoords[prefix];
  
  if (coords) {
    const jitter = 0.02;
    return {
      lat: coords.lat + (Math.random() - 0.5) * jitter,
      lon: coords.lon + (Math.random() - 0.5) * jitter,
    };
  }
  
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category') || '';
    const postcode = searchParams.get('postcode') || searchParams.get('location') || '';
    const radius = parseInt(searchParams.get('radius') || '25');
    const verifiedOnly = searchParams.get('verified') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sort') || 'rating';

    // Get coordinates if postcode provided
    const searchCoords = postcode ? getCoordsFromPostcode(postcode) : null;

    // Try to fetch from Supabase
    let profiles: any[] = [];
    let totalCount = 0;

    try {
      const supabase = getSupabaseAdmin();
      
      // Build query - fetch ALL profiles if no filters, or apply category filter
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Apply category filter
      if (category) {
        query = query.eq('category', category);
      }

      // Apply verified filter
      if (verifiedOnly) {
        query = query.eq('verified_status', true);
      }

      // Execute query - get more profiles for client-side filtering
      const { data, count, error } = await query
        .range(0, 100) // Get up to 100 profiles
        .order('verified_status', { ascending: false })
        .order('total_jobs_completed', { ascending: false });

      if (error) {
        console.error('Supabase query error:', error);
      } else {
        profiles = data || [];
        totalCount = count || 0;
      }
    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError);
      // Continue with empty results if Supabase fails
    }

    // If we have search coordinates and profile coordinates, calculate distances
    if (searchCoords && profiles.length > 0) {
      profiles = profiles.map(p => {
        if (p.latitude && p.longitude) {
          const distanceKm = calculateDistance(
            searchCoords.lat,
            searchCoords.lon,
            p.latitude,
            p.longitude
          );
          return {
            ...p,
            distance_km: distanceKm,
            distance_miles: distanceKm * 0.621371,
          };
        }
        return p;
      });

      // Sort by distance if coordinates available
      if (sortBy === 'distance') {
        profiles.sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
      } else if (sortBy === 'price') {
        profiles.sort((a, b) => (a.starting_price || 0) - (b.starting_price || 0));
      } else if (sortBy === 'rating') {
        profiles.sort((a, b) => (b.total_jobs_completed || 0) - (a.total_jobs_completed || 0));
      }

      // Filter by radius
      profiles = profiles.filter(p => (p.distance_miles || 0) <= radius);
    } else if (profiles.length > 0) {
      // No location provided - sort by rating/jobs by default
      if (sortBy === 'rating') {
        profiles.sort((a, b) => (b.total_jobs_completed || 0) - (a.total_jobs_completed || 0));
      } else if (sortBy === 'price_low') {
        profiles.sort((a, b) => (a.starting_price || a.hourly_rate || 999) - (b.starting_price || b.hourly_rate || 999));
      } else if (sortBy === 'price_high') {
        profiles.sort((a, b) => (b.starting_price || b.hourly_rate || 0) - (a.starting_price || a.hourly_rate || 0));
      }
    }

    // Limit results
    profiles = profiles.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        profiles,
        total_count: totalCount,
        has_more: totalCount > offset + limit,
        search_location: postcode || 'UK',
        search_coords: searchCoords,
        radius_miles: radius,
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search professionals',
      },
      { status: 500 }
    );
  }
}

