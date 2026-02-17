
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Pricing - Apex Leads Analytics",
  description: "Choose the right plan for your trade business. Get more leads and grow your client base.",
};

const plans = [
  {
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
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "£29",
    period: "per month",
    description: "For growing businesses",
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
    cta: "Start Free Trial",
    popular: true,
  },
  {
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
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and PayPal. For Enterprise plans, we also accept bank transfers.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "What happens if I go over my lead limit?",
    answer: "On the Free plan, additional leads will be queued until the next month. On Pro and Enterprise plans, leads are unlimited.",
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Absolutely! You can change your plan at any time. Changes take effect immediately, and we'll prorate any differences.",
  },
];

export default function PricingPage() {
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
            Simple, <span className="text-gradient-1">Transparent</span> Pricing
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Choose the plan that fits your business. All plans include a 14-day free trial.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`card relative p-8 ${plan.popular ? 'border-primary/50 ring-2 ring-primary/20' : ''}`}
              >
                {plan.popular && (
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
                      <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                
                <a 
                  href={plan.name === "Enterprise" ? "/contact" : "/register"} 
                  className={`block w-full py-3 text-center font-semibold rounded-xl transition-all ${
                    plan.popular 
                      ? "bg-gradient-to-r from-primary to-secondary text-background hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]" 
                      : "border-2 border-primary/50 text-primary hover:bg-primary hover:text-background"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked <span className="text-gradient-1">Questions</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-text-secondary">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
            Our team is here to help you choose the right plan for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="btn btn-primary">
              Contact Us
            </a>
            <a href="/directory" className="btn btn-secondary">
              View Demo
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

