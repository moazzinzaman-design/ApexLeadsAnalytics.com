"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ServiceCategory } from "@/types";

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

const ukCities = [
  "London", "Birmingham", "Manchester", "Leeds", "Glasgow", "Liverpool",
  "Newcastle", "Sheffield", "Bristol", "Edinburgh", "Cardiff", "Belfast",
  "Nottingham", "Southampton", "Brighton", "Leicester", "Oxford", "Cambridge"
];

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business_name: "",
    category: "" as ServiceCategory | "",
    city: "",
    postcode: "",
    hourly_rate: "",
    bio: "",
    subscription_tier: "free",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/professionals/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
          category: formData.category || null,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/directory");
        }, 2000);
      } else {
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
          <p className="text-text-secondary mb-4">
            Your profile has been created. You will start receiving leads soon!
          </p>
          <Link href="/directory" className="text-primary hover:text-primary/80">
            Browse Directory →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="pt-20 pb-12 bg-gradient-to-b from-primary/10 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Join Apex Leads Analytics
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Get matched with homeowners looking for your services. Start growing your business today.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="John Smith"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                  placeholder="07700 900000"
                />
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Smith's Plumbing"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Service Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select a service</option>
                  {serviceCategories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  City *
                </label>
                <select
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select your city</option>
                  {ukCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Postcode */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Postcode *
                </label>
                <input
                  type="text"
                  name="postcode"
                  required
                  value={formData.postcode}
                  onChange={handleChange}
                  className="input"
                  placeholder="SW1A 1AA"
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Hourly Rate (£)
                </label>
                <input
                  type="number"
                  name="hourly_rate"
                  value={formData.hourly_rate}
                  onChange={handleChange}
                  className="input"
                  placeholder="35"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                About Your Business
              </label>
              <textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="input"
                placeholder="Tell homeowners about your services, experience, and what makes you stand out..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full py-3"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Profile...
                </span>
              ) : (
                "Create My Profile"
              )}
            </button>

            <p className="text-center text-text-secondary text-sm">
              Already have a profile?{" "}
              <Link href="/directory" className="text-primary hover:text-primary/80">
                Browse Professionals
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

