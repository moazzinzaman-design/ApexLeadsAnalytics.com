"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchHero from "@/components/SearchHero";
import DirectoryGrid from "@/components/DirectoryGrid";
import { Profile, ServiceCategory } from "@/types";

// Service categories for filter
const serviceCategories: { value: ServiceCategory; label: string }[] = [
  { value: "house-cleaning", label: "House Cleaning" },
  { value: "pressure-washing", label: "Pressure Washing" },
  { value: "gutter-cleaning", label: "Gutter Cleaning" },
  { value: "car-detailing", label: "Car Detailing" },
  { value: "garden-maintenance", label: "Garden Maintenance" },
  { value: "carpet-cleaning", label: "Carpet Cleaning" },
  { value: "electricians", label: "Electricians" },
  { value: "handywoman", label: "Handywoman" },
  { value: "plumbing", label: "Plumbing" },
  { value: "painting", label: "Painting" },
];

function DirectoryContent() {
  const searchParams = useSearchParams();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [category, setCategory] = useState<string>(searchParams.get("category") || "");
  const [location, setLocation] = useState<string>(searchParams.get("location") || "");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<string>("distance");

  // Fetch profiles from API
  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Build query params
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (location) params.append('postcode', location);
        if (verifiedOnly) params.append('verified', 'true');
        params.append('limit', '50');
        
        const response = await fetch(`/api/search?${params.toString()}`);
        const result = await response.json();
        
        if (result.success && result.data?.profiles) {
          setProfiles(result.data.profiles);
        } else {
          // API call failed, show empty state
          console.error('Failed to fetch profiles:', result.error);
          setProfiles([]);
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError('Unable to load professionals. Please try again.');
        setProfiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, [category, location, verifiedOnly]);

  // Apply filters locally
  useEffect(() => {
    let filtered = [...profiles];

    // Category filter
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    // Location filter
    if (location) {
      filtered = filtered.filter(p => 
        p.city?.toLowerCase().includes(location.toLowerCase()) ||
        p.postcode?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Verified only
    if (verifiedOnly) {
      filtered = filtered.filter(p => p.verified_status);
    }

    // Max price
    if (maxPrice) {
      filtered = filtered.filter(p => (p.starting_price || p.hourly_rate || 999) <= maxPrice);
    }

    // Sort
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => (a.starting_price || a.hourly_rate || 999) - (b.starting_price || b.hourly_rate || 999));
        break;
      case "price_high":
        filtered.sort((a, b) => (b.starting_price || b.hourly_rate || 0) - (a.starting_price || a.hourly_rate || 0));
        break;
      case "rating":
        filtered.sort((a, b) => (b.total_jobs_completed || 0) - (a.total_jobs_completed || 0));
        break;
      default:
        // Distance or verified status first
        filtered.sort((a, b) => {
          if (a.verified_status !== b.verified_status) {
            return a.verified_status ? -1 : 1;
          }
          return (b.total_jobs_completed || 0) - (a.total_jobs_completed || 0);
        });
    }

    setFilteredProfiles(filtered);
  }, [profiles, category, location, verifiedOnly, maxPrice, sortBy]);

  // Update category from URL
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setCategory(cat);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="pt-20">
        <SearchHero />
      </div>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Filters Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Find Professionals
              </h1>
              <p className="text-text-secondary mt-1">
                {filteredProfiles.length} professionals found
                {category && ` for ${serviceCategories.find(c => c.value === category)?.label}`}
                {location && ` near ${location}`}
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-text-secondary hover:text-white hover:border-white/20"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className={`
              lg:w-72 flex-shrink-0
              ${showFilters ? 'block' : 'hidden'}
              lg:block
            `}>
              <div className="card p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white">Filters</h2>
                  <button
                    onClick={() => {
                      setCategory("");
                      setLocation("");
                      setVerifiedOnly(false);
                      setMaxPrice("");
                      setSortBy("distance");
                    }}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Clear all
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Service Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="input"
                    >
                      <option value="">All Services</option>
                      {serviceCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City or postcode"
                      className="input"
                    />
                  </div>

                  {/* Verified Only */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <span className="text-sm text-text-secondary">Verified professionals only</span>
                    </label>
                  </div>

                  {/* Max Price */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Max Starting Price (£)
                    </label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                      placeholder="Any price"
                      className="input"
                    />
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input"
                    >
                      <option value="distance">Nearest First</option>
                      <option value="rating">Highest Rated</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </aside>

            {/* Results Grid */}
            <div className="flex-1">
              <DirectoryGrid
                profiles={filteredProfiles}
                isLoading={isLoading}
              />
              {error && (
                <div className="card p-8 text-center">
                  <p className="text-text-secondary">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 text-primary hover:text-primary/80"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <DirectoryContent />
    </Suspense>
  );
}

