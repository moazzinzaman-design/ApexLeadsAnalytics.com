-- Apex Leads Analytics - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- PROFILES TABLE (Trades Professionals)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- User identification
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  
  -- Business details
  business_name TEXT,
  bio TEXT,
  category TEXT NOT NULL, -- 'house-cleaning', 'pressure-washing', etc.
  subcategories TEXT[], -- Array of categories
  
  -- Location
  city TEXT NOT NULL,
  county TEXT,
  postcode TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  service_radius INTEGER DEFAULT 10, -- in miles
  
  -- Pricing
  hourly_rate NUMERIC(10,2),
  callout_fee NUMERIC(10,2),
  starting_price NUMERIC(10,2),
  
  -- Verification & Status
  verified_status BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Business presence
  image_url TEXT,
  cover_image_url TEXT,
  website TEXT,
  
  -- Subscription
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'pro', 'enterprise')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Stats
  total_jobs_completed INTEGER DEFAULT 0,
  years_experience INTEGER DEFAULT 0,
  
  -- Availability
  available_weekdays BOOLEAN DEFAULT TRUE,
  available_weekends BOOLEAN DEFAULT FALSE,
  emergency_calls BOOLEAN DEFAULT FALSE,
  
  -- Social proof
  is_featured BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE
);

-- Create indexes for common queries
CREATE INDEX idx_profiles_category ON profiles(category);
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_postcode ON profiles(postcode);
CREATE INDEX idx_profiles_verified ON profiles(verified_status) WHERE verified_status = true;
CREATE INDEX idx_profiles_subscription ON profiles(subscription_tier) WHERE subscription_tier IN ('pro', 'enterprise');

-- ============================================
-- LEADS TABLE
-- ============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Client information
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  
  -- Lead details
  service_type TEXT NOT NULL,
  message TEXT,
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'emergency')),
  
  -- Location
  postcode TEXT,
  city TEXT,
  
  -- Assignment
  assigned_pro_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'booked', 'completed', 'lost')),
  
  -- Lead source
  source TEXT,
  utm_campaign TEXT,
  utm_source TEXT,
  
  -- Pricing
  lead_price NUMERIC(10,2),
  paid_at TIMESTAMP WITH TIME ZONE,
  
  -- Blurring for free tier (private info hidden)
  is_blurred BOOLEAN DEFAULT FALSE
);

-- Create indexes
CREATE INDEX idx_leads_service_type ON leads(service_type);
CREATE INDEX idx_leads_assigned_pro ON leads(assigned_pro_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Review details
  pro_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT,
  
  -- Rating (1-5)
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  
  -- Service details
  service_type TEXT,
  job_date DATE,
  job_completed BOOLEAN DEFAULT TRUE,
  
  -- Response
  pro_response TEXT,
  pro_response_at TIMESTAMP WITH TIME ZONE,
  
  -- Verification
  is_verified BOOLEAN DEFAULT FALSE
);

