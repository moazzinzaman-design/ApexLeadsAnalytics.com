"use client";

import ProCard from "./ProCard";
import { Profile } from "@/types";

interface DirectoryGridProps {
  profiles: Profile[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function DirectoryGrid({
  profiles,
  isLoading = false,
  hasMore = false,
  onLoadMore,
}: DirectoryGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="card overflow-hidden animate-pulse"
          >
            <div className="h-44 bg-white/5" />
            <div className="p-5 space-y-4">
              <div className="h-6 bg-white/5 rounded w-3/4" />
              <div className="h-4 bg-white/5 rounded w-1/2" />
              <div className="h-4 bg-white/5 rounded w-full" />
              <div className="flex justify-between pt-4 border-t border-white/10">
                <div className="h-6 bg-white/5 rounded w-20" />
                <div className="h-10 bg-white/5 rounded w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center py-20">
        {/* Animated icon */}
        <div className="relative inline-block mb-8">
          <div className="w-28 h-28 mx-auto rounded-full bg-white/5 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <svg
              className="w-14 h-14 text-text-secondary relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-3">
          No professionals found
        </h3>
        <p className="text-text-secondary max-w-md mx-auto mb-8">
          We couldn't find any professionals matching your criteria. Try adjusting
          your search filters or expanding your search radius.
        </p>
        
        {/* Suggestion cards */}
        <div className="flex flex-wrap justify-center gap-3">
          {["House Cleaning", "Pressure Washing", "Electricians"].map((term) => (
            <button
              key={term}
              className="px-4 py-2 text-sm text-text-secondary hover:text-primary border border-white/10 hover:border-primary/30 rounded-full transition-all"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Results grid with staggered animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile, index) => (
          <div
            key={profile.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProCard
              profile={profile}
              averageRating={4.8}
              reviewCount={12}
            />
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className="text-center mt-12">
          <button
            onClick={onLoadMore}
            className="px-10 py-4 border-2 border-primary/50 text-primary bg-primary/5 rounded-xl font-semibold hover:bg-primary hover:text-background hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] transition-all duration-300"
          >
            Load More Professionals
          </button>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-10 text-center">
        <p className="text-text-secondary text-sm">
          Showing <span className="text-white font-semibold">{profiles.length}</span> professionals
        </p>
      </div>
    </div>
  );
}

