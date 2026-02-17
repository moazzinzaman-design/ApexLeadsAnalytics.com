"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { createClientBrowser } from "@/lib/supabase";

interface Profile {
  id: string;
  name: string;
  email: string;
  subscription_tier: string;
  subscription_expires_at: string | null;
}

const plans = [
  {
    id: "free",
    name: "Free",
    price: "£0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Basic profile listing",
      "Up to 5 leads/month",
      "Basic search visibility",
      "Email support",
    ],
    notIncluded: [
      "Verified badge",
      "Priority placement",
      "Featured listings",
      "Analytics dashboard",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "£29",
    period: "per month",
    description: "For growing businesses",
    popular: true,
    features: [
      "Enhanced profile with photos",
      "Unlimited leads",
      "Verified badge",
      "Priority placement in search",
      "Featured listings",
      "Analytics dashboard",
      "WhatsApp notifications",
      "Priority support",
    ],
    notIncluded: [
      "Dedicated account manager",
      "Custom branding",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "£99",
    period: "per month",
    description: "For established businesses",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom branding",
      "API access",
      "White-label options",
      "Team management",
      "Advanced analytics",
      "Custom integrations",
      "24/7 phone support",
    ],
    notIncluded: [],
  },
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [error, setError] = useState("");

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
      setCurrentPlan(data.subscription_tier || "free");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  const handleUpgrade = async (planId: string) => {
    if (!user || !profile) return;
    
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: planId,
          email: user.email,
          proId: profile.id,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to start checkout');
      }
    } catch (err) {
      setError('Failed to start checkout');
    }
    setLoading(false);
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
        <h1 className="text-3xl font-bold text-white">Subscription</h1>
        <p className="text-text-secondary mt-1">
          Choose the right plan for your business
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card p-4 bg-red-500/10 border border-red-500/50">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Current Plan */}
      {profile && currentPlan !== "free" && (
        <div className="card p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-text-secondary text-sm">Current Plan</p>
              <p className="text-2xl font-bold text-white">
                {plans.find(p => p.id === currentPlan)?.name} Plan
              </p>
              {profile.subscription_expires_at && (
                <p className="text-text-secondary text-sm mt-1">
                  Expires: {new Date(profile.subscription_expires_at).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">
                {plans.find(p => p.id === currentPlan)?.price}
                <span className="text-text-secondary text-sm font-normal">/{plans.find(p => p.id === currentPlan)?.period}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.id}
              className={`card relative p-6 ${isPopular ? 'border-primary/50 ring-2 ring-primary/20' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-secondary text-background text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-text-secondary">/{plan.period}</span>
                </div>
                <p className="text-text-secondary mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-text-secondary">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-text-secondary/50">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <button
                  disabled
                  className="w-full py-3 text-center font-semibold rounded-xl bg-white/10 text-text-secondary cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : (
                <button
                  className={`w-full py-3 text-center font-semibold rounded-xl transition-all ${
                    isPopular
                      ? "bg-gradient-to-r from-primary to-secondary text-background hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]"
                      : "border-2 border-primary/50 text-primary hover:bg-primary hover:text-background"
                  }`}
                >
                  {plan.id === "free" ? "Downgrade" : "Upgrade"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-white font-medium mb-2">Can I cancel my subscription anytime?</h3>
            <p className="text-text-secondary">Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">What payment methods do you accept?</h3>
            <p className="text-text-secondary">We accept all major credit cards, debit cards, and PayPal.</p>
          </div>
          <div>
            <h3 className="text-white font-medium mb-2">Is there a free trial?</h3>
            <p className="text-text-secondary">Yes! All paid plans come with a 14-day free trial. No credit card required to start.</p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="text-center">
        <p className="text-text-secondary">
          Need help choosing?{" "}
          <Link href="/contact" className="text-primary hover:text-primary/80">
            Contact our team
          </Link>
        </p>
      </div>
    </div>
  );
}
