"use client";

import Image from "next/image";
import Link from "next/link";
import { Profile } from "@/types";
import VerifiedBadge from "./VerifiedBadge";
import { useState } from "react";

interface ProCardProps {
  profile: Profile;
  averageRating?: number;
  reviewCount?: number;
}

export default function ProCard({ profile, averageRating = 0, reviewCount = 0 }: ProCardProps) {
  const [imageError, setImageError] = useState(false);

  const initials = profile.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "P";

  const categoryLabels: Record<string, string> = {
    "house-cleaning": "House Cleaning",
    "pressure-washing": "Pressure Washing",
    "gutter-cleaning": "Gutter Cleaning",
    "car-detailing": "Car Detailing",
    "garden-maintenance": "Garden Maintenance",
    "carpet-cleaning": "Carpet Cleaning",
    electricians: "Electrician",
    handywoman: "Handywoman",
    plumbing: "Plumber",
    painting: "Painter",
  };

  return (
    <Link href={`/directory/${profile.id}`}>
      <div className="card card-hover overflow-hidden group cursor-pointer h-full">
        {/* Card Header with Gradient Background */}
        <div className="relative h-44 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/20 overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,212,255,0.3),transparent_70%)]" />
          </div>
          
          {/* Floating shapes */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
          
          {profile.image_url && !imageError ? (
            <Image
              src={profile.image_url}
              alt={profile.name || "Professional"}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl font-bold text-background shadow-lg group-hover:scale-110 transition-transform duration-300">
                {initials}
              </div>
            </div>
          )}

          {/* Verified Badge */}
          {profile.verified_status && (
            <div className="absolute top-4 left-4">
              <VerifiedBadge size="sm" showLabel={false} />
            </div>
          )}

          {/* Premium Badge */}
          {profile.subscription_tier === "pro" || profile.subscription_tier === "enterprise" ? (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-secondary to-accent text-white shadow-lg">
                Premium
              </span>
            </div>
          ) : null}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
        </div>

        {/* Card Body */}
        <div className="p-5">
          {/* Name & Category */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
              {profile.business_name || profile.name}
            </h3>
            <p className="text-sm text-text-secondary capitalize">
              {categoryLabels[profile.category] || profile.category?.replace("-", " ")}
            </p>
          </div>

          {/* Location & Rating Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-text-secondary text-sm">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate max-w-[120px]">{profile.city}</span>
              {profile.distance_miles && (
                <span className="text-primary text-xs ml-1">• {profile.distance_miles.toFixed(1)} mi</span>
              )}
            </div>

            {averageRating > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= Math.round(averageRating)
                          ? "text-warning"
                          : "text-text-secondary/30"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-semibold text-white">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-text-secondary">
                  ({reviewCount})
                </span>
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-text-secondary mb-4 line-clamp-2">
              {profile.bio}
            </p>
          )}

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {profile.total_jobs_completed && profile.total_jobs_completed > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-text-secondary bg-white/5 px-2.5 py-1 rounded-full">
                <svg className="w-3.5 h-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{profile.total_jobs_completed} jobs</span>
              </div>
            )}
            {profile.years_experience && profile.years_experience > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-text-secondary bg-white/5 px-2.5 py-1 rounded-full">
                <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{profile.years_experience} yrs</span>
              </div>
            )}
            {profile.emergency_calls && (
              <div className="flex items-center gap-1.5 text-xs text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">Emergency</span>
              </div>
            )}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              {profile.starting_price ? (
                <p className="text-sm text-text-secondary">
                  From{" "}
                  <span className="text-xl font-bold text-white">
                    £{profile.starting_price}
                  </span>
                </p>
              ) : profile.hourly_rate ? (
                <p className="text-sm text-text-secondary">
                  From{" "}
                  <span className="text-xl font-bold text-white">
                    £{profile.hourly_rate}
                  </span>
                  <span className="text-xs">/hr</span>
                </p>
              ) : (
                <p className="text-sm text-text-secondary">Quote on request</p>
              )}
            </div>

            <span className="px-4 py-2 text-sm font-semibold text-background bg-gradient-to-r from-primary to-secondary rounded-lg group-hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all">
              View Profile
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

