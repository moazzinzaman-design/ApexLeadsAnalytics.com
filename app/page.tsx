"use client";

import { useState, useEffect } from "react";
import SearchHero from "@/components/SearchHero";
import Link from "next/link";
import { Profile } from "@/types";

const services = [
  { name: "House Cleaning", icon: "🧹", href: "/directory?category=house-cleaning", color: "from-cyan-400 to-blue-500" },
  { name: "Pressure Washing", icon: "💦", href: "/directory?category=pressure-washing", color: "from-blue-400 to-indigo-500" },
  { name: "Gutter Cleaning", icon: "🪜", href: "/directory?category=gutter-cleaning", color: "from-indigo-400 to-purple-500" },
  { name: "Car Detailing", icon: "🚗", href: "/directory?category=car-detailing", color: "from-purple-400 to-pink-500" },
  { name: "Garden Maintenance", icon: "🌿", href: "/directory?category=garden-maintenance", color: "from-green-400 to-emerald-500" },
  { name: "Carpet Cleaning", icon: "🛋️", href: "/directory?category=carpet-cleaning", color: "from-emerald-400 to-teal-500" },
  { name: "Electricians", icon: "⚡", href: "/directory?category=electricians", color: "from-yellow-400 to-orange-500" },
  { name: "Handywoman", icon: "🔧", href: "/directory?category=handywoman", color: "from-orange-400 to-red-500" },
];

const testimonials = [
  {
    name: "James M.",
    role: "Homeowner",
    content: "Found an amazing cleaner through Apex Leads. The verification gave me confidence, and the service was excellent.",
    rating: 5,
  },
  {
    name: "Sarah K.",
    role: "Property Manager",
    content: "We've used Apex Leads to find contractors for 50+ properties. The quality is consistently high.",
    rating: 5,
  },
  {
    name: "Marcus T.",
    role: "Homeowner",
    content: "Quick, easy, and reliable. Found a great electrician within hours. Highly recommend!",
    rating: 5,
  },
];

export default function HomePage() {
  const [featuredPros, setFeaturedPros] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPros = async () => {
      try {
        const response = await fetch('/api/search?limit=6&sort=rating');
        const result = await response.json();
        
        if (result.success && result.data?.profiles) {
          setFeaturedPros(result.data.profiles.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching featured pros:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedPros();
  }, []);

  return (
    <>
      {/* Hero Section with Search */}
      <SearchHero />

      {/* Services Grid */}
      <section className="py-20 bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Browse by <span className="text-gradient-1">Service</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Find trusted professionals for any home improvement project
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <Link
                key={service.name}
                href={service.href}
                className="card p-6 text-center card-hover group relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                
                <div className="relative">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="py-20 bg-surface/30 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Featured <span className="text-gradient-1">Professionals</span>
              </h2>
              <p className="text-text-secondary">
                Top-rated experts ready to help
              </p>
            </div>
            <Link
              href="/directory"
              className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-0 overflow-hidden animate-pulse">
                  <div className="h-32 bg-surface/50" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-surface/50 rounded w-3/4" />
                    <div className="h-3 bg-surface/50 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredPros.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPros.map((pro) => (
                <Link
                  key={pro.id}
                  href={`/directory/${pro.id}`}
                  className="card card-hover overflow-hidden group"
                >
                  <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                    {/* Decorative circles */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-ping" />
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-background shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {pro.name?.split(" ").map(n => n[0]).join("") || "P"}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {pro.verified_status && (
                        <span className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                          <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                      {pro.subscription_tier === "pro" || pro.subscription_tier === "enterprise" ? (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-secondary/20 text-secondary">
                          Premium
                        </span>
                      ) : null}
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                      {pro.business_name || pro.name}
                    </h3>
                    <p className="text-sm text-text-secondary capitalize">{pro.category?.replace("-", " ")}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-1 text-text-secondary text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {pro.city}
                      </div>
                      <p className="text-sm text-text-secondary">
                        From <span className="text-white font-semibold">£{pro.starting_price || pro.hourly_rate || 0}</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-text-secondary mb-4">No professionals found yet.</p>
              <Link href="/directory" className="text-primary hover:text-primary/80">
                Browse all services →
              </Link>
            </div>
          )}

          <div className="text-center mt-8 sm:hidden">
            <Link href="/directory" className="text-primary hover:text-primary/80 transition-colors">
              View All Professionals →
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It <span className="text-gradient-2">Works</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Get matched with trusted professionals in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Search",
                description: "Enter your location and the service you need",
                icon: "🔍",
                color: "from-cyan-400 to-blue-500",
              },
              {
                step: "02",
                title: "Compare",
                description: "Review ratings, prices, and verified credentials",
                icon: "📊",
                color: "from-purple-400 to-pink-500",
              },
              {
                step: "03",
                title: "Connect",
                description: "Contact the pro directly and get your job done",
                icon: "🤝",
                color: "from-green-400 to-emerald-500",
              },
            ].map((item, index) => (
              <div key={item.step} className="text-center group">
                <div className="relative inline-flex mb-6">
                  <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-background font-bold text-sm flex items-center justify-center shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-surface/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 left-20 w-64 h-64 bg-accent/30 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What Our <span className="text-gradient-1">Customers Say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6 hover:border-primary/30 transition-colors">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-secondary mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background font-semibold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-white">{testimonial.name}</p>
                    <p className="text-sm text-text-secondary">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-secondary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Pro?
          </h2>
          <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of homeowners who have found trusted professionals through Apex Leads Analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/directory" className="btn btn-primary">
              Browse Directory
            </Link>
            <Link href="/signup" className="btn btn-secondary">
              List Your Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