-- Create indexes
CREATE INDEX idx_reviews_pro_id ON reviews(pro_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can read, only owners can update
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- Leads: Pros can read their own leads, clients can only see their own
CREATE POLICY "Professionals can view their own leads" 
  ON leads FOR SELECT 
  USING (assigned_pro_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can create a lead" 
  ON leads FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Pros can update their own leads" 
  ON leads FOR UPDATE 
  USING (assigned_pro_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Reviews: Anyone can read, only clients can create, pros can respond
CREATE POLICY "Reviews are viewable by everyone" 
  ON reviews FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can create a review" 
  ON reviews FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Pros can respond to reviews" 
  ON reviews FOR UPDATE 
  USING (pro_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Calculate distance between two points using Haversine formula
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DOUBLE PRECISION,
  lon1 DOUBLE PRECISION,
  lat2 DOUBLE PRECISION,
  lon2 DOUBLE PRECISION
)
RETURNS DOUBLE PRECISION AS $$
BEGIN
  RETURN (
    6371 * acos(
      cos(radians(lat2)) * cos(radians(lat1)) * 
      cos(radians(lon1) - radians(lon2)) + 
      sin(radians(lat2)) * sin(radians(lat1))
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Search professionals within radius
CREATE OR REPLACE FUNCTION search_pros_by_location(
  search_category TEXT,
  search_lat DOUBLE PRECISION,
  search_lon DOUBLE PRECISION,
  search_radius INTEGER DEFAULT 25
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  business_name TEXT,
  category TEXT,
  city TEXT,
  postcode TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  hourly_rate NUMERIC,
  starting_price NUMERIC,
  verified_status BOOLEAN,
  subscription_tier TEXT,
  image_url TEXT,
  distance_km DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.business_name,
    p.category,
    p.city,
    p.postcode,
    p.latitude,
    p.longitude,
    p.hourly_rate,
    p.starting_price,
    p.verified_status,
    p.subscription_tier,
    p.image_url,
    calculate_distance(search_lat, search_lon, p.latitude, p.longitude) as distance_km
  FROM profiles p
  WHERE 
    p.category = search_category
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND calculate_distance(search_lat, search_lon, p.latitude, p.longitude) <= search_radius
  ORDER BY 
    p.verified_status DESC,
    p.subscription_tier DESC,
    p.total_jobs_completed DESC,
    distance_km ASC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample professionals
INSERT INTO profiles (name, email, category, city, postcode, latitude, longitude, hourly_rate, verified_status, subscription_tier, bio, total_jobs_completed) VALUES
('Sarah Johnson', 'sarah@cleanpro.co.uk', 'house-cleaning', 'Manchester', 'M1 1AA', 53.4808, -2.2446, 25.00, true, 'pro', 'Professional cleaner with 10 years experience. DBS checked and fully insured.', 450),
('Mike Thompson', 'mike@powerwash.uk', 'pressure-washing', 'Leeds', 'LS1 1AA', 53.7965, -1.5462, 35.00, true, 'pro', 'Expert pressure washing for driveways, patios and decks. Fully insured.', 280),
('Emma Williams', 'emma@handyhelp.co.uk', 'handywoman', 'Birmingham', 'B1 1AA', 52.4862, -1.8904, 30.00, true, 'basic', 'General handywoman services. TV mounting, furniture assembly, odd jobs.', 120),
('David Brown', 'david@sparkyelectrics.co.uk', 'electricians', 'London', 'SW1A 1AA', 51.5074, -0.1278, 50.00, true, 'enterprise', 'Fully qualified NICEIC electrician. Emergency callouts available.', 680),
('Lisa Green', 'lisa@gardeners.uk', 'garden-maintenance', 'Bristol', 'BS1 1AA', 51.4545, -2.5879, 28.00, false, 'free', 'Local gardener offering lawn mowing, hedge trimming and general maintenance.', 45),
('James Miller', 'james@carpetcare.co.uk', 'carpet-cleaning', 'Liverpool', 'L1 1AA', 53.4084, -2.9916, 40.00, true, 'pro', 'Professional carpet and upholstery cleaning. Hot water extraction expert.', 310),
('Anna White', 'anna@sparkleclean.co.uk', 'car-detailing', 'Sheffield', 'S1 1AA', 53.3811, -1.4701, 45.00, true, 'pro', 'Mobile car detailing. Interior/exterior detailing, ceramic coating.', 195),
('Robert Taylor', 'robert@gutterpro.co.uk', 'gutter-cleaning', 'Newcastle', 'NE1 1AA', 54.9783, -1.6178, 35.00, false, 'free', 'Gutter cleaning and minor repairs. Free quotes.', 60);

-- Insert sample reviews
INSERT INTO reviews (pro_id, client_name, rating, title, comment, service_type, is_verified) VALUES
((SELECT id FROM profiles WHERE email = 'sarah@cleanpro.co.uk' LIMIT 1), 'John D.', 5, 'Excellent Service', 'Sarah did a fantastic job. My house has never been cleaner. Highly recommend!', 'house-cleaning', true),
((SELECT id FROM profiles WHERE email = 'sarah@cleanpro.co.uk' LIMIT 1), 'Mary S.', 5, 'Very Professional', 'Arrived on time, very thorough. Will book again.', 'house-cleaning', true),
((SELECT id FROM profiles WHERE email = 'mike@powerwash.uk' LIMIT 1), 'Steve R.', 5, 'Amazing Results', 'My driveway looks brand new. Great price too!', 'pressure-washing', true),
((SELECT id FROM profiles WHERE email = 'david@sparkyelectrics.co.uk' LIMIT 1), 'Patricia K.', 5, 'Very Reliable', 'David is brilliant. Fixed my electrical issues quickly and safely.', 'electricians', true);

-- ============================================
-- SEED MORE RANDOM DATA (Optional)
-- ============================================

-- This can be run multiple times to add more test data
DO $$
DECLARE
  categories TEXT[] := ARRAY['house-cleaning', 'pressure-washing', 'gutter-cleaning', 'car-detailing', 'garden-maintenance', 'carpet-cleaning', 'electricians', 'handywoman'];
  cities TEXT[] := ARRAY[
    'Manchester', 'Leeds', 'Birmingham', 'London', 'Bristol', 'Liverpool', 'Sheffield', 'Newcastle',
    'Glasgow', 'Edinburgh', 'Cardiff', 'Belfast', 'Nottingham', 'Southampton', 'Brighton', 'Leicester'
  ];
  first_names TEXT[] := ARRAY['Alex', 'Chris', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Jamie', 'Riley', 'Avery', 'Quinn'];
  last_names TEXT[] := ARRAY['Smith', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Thomas'];
  i INTEGER;
BEGIN
  FOR i IN 1..20 LOOP
    INSERT INTO profiles (
      name,
      email,
      category,
      city,
      postcode,
      latitude,
      longitude,
      hourly_rate,
      verified_status,
      subscription_tier,
      bio,
      total_jobs_completed,
      years_experience
    ) VALUES (
      first_names[1 + floor(random() * 10)::int] || ' ' || last_names[1 + floor(random() * 10)::int],
      'pro' || i || '@example.com',
      categories[1 + floor(random() * 8)::int],
      cities[1 + floor(random() * 16)::int],
      'AB' || floor(random() * 99 + 1)::int || ' ' || floor(random() * 9 + 1)::int || floor(random() * 9 + 1)::int || floor(random() * 9 + 1)::int || 'AA',
      50 + random() * 10 - 5,
      -5 + random() * 10,
      20 + floor(random() * 50)::int,
      random() > 0.5,
      CASE floor(random() * 4)::int WHEN 0 THEN 'free' WHEN 1 THEN 'basic' WHEN 2 THEN 'pro' ELSE 'enterprise' END,
      'Professional service provider with years of experience in the industry.',
      floor(random() * 200 + 10)::int,
      floor(random() * 15 + 1)::int
    );
  END LOOP;
END $$;

