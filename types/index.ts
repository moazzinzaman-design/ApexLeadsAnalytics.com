// Database Types for Apex Leads Analytics

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

export type ServiceCategory = 
  | 'house-cleaning'
  | 'pressure-washing'
  | 'gutter-cleaning'
  | 'car-detailing'
  | 'garden-maintenance'
  | 'carpet-cleaning'
  | 'electricians'
  | 'handywoman'
  | 'plumbing'
  | 'painting'
  | 'other';

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  
  // User identification
  user_id?: string; // If linked to auth
  email: string;
  name: string;
  phone?: string;
  
  // Business details
  business_name?: string;
  bio?: string;
  category: ServiceCategory;
  subcategories?: ServiceCategory[];
  
  // Location
  city: string;
  county?: string;
  postcode: string;
  latitude?: number;
  longitude?: number;
  service_radius?: number; // in miles
  
  // Pricing
  hourly_rate?: number;
  callout_fee?: number;
  starting_price?: number;
  
  // Verification & Status
  verified_status: boolean;
  verified_at?: string;
  
  // Business presence
  image_url?: string;
  cover_image_url?: string;
  website?: string;
  
  // Subscription
  subscription_tier: SubscriptionTier;
  subscription_expires_at?: string;
  
  // Stats
  total_jobs_completed?: number;
  years_experience?: number;
  
  // Availability
  available_weekdays?: boolean;
  available_weekends?: boolean;
  emergency_calls?: boolean;
  
  // Social proof
  is_featured?: boolean;
  is_premium?: boolean;
  
  // Distance (calculated at runtime)
  distance_km?: number;
  distance_miles?: number;
}

export interface Lead {
  id: string;
  created_at: string;
  
  // Client information
  client_name: string;
  client_email: string;
  client_phone: string;
  
  // Lead details
  service_type: ServiceCategory;
  message?: string;
  urgency?: 'low' | 'medium' | 'high' | 'emergency';
  
  // Location
  postcode?: string;
  city?: string;
  
  // Assignment
  assigned_pro_id?: string;
  assigned_at?: string;
  
  // Status
  status: 'new' | 'contacted' | 'quoted' | 'booked' | 'completed' | 'lost';
  
  // Lead source
  source?: string;
  utm_campaign?: string;
  utm_source?: string;
  
  // Pricing
  lead_price?: number;
  paid_at?: string;
  
  // Blurring for free tier
  is_blurred?: boolean;
}

export interface Review {
  id: string;
  created_at: string;
  
  // Review details
  pro_id: string;
  client_name: string;
  client_email?: string;
  
  // Rating (1-5)
  rating: number;
  title?: string;
  comment?: string;
  
  // Service details
  service_type?: ServiceCategory;
  job_date?: string;
  job_completed?: boolean;
  
  // Response
  pro_response?: string;
  pro_response_at?: string;
  
  // Verification
  is_verified: boolean;
}

export interface SearchFilters {
  category?: ServiceCategory;
  postcode?: string;
  city?: string;
  radius?: number; // in miles
  min_rating?: number;
  max_hourly_rate?: number;
  verified_only?: boolean;
  available_weekends?: boolean;
  emergency_calls?: boolean;
}

export interface SearchResult {
  profiles: Profile[];
  total_count: number;
  has_more: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Lead submission types
export interface LeadSubmission {
  pro_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_type: ServiceCategory;
  message?: string;
  postcode?: string;
  city?: string;
  urgency?: 'low' | 'medium' | 'high' | 'emergency';
}

// Dashboard stats
export interface DashboardStats {
  total_leads: number;
  new_leads: number;
  contacted_leads: number;
  quoted_leads: number;
  booked_leads: number;
  completed_leads: number;
  total_revenue: number;
  conversion_rate: number;
}

