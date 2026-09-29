"use client";

import React, { useState } from "react";
import { useGovernance } from "@/context/GovernanceContext";
import { AlertCircle, X, ShieldAlert } from "lucide-react";

export function RejectionModal() {
  const { rejectionModalTarget, submitRejection, closeRejectionModal } = useGovernance();
  const [justification, setJustification] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!rejectionModalTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification || justification.trim().length < 8) {
      setError("Institutional Protocol: A formal written justification of at least 8 characters is strictly mandatory.");
      return;
    }
    setError(null);
    submitRejection(justification.trim());
    setJustification("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-red-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={closeRejectionModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-red-400">
          <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-800/80">
            <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Mandatory Rejection Justification Gate
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Action: Reject {rejectionModalTarget.type} #{rejectionModalTarget.title}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-300 bg-red-950/30 border border-red-900/40 p-3 rounded-xl leading-relaxed">
          <strong>Constitutional Safeguard:</strong> Rejections cannot be issued arbitrarily. Your written rationale will be permanently recorded in the immutable audit log and transmitted to the initiator and supervisory authorities.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Formal Institutional Rationale <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={justification}
              onChange={(e) => {
                setJustification(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Detail the constitutional or procedural grounds for this rejection (e.g., Quotation missing, outside allocated budget, unverified vendor)..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/60 focus:border-red-500 resize-none font-sans"
            />
            {error && (
              <p className="text-[11px] text-red-400 mt-1.5 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={closeRejectionModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-all duration-150 shadow-lg shadow-red-950/50 flex items-center space-x-2"
            >
              <span>Submit Formal Rejection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
