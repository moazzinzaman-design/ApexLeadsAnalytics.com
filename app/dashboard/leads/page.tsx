"use client";

import { useState, useEffect } from "react";
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
  postcode: string;
}

const statusOptions = [
  { value: "new", label: "New", color: "bg-blue-500/20 text-blue-400" },
  { value: "contacted", label: "Contacted", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "quoted", label: "Quoted", color: "bg-purple-500/20 text-purple-400" },
  { value: "booked", label: "Booked", color: "bg-green-500/20 text-green-400" },
  { value: "completed", label: "Completed", color: "bg-green-600/20 text-green-500" },
  { value: "lost", label: "Lost", color: "bg-red-500/20 text-red-400" },
];

const urgencyOptions = [
  { value: "low", label: "Low", color: "bg-blue-500/20 text-blue-400" },
  { value: "medium", label: "Medium", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "high", label: "High", color: "bg-orange-500/20 text-orange-400" },
  { value: "emergency", label: "Emergency", color: "bg-red-500/20 text-red-400" },
];

export default function LeadsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchLeads();
  }, [user, filter]);

  const fetchLeads = async () => {
    if (!user) return;
    
    const supabase = createClientBrowser();

    // Get profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", user.email)
      .single();

    if (!profileData) {
      setLoading(false);
      return;
    }

    // Fetch leads
    let query = supabase
      .from("leads")
      .select("*")
      .eq("assigned_pro_id", profileData.id)
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query;

    if (data) {
      setLeads(data);
    }

    setLoading(false);
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    setUpdating(true);
    
    const supabase = createClientBrowser();
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", leadId);

    if (!error) {
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    }

    setUpdating(false);
  };

  const getUrgencyColor = (urgency: string) => {
    const option = urgencyOptions.find(o => o.value === urgency);
    return option?.color || "bg-gray-500/20 text-gray-400";
  };

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(o => o.value === status);
    return option?.color || "bg-gray-500/20 text-gray-400";
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Leads</h1>
          <p className="text-text-secondary mt-1">
            Manage and track your leads from homeowners
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-primary text-white"
              : "bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white"
          }`}
        >
          All Leads
        </button>
        {statusOptions.map((status) => (
          <button
            key={status.value}
            onClick={() => setFilter(status.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status.value
                ? "bg-primary text-white"
                : "bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white"
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="card overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-text-secondary">No leads found</p>
            <p className="text-text-secondary text-sm mt-1">
              {filter === "all" 
                ? "You haven't received any leads yet." 
                : `No leads with status "${filter}".`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{lead.client_name}</p>
                        <p className="text-text-secondary text-sm">{lead.client_email}</p>
                        <p className="text-text-secondary text-sm">{lead.client_phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white">{lead.service_type}</p>
                      {lead.city && (
                        <p className="text-text-secondary text-sm">{lead.city}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(lead.urgency)}`}>
                        {lead.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        disabled={updating}
                        className={`px-2 py-1 rounded text-xs font-medium bg-transparent border-0 cursor-pointer ${getStatusColor(lead.status)}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value} className="bg-surface">
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-text-secondary text-sm">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <a
                          href={`tel:${lead.client_phone}`}
                          className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                          title="Call"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </a>
                        <a
                          href={`mailto:${lead.client_email}`}
                          className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                          title="Email"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedLead(null)}></div>
          <div className="relative card p-8 max-w-lg w-full z-10 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 right-4 text-text-secondary hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold text-white mb-6">Lead Details</h3>

            <div className="space-y-4">
              <div>
                <label className="text-text-secondary text-sm">Customer Name</label>
                <p className="text-white font-medium">{selectedLead.client_name}</p>
              </div>

              <div>
                <label className="text-text-secondary text-sm">Email</label>
                <p className="text-white">{selectedLead.client_email}</p>
              </div>

              <div>
                <label className="text-text-secondary text-sm">Phone</label>
                <p className="text-white">{selectedLead.client_phone}</p>
              </div>

              <div>
                <label className="text-text-secondary text-sm">Service Type</label>
                <p className="text-white">{selectedLead.service_type}</p>
              </div>

              <div>
                <label className="text-text-secondary text-sm">Location</label>
                <p className="text-white">
                  {selectedLead.city}
                  {selectedLead.postcode && `, ${selectedLead.postcode}`}
                </p>
              </div>

              <div>
                <label className="text-text-secondary text-sm">Urgency</label>
                <div className="mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(selectedLead.urgency)}`}>
                    {selectedLead.urgency}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-text-secondary text-sm">Status</label>
                <div className="mt-1">
                  <select
                    value={selectedLead.status}
                    onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value)}
                    disabled={updating}
                    className={`px-3 py-2 rounded-lg text-sm font-medium bg-transparent border border-white/10 cursor-pointer ${getStatusColor(selectedLead.status)}`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value} className="bg-surface">
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-text-secondary text-sm">Message</label>
                <p className="text-white mt-1 p-3 bg-white/5 rounded-lg">
                  {selectedLead.message || "No message provided"}
                </p>
              </div>

              <div>
                <label className="text-text-secondary text-sm">Received</label>
                <p className="text-white">
                  {new Date(selectedLead.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <a
                  href={`tel:${selectedLead.client_phone}`}
                  className="flex-1 btn btn-primary text-center"
                >
                  Call Now
                </a>
                <a
                  href={`mailto:${selectedLead.client_email}`}
                  className="flex-1 btn btn-secondary text-center"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
