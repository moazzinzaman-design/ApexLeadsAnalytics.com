
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "How It Works - Apex Leads Analytics",
  description: "Learn how Apex Leads connects you with trusted trade professionals in your area.",
};

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      icon: "🔍",
      title: "Search",
      description: "Enter your location and the service you need. Browse through verified professionals in your area.",
    },
    {
      number: "02",
      icon: "📊",
      title: "Compare",
      description: "Review ratings, prices, certifications, and customer reviews to find the perfect match.",
    },
    {
      number: "03",
      icon: "🤝",
      title: "Connect",
      description: "Contact the professional directly, get a quote, and book your service with confidence.",
    },
  ];

  const benefits = [
    {
      icon: "✅",
      title: "Verified Professionals",
      description: "All pros are background-checked and verified for your peace of mind.",
    },
    {
      icon: "⚡",
      title: "Quick Response",
      description: "Most professionals respond within 24 hours of your inquiry.",
    },
    {
      icon: "💰",
      title: "Transparent Pricing",
      description: "No hidden fees. See upfront prices before you book.",
    },
    {
      icon: "⭐",
      title: "Real Reviews",
      description: "Authentic reviews from real customers to help you decide.",
    },
    {
      icon: "🛡️",
      title: "Secure Booking",
      description: "Your data is protected with enterprise-grade security.",
    },
    {
      icon: "💬",
      title: "Direct Communication",
      description: "Chat directly with professionals without middlemen.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="cosmic-bg" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[128px]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            How It <span className="text-gradient-1">Works</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Getting matched with a trusted professional is easy. Follow these simple steps to find your perfect pro.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative inline-flex mb-6">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary text-background font-bold flex items-center justify-center shadow-lg">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-gradient-1">Apex Leads</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We make finding and booking trade professionals simple, safe, and reliable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="card p-6 card-hover">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-text-secondary">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Pro?
          </h2>
          <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of homeowners who have found trusted professionals through Apex Leads.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/directory" className="btn btn-primary">
              Browse Directory
            </a>
            <a href="/register" className="btn btn-secondary">
              List Your Services
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

