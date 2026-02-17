"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ServiceCategory } from "@/types";

const serviceCategories: { value: ServiceCategory; label: string; icon: string }[] = [
  { value: "house-cleaning", label: "House Cleaning", icon: "🧹" },
  { value: "pressure-washing", label: "Pressure Washing", icon: "💦" },
  { value: "gutter-cleaning", label: "Gutter Cleaning", icon: "🪜" },
  { value: "car-detailing", label: "Car Detailing", icon: "🚗" },
  { value: "garden-maintenance", label: "Garden Maintenance", icon: "🌿" },
  { value: "carpet-cleaning", label: "Carpet Cleaning", icon: "🛋️" },
  { value: "electricians", label: "Electricians", icon: "⚡" },
  { value: "handywoman", label: "Handywoman", icon: "🔧" },
  { value: "plumbing", label: "Plumbing", icon: "🚿" },
  { value: "painting", label: "Painting", icon: "🎨" },
];

// Pre-defined particle positions for consistent rendering
const particles = [
  { left: "10%", top: "15%", delay: "0s", duration: "4s" },
  { left: "25%", top: "35%", delay: "1s", duration: "5s" },
  { left: "45%", top: "8%", delay: "2s", duration: "3s" },
  { left: "65%", top: "25%", delay: "0.5s", duration: "6s" },
  { left: "80%", top: "45%", delay: "1.5s", duration: "4s" },
  { left: "90%", top: "12%", delay: "3s", duration: "5s" },
  { left: "15%", top: "65%", delay: "2.5s", duration: "4s" },
  { left: "35%", top: "80%", delay: "0.8s", duration: "6s" },
  { left: "55%", top: "70%", delay: "1.2s", duration: "3s" },
  { left: "75%", top: "85%", delay: "2.2s", duration: "5s" },
  { left: "5%", top: "45%", delay: "3.5s", duration: "4s" },
  { left: "60%", top: "55%", delay: "0.3s", duration: "6s" },
  { left: "85%", top: "70%", delay: "1.8s", duration: "3s" },
  { left: "30%", top: "50%", delay: "2.8s", duration: "5s" },
  { left: "50%", top: "30%", delay: "0.6s", duration: "4s" },
  { left: "70%", top: "10%", delay: "3.2s", duration: "6s" },
  { left: "20%", top: "90%", delay: "1.1s", duration: "3s" },
  { left: "40%", top: "60%", delay: "2.1s", duration: "5s" },
  { left: "95%", top: "35%", delay: "0.9s", duration: "4s" },
  { left: "8%", top: "75%", delay: "1.9s", duration: "6s" },
];

interface SearchHeroProps {
  onSearch?: (category: string, location: string) => void;
}

export default function SearchHero({ onSearch }: SearchHeroProps) {
  const router = useRouter();
  const [category, setCategory] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category && !location) {
      return;
    }

    setIsSearching(true);

    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (location) params.set("location", location);

    if (onSearch) {
      onSearch(category, location);
      setIsSearching(false);
      return;
    }

    router.push(`/directory?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-24">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/50 rounded-full animate-float"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-10 animate-slide-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          <span className="text-sm text-text-secondary">
            Trusted by <span className="text-white font-semibold">2,000+</span> professionals
          </span>
        </div>

        {/* Title with gradient animation */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 animate-scale-in">
          <span className="text-gradient-3">Find Trusted</span>
          <br />
          <span className="text-white relative">
            Trade Professionals
            {/* Underline decoration */}
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full" />
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-text-secondary max-w-3xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Connect with verified handywomen, cleaners, electricians, and more in your local area. 
          Get <span className="text-primary font-semibold">instant quotes</span> and book with confidence.
        </p>

        {/* Search Form with Glow */}
        <form onSubmit={handleSearch} className="relative animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {/* Glow effect behind */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-3xl rounded-3xl -z-10" />
          
          <div className="bg-surface/80 backdrop-blur-2xl rounded-2xl border border-white/10 p-3 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Service Select with Icon */}
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                  <span className="text-xl">🔍</span>
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-14 pr-5 py-5 bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:border-primary focus:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer text-lg"
                >
                  <option value="" className="bg-surface">What service do you need?</option>
                  {serviceCategories.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-surface">
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
                {/* Custom arrow */}
                <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-text-secondary group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Location Input */}
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
                  <svg className="w-6 h-6 text-text-secondary group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter postcode or city"
                  className="w-full pl-14 pr-5 py-5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-text-muted focus:border-primary focus:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                />
              </div>

              {/* Search Button with Gradient */}
              <button
                type="submit"
                disabled={isSearching}
                className="px-10 py-5 bg-gradient-to-r from-primary via-secondary to-accent text-background font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,212,255,0.5)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 text-lg group"
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Search</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Quick Links with hover effects */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <span className="text-text-secondary text-base">Popular:</span>
          {serviceCategories.slice(0, 5).map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setCategory(cat.value);
                router.push(`/directory?category=${cat.value}`);
              }}
              className="px-4 py-2 text-base text-text-secondary hover:text-white hover:bg-white/10 rounded-full border border-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.2)] transition-all duration-300"
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Enhanced Stats with Cards */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          {[
            { value: "10,000+", label: "Verified Pros", icon: "✅", color: "from-green-400 to-emerald-500" },
            { value: "50,000+", label: "Jobs Completed", icon: "📊", color: "from-blue-400 to-cyan-500" },
            { value: "4.9/5", label: "Average Rating", icon: "⭐", color: "from-yellow-400 to-orange-500" },
            { value: "24hr", label: "Response Time", icon: "⚡", color: "from-purple-400 to-pink-500" },
          ].map((stat, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-center justify-center mb-3">
                <span className="text-3xl">{stat.icon}</span>
              </div>
              <div className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary mt-2 group-hover:text-white transition-colors">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator with animation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-text-secondary">
          <span className="text-sm">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}

