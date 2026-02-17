"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { createClientBrowser } from "@/lib/supabase";

interface Lead {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  service_type: string;
  message: string;
  urgency: string;
  status: string;
  created_at: string;
  city: string;
}

interface Profile {
  id: string;
  name: string;
  business_name: string;
  category: string;
  subscription_tier: string;
  total_jobs_completed: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const supabase = createClientBrowser();

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", user.email)
        .single();

      if (profileData) {
        setProfile(profileData);

        // Fetch leads for this professional
        const { data: leadsData } = await supabase
          .from("leads")
          .select("*")
          .eq("assigned_pro_id", profileData.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (leadsData) {
          setLeads(leadsData);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "bg-red-500/20 text-red-400";
      case "high":
        return "bg-orange-500/20 text-orange-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-blue-500/20 text-blue-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/20 text-blue-400";
      case "contacted":
        return "bg-yellow-500/20 text-yellow-400";
      case "quoted":
        return "bg-purple-500/20 text-purple-400";
      case "booked":
        return "bg-green-500/20 text-green-400";
      case "completed":
        return "bg-green-600/20 text-green-500";
      case "lost":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const newLeads = leads.filter((l) => l.status === "new").length;
  const contactedLeads = leads.filter((l) => l.status === "contacted").length;
  const bookedLeads = leads.filter((l) => l.status === "booked").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {profile?.name || "Professional"}!
          </h1>
          <p className="text-text-secondary mt-1">
            Here's what's happening with your leads today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/leads" className="btn btn-primary">
            View All Leads
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Leads</p>
              <p className="text-3xl font-bold text-white mt-1">{leads.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* New Leads */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">New Leads</p>
              <p className="text-3xl font-bold text-white mt-1">{newLeads}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Contacted */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Contacted</p>
              <p className="text-3xl font-bold text-white mt-1">{contactedLeads}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Booked Jobs */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Booked Jobs</p>
              <p className="text-3xl font-bold text-white mt-1">{bookedLeads}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      {profile && (
        <div className="card p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                profile.subscription_tier === "enterprise" ? "bg-purple-500/20" :
                profile.subscription_tier === "pro" ? "bg-primary/20" :
                profile.subscription_tier === "basic" ? "bg-blue-500/20" :
                "bg-gray-500/20"
              }`}>
                <svg className={`w-6 h-6 ${
                  profile.subscription_tier === "enterprise" ? "text-purple-400" :
                  profile.subscription_tier === "pro" ? "text-primary" :
                  profile.subscription_tier === "basic" ? "text-blue-400" :
                  "text-gray-400"
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold">
                  {profile.subscription_tier === "enterprise" ? "Enterprise Plan" :
                   profile.subscription_tier === "pro" ? "Pro Plan" :
                   profile.subscription_tier === "basic" ? "Basic Plan" :
                   "Free Plan"}
                </p>
                <p className="text-text-secondary text-sm">
                  {profile.subscription_tier === "free" ? "Upgrade to get more leads" : "Your current plan"}
                </p>
              </div>
            </div>
            {profile.subscription_tier === "free" && (
              <Link href="/dashboard/subscription" className="btn btn-primary">
                Upgrade Now
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Recent Leads */}
      <div className="card">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Recent Leads</h2>
        </div>
        {leads.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-text-secondary mb-4">No leads yet</p>
            <p className="text-text-secondary text-sm">
              Share your profile to start getting leads from homeowners in your area.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-semibold truncate">{lead.client_name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getUrgencyColor(lead.urgency)}`}>
                        {lead.urgency}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm truncate">{lead.service_type}</p>
                    <p className="text-text-secondary text-sm truncate">{lead.message}</p>
                    <p className="text-text-secondary text-xs mt-1">
                      {new Date(lead.created_at).toLocaleDateString()} • {lead.city || "Location not specified"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${lead.client_phone}`}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors"
                    >
                      Call
                    </a>
                    <a
                      href={`mailto:${lead.client_email}`}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {leads.length > 5 && (
          <div className="p-4 border-t border-white/10 text-center">
            <Link href="/dashboard/leads" className="text-primary hover:text-primary/80 text-sm">
              View all {leads.length} leads →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
