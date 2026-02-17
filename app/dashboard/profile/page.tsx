"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { createClientBrowser } from "@/lib/supabase";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  category: string;
  bio: string;
  city: string;
  postcode: string;
  hourly_rate: number;
  starting_price: number;
  years_experience: number;
  service_radius: number;
  available_weekdays: boolean;
  available_weekends: boolean;
  emergency_calls: boolean;
}

const serviceCategories = [
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

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    business_name: "",
    category: "",
    bio: "",
    city: "",
    postcode: "",
    hourly_rate: "",
    starting_price: "",
    years_experience: "",
    service_radius: "25",
    available_weekdays: true,
    available_weekends: false,
    emergency_calls: false,
  });

  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const supabase = createClientBrowser();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", user.email)
      .single();

    if (data) {
      setProfile(data);
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        business_name: data.business_name || "",
        category: data.category || "",
        bio: data.bio || "",
        city: data.city || "",
        postcode: data.postcode || "",
        hourly_rate: data.hourly_rate?.toString() || "",
        starting_price: data.starting_price?.toString() || "",
        years_experience: data.years_experience?.toString() || "",
        service_radius: data.service_radius?.toString() || "25",
        available_weekdays: data.available_weekdays ?? true,
        available_weekends: data.available_weekends ?? false,
        emergency_calls: data.emergency_calls ?? false,
      });
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError("");
    setSuccess(false);

    const supabase = createClientBrowser();
    const { error } = await supabase
      .from("profiles")
      .update({
        name: formData.name,
        phone: formData.phone,
        business_name: formData.business_name,
        category: formData.category,
        bio: formData.bio,
        city: formData.city,
        postcode: formData.postcode,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
        starting_price: formData.starting_price ? parseFloat(formData.starting_price) : null,
        years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
        service_radius: formData.service_radius ? parseInt(formData.service_radius) : 25,
        available_weekdays: formData.available_weekdays,
        available_weekends: formData.available_weekends,
        emergency_calls: formData.emergency_calls,
      })
      .eq("id", profile.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-text-secondary mt-1">
          Manage your business information and availability
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg">
            Profile updated successfully!
          </div>
        )}

        {/* Basic Info */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input w-full"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="input w-full"
                placeholder="07700 900000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Business Name
              </label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                className="input w-full"
                placeholder="Smith's Plumbing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Service Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="input w-full"
              >
                <option value="">Select a service</option>
                {serviceCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                City *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="input w-full"
              >
                <option value="">Select your city</option>
                {ukCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Postcode *
              </label>
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                required
                className="input w-full"
                placeholder="SW1A 1AA"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              About Your Business
            </label>
            <textarea
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="input w-full"
              placeholder="Tell homeowners about your services, experience, and what makes you stand out..."
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Hourly Rate (£)
              </label>
              <input
                type="number"
                name="hourly_rate"
                value={formData.hourly_rate}
                onChange={handleChange}
                className="input w-full"
                placeholder="35"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Starting Price (£)
              </label>
              <input
                type="number"
                name="starting_price"
                value={formData.starting_price}
                onChange={handleChange}
                className="input w-full"
                placeholder="50"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Service Radius (miles)
              </label>
              <input
                type="number"
                name="service_radius"
                value={formData.service_radius}
                onChange={handleChange}
                className="input w-full"
                placeholder="25"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                name="years_experience"
                value={formData.years_experience}
                onChange={handleChange}
                className="input w-full"
                placeholder="5"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Availability</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="available_weekdays"
                checked={formData.available_weekdays}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
              />
              <span className="text-white">Available Weekdays</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="available_weekends"
                checked={formData.available_weekends}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
              />
              <span className="text-white">Available Weekends</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="emergency_calls"
                checked={formData.emergency_calls}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
              />
              <span className="text-white">Available for Emergency Calls</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary px-8"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
