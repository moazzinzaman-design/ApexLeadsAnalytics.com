"use client";

import { useState } from "react";
import { ServiceCategory, LeadSubmission } from "@/types";
import { clsx } from "clsx";

interface LeadCaptureFormProps {
  proId: string;
  proName: string;
  serviceType?: ServiceCategory;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LeadCaptureForm({
  proId,
  proName,
  serviceType,
  isOpen,
  onClose,
  onSuccess,
}: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<LeadSubmission>({
    pro_id: proId,
    client_name: "",
    client_email: "",
    client_phone: "",
    service_type: serviceType || "house-cleaning",
    message: "",
    urgency: "medium",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit lead");
      }

      setIsSuccess(true);
      if (onSuccess) {
        onSuccess();
      }

      // Reset form after success
      setTimeout(() => {
        setFormData({
          pro_id: proId,
          client_name: "",
          client_email: "",
          client_phone: "",
          service_type: serviceType || "house-cleaning",
          message: "",
          urgency: "medium",
        });
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={clsx(
            "bg-surface rounded-2xl border border-white/10 shadow-2xl w-full max-w-md pointer-events-auto",
            isSuccess ? "animate-fade-in" : "animate-slide-up"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-semibold text-white">Request a Quote</h2>
              <p className="text-sm text-text-secondary mt-1">
                Contact {proName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 text-text-secondary hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Request Sent!
              </h3>
              <p className="text-text-secondary">
                {proName} will contact you shortly.
              </p>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleInputChange}
                  required
                  placeholder="John Smith"
                  className="input"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="client_email"
                  value={formData.client_email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@example.com"
                  className="input"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="client_phone"
                  value={formData.client_phone}
                  onChange={handleInputChange}
                  required
                  placeholder="07123 456789"
                  className="input"
                />
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Service Needed
                </label>
                <select
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="house-cleaning">House Cleaning</option>
                  <option value="pressure-washing">Pressure Washing</option>
                  <option value="gutter-cleaning">Gutter Cleaning</option>
                  <option value="car-detailing">Car Detailing</option>
                  <option value="garden-maintenance">Garden Maintenance</option>
                  <option value="carpet-cleaning">Carpet Cleaning</option>
                  <option value="electricians">Electrician</option>
                  <option value="handywoman">Handywoman</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="painting">Painting</option>
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  How urgent is this?
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="low">Not urgent - within a week</option>
                  <option value="medium">Within a few days</option>
                  <option value="high">As soon as possible</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Describe what you need
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Tell us about your project..."
                  className="input resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Request"
                )}
              </button>

              <p className="text-xs text-text-secondary text-center">
                By submitting, you agree to be contacted by {proName} regarding your inquiry.
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

