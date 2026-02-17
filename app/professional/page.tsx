"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Service category labels
const categoryLabels: Record<string, string> = {
  'house-cleaning': 'House Cleaning',
  'pressure-washing': 'Pressure Washing',
  'gutter-cleaning': 'Gutter Cleaning',
  'car-detailing': 'Car Detailing',
  'garden-maintenance': 'Garden Maintenance',
  'carpet-cleaning': 'Carpet Cleaning',
  'electricians': 'Electricians',
  'handywoman': 'Handywoman',
  'plumbing': 'Plumbing',
  'painting': 'Painting & Decorating',
};

export default function ProfessionalDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const [professional, setProfessional] = useState<any>(null);
  const [similarPros, setSimilarPros] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    urgency: "medium"
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchProfessional = async () => {
      try {
        const response = await fetch(`/api/professionals/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setProfessional(data.professional);
          // Fetch similar professionals
          const similarRes = await fetch(
            `/api/search?category=${data.professional.category}&limit=4&exclude=${id}`
          );
          const similarData = await similarRes.json();
          if (similarData.success && similarData.data?.profiles) {
            setSimilarPros(similarData.data.profiles.slice(0, 3));
          }
        }
      } catch (err) {
        console.error("Error fetching professional:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessional();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professional) return;
    
    setFormSubmitting(true);
    
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pro_id: professional.id,
          client_name: formData.name,
          client_email: formData.email,
          client_phone: formData.phone,
          service_type: professional.category,
          message: formData.message,
          urgency: formData.urgency,
          postcode: professional.postcode,
          city: professional.city,
        }),
      });
      
      if (response.ok) {
        setFormSuccess(true);
        setShowContactForm(false);
      }
    } catch (err) {
      console.error("Error submitting lead:", err);
    } finally {
      setFormSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-white mb-4">Professional Not Found</h1>
        <Link href="/directory" className="text-primary hover:text-primary/80">
          ← Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient */}
      <div className="relative bg-gradient-to-br from-primary/20 via-secondary/10 to-background pt-32 pb-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/30 rounded-full blur-[100px]"></div>
          <div className="absolute top-20 -left-20 w-60 h-60 bg-secondary/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-primary/20 rounded-full blur-[60px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/directory" 
            className="inline-flex items-center text-text-secondary hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Directory
          </Link>
          
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="card p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
                <div className="relative">
                  {/* Avatar */}
                  <div className="w-32 h-32 mx-auto mb-4 relative">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                        <span className="text-4xl font-bold text-gradient-1">
                          {professional.name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    {professional.verified_status && (
                      <div className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center border-4 border-background">
                        <svg className="w-5 h-5 text-background" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <h1 className="text-2xl font-bold text-white mb-1">{professional.name}</h1>
                  {professional.business_name && (
                    <p className="text-text-secondary mb-2">{professional.business_name}</p>
                  )}
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                      {categoryLabels[professional.category] || professional.category}
                    </span>
                    {professional.verified_status && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center gap-1 text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-5 h-5 ${i < 4 ? 'fill-current' : 'text-gray-500'}`} 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-text-secondary ml-2">({professional.total_jobs_completed || 0} jobs)</span>
                  </div>
                  
                  <button 
                    onClick={() => setShowContactForm(true)}
                    className="btn btn-primary w-full mb-3"
                  >
                    Contact {professional.name.split(' ')[0]}
                  </button>
                  
                  <div className="flex gap-2">
                    <a 
                      href={`tel:${professional.phone}`}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call
                    </a>
                    <a 
                      href={`mailto:${professional.email}`}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-4 text-center">
                  <div className="text-3xl font-bold text-gradient-1 mb-1">£{professional.hourly_rate}</div>
                  <div className="text-text-secondary text-sm">per hour</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-3xl font-bold text-gradient-1 mb-1">{professional.years_experience || 0}</div>
                  <div className="text-text-secondary text-sm">years experience</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-3xl font-bold text-gradient-1 mb-1">{professional.total_jobs_completed || 0}</div>
                  <div className="text-text-secondary text-sm">jobs completed</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-3xl font-bold text-gradient-1 mb-1">{professional.city}</div>
                  <div className="text-text-secondary text-sm">base location</div>
                </div>
              </div>
              
              {/* About */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  About {professional.name.split(' ')[0]}
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  {professional.bio || `Professional ${categoryLabels[professional.category] || professional.category} service provider with ${professional.years_experience || 'multiple'} years of experience. Committed to delivering high-quality work at competitive prices.`}
                </p>
              </div>
              
              {/* Services */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Services Offered
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { icon: "🏠", label: categoryLabels[professional.category] || professional.category },
                    { icon: "💰", label: `From £${professional.starting_price || professional.hourly_rate * 2}` },
                    { icon: "📍", label: `Service Area: ${professional.service_radius || 25} miles` },
                    { icon: "⏰", label: professional.available_weekdays ? "Weekdays Available" : "Limited Hours" },
                    { icon: "🛠️", label: professional.emergency_calls ? "Emergency Calls" : "Standard Service" },
                    { icon: "✅", label: "Insured & Vetted" },
                  ].map((service, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <span className="text-2xl">{service.icon}</span>
                      <span className="text-text-secondary">{service.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Service Area
                </h2>
                <div className="relative h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 relative">
                      <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping"></div>
                      <div className="relative w-full h-full bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-white font-semibold">{professional.city}, {professional.county}</p>
                    <p className="text-text-secondary text-sm">{professional.postcode}</p>
                    <p className="text-text-secondary text-sm mt-2">Serving {professional.service_radius || 25}+ mile radius</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Professionals */}
      {similarPros.length > 0 && (
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">
                Similar Professionals Nearby
              </h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Looking for more options? Here are other {categoryLabels[professional.category]} professionals in the area
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {similarPros.map((pro) => (
                <Link 
                  key={pro.id} 
                  href={`/professional?id=${pro.id}`}
                  className="card p-6 hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 flex-shrink-0">
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                        <span className="text-xl font-bold text-gradient-1">
                          {pro.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white group-hover:text-primary transition-colors truncate">
                        {pro.name}
                      </h3>
                      <p className="text-text-secondary text-sm truncate">{pro.business_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-primary font-semibold">£{pro.hourly_rate}/hr</span>
                        <span className="text-text-secondary text-sm">• {pro.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-text-secondary text-sm">{pro.total_jobs_completed || 0} jobs</span>
                    </div>
                    {pro.verified_status && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowContactForm(false)}></div>
          <div className="relative card p-8 max-w-lg w-full z-10">
            <button 
              onClick={() => setShowContactForm(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {formSuccess ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
                <p className="text-text-secondary">
                  {professional.name.split(' ')[0]} will contact you shortly with a quote.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Contact {professional.name.split(' ')[0]}
                </h3>
                <p className="text-text-secondary mb-6">
                  Get a free quote for {categoryLabels[professional.category] || professional.category}
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input w-full"
                      placeholder="John Smith"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input w-full"
                        placeholder="john@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Phone</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input w-full"
                        placeholder="07xxx xxxxxx"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Urgency</label>
                    <select
                      value={formData.urgency}
                      onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                      className="input w-full"
                    >
                      <option value="low">Low - Within a week</option>
                      <option value="medium">Medium - Within a few days</option>
                      <option value="high">High - Within 24 hours</option>
                      <option value="emergency">Emergency - ASAP</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Message</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input w-full h-32 resize-none"
                      placeholder="Describe the job you need done..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="btn btn-primary w-full"
                  >
                    {formSubmitting ? 'Sending...' : 'Send Request'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

