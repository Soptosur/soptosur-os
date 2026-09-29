"use client";

import React, { useState } from "react";
import { useGovernance } from "@/context/GovernanceContext";
import { MultiSignatureBadge } from "@/components/MultiSignatureBadge";
import {
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Lock,
  ArrowRight,
  Eye,
  Gavel,
  Shield,
  Clock,
  Send,
  AlertCircle,
} from "lucide-react";

export default function AdvisorConsolePage() {
  const {
    currentUser,
    visibleDossiers,
    convokeTribunal,
    requisitions,
    approveRequisition,
    triggerRejection,
  } = useGovernance();

  const [auditCertified, setAuditCertified] = useState(false);
  const [activeTab, setActiveTab] = useState<"whistleblower" | "expenditures" | "audit">("whistleblower");

  // Filter Tier 3 requisitions (> 20,000 BDT)
  const tier3Requisitions = requisitions.filter((r) => r.tier === 3 || r.amountBDT > 20000);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              Tier 1 Authority
            </span>
            <span className="text-[10px] font-mono text-slate-500">FAC-OSA-2026</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center space-x-2.5">
            <ShieldAlert className="w-6 h-6 text-purple-400" />
            <span>Faculty Advisor Tribunal Console</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official executive oversight under North South University Office of Student Affairs.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab("whistleblower")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "whistleblower"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Tribunal Desk ({visibleDossiers.length})
          </button>
          <button
            onClick={() => setActiveTab("expenditures")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "expenditures"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Major Expenditures ({tier3Requisitions.length})
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "audit"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Semester Audit
          </button>
        </div>
      </div>

      {/* Access Gate Invariant Check */}
      {currentUser.tier !== 1 && (
        <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <strong>Preview Notification:</strong> You are currently simulating this console as {currentUser.legalName} ({currentUser.tierLabel}). Unblinded tribunal powers and formal clearance signatures are reserved for Tier 1 (Faculty Advisor).
          </div>
        </div>
      )}

      {/* TAB 1: Whistleblower Tribunal Desk */}
      {activeTab === "whistleblower" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-800/40 space-y-2">
            <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
              <Eye className="w-4 h-4 text-purple-400" />
              <span>Unblinded Whistleblower Oversight Protocol (ধারা ১০)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              গঠনতন্ত্রের ধারা ১০ (অভিযোগ নিষ্পত্তি ম্যাট্রিক্স) অনুযায়ী, ফ্যাকাল্টি অ্যাডভাইজর সকল গোপন ডসিয়ার ও অভিযোগের নিরপেক্ষ তদারকি করেন। সভাপতির বিরুদ্ধে অভিযোগ তদন্তের জন্য অ্যাডভাইজর ৩ সদস্যের নিরপেক্ষ প্যানেল গঠন করবেন এবং নির্বাহী কর্মকর্তাদের বিরুদ্ধে অভিযোগ তাদের কুয়েরি ফিল্টার থেকে স্বয়ংক্রিয়ভাবে ব্লাইন্ড থাকবে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {visibleDossiers.map((dossier) => (
              <div
                key={dossier.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-bold text-purple-300 bg-purple-950 px-2.5 py-1 rounded-md border border-purple-800">
                      {dossier.trackingNumber}
                    </span>
                    {dossier.isAgainstPresident && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        <span>Target: Club President</span>
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {dossier.allegationType.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-400">Status:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        dossier.status === "PANEL_CONVOKED"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-blue-950 text-blue-300 border border-blue-800"
                      }`}
                    >
                      {dossier.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Accused Individual: <strong className="text-slate-200">{dossier.targetName}</strong> ({dossier.targetRole})
                    </span>
                    <span>
                      Evidence Vault: <strong className="text-purple-300">{dossier.evidenceCount} Sealed Documents</strong>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 font-mono">
                    "{dossier.summary}"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Lodged: {new Date(dossier.submittedAt).toLocaleString()}
                  </span>

                  <div className="flex items-center space-x-2">
                    {dossier.status !== "PANEL_CONVOKED" ? (
                      <button
                        onClick={() => convokeTribunal(dossier.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-950/50 flex items-center space-x-1.5 transition-all"
                      >
                        <Gavel className="w-3.5 h-3.5" />
                        <span>Convoke Independent Tribunal</span>
                      </button>
                    ) : (
                      <div className="text-xs font-semibold text-amber-400 flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-950/40 border border-amber-900/60">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Independent Tribunal Panel Active</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Tier 3 Major Expenditure Approval Gate (> 20,000 BDT) */}
      {activeTab === "expenditures" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-800/40 space-y-1">
            <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Tier 3 Financial Clearance Gate (&gt; 20,000 BDT)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              All expenditures above 20,000 BDT require an attached Executive Board Resolution, dual-signatures from the Treasurer and President, and mandatory digital clearance by the Tier 1 Faculty Advisor prior to disbursement.
            </p>
          </div>

          <div className="space-y-4">
            {tier3Requisitions.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                        {req.requisitionNumber}
                      </span>
                      <span className="text-xs font-bold text-amber-400 font-mono text-sm">
                        {req.amountBDT.toLocaleString()} BDT
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                        Tier 3 Major Expense
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Initiator: <span className="text-slate-200 font-semibold">{req.requestedBy}</span> ({req.initiatorRole})
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        req.status === "APPROVED"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : req.status === "REJECTED"
                          ? "bg-red-950 text-red-300 border border-red-800"
                          : "bg-blue-950 text-blue-300 border border-blue-800"
                      }`}
                    >
                      {req.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-slate-300">
                    <strong>Purpose:</strong> {req.purpose}
                  </div>
                  <div className="text-xs text-slate-400">
                    <strong>Vendor:</strong> {req.vendorName}
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-400">Executive Board Resolution:</span>
                    {req.hasEBResolution ? (
                      <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Attached & Verified (Resolution EB-2026-09)</span>
                      </span>
                    ) : (
                      <span className="text-red-400 font-semibold flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Resolution Missing</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Multi-signature workflow badges */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold mb-1">
                    Multi-Signature Authorization Pipeline
                  </div>
                  <MultiSignatureBadge requisition={req} />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2 pt-2">
                  {req.status === "PENDING_APPROVAL" && (
                    <>
                      <button
                        onClick={() =>
                          triggerRejection({
                            id: req.id,
                            type: "REQUISITION",
                            title: req.requisitionNumber,
                          })
                        }
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-300 bg-red-950/60 hover:bg-red-900/60 border border-red-800/80 transition-all"
                      >
                        Reject with Justification
                      </button>

                      <button
                        onClick={() => approveRequisition(req.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-950/50 flex items-center space-x-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Grant Tier 3 Faculty Clearance</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Semester Audit Certification */}
      {activeTab === "audit" && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-purple-400" />
                <span>Semester Audit Report Certification (Fall 2026)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit conducted by Independent Audit Committee (Neutral Non-EB Appointees).
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                REPORT: AUD-NSU-2026-F
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-400">Total Certified Inflow</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-1">385,000 BDT</div>
              <div className="text-[10px] text-slate-500">100% receipt-backed</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-400">Audited Outflow</div>
              <div className="text-lg font-bold text-blue-400 font-mono mt-1">218,500 BDT</div>
              <div className="text-[10px] text-slate-500">All vouchers validated</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-400">Discrepancy Ratio</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-1">0.00%</div>
              <div className="text-[10px] text-slate-500">Zero variance detected</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Independent Auditor Attestation
            </h4>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono space-y-2">
              <p>
                "ধারা ৯:৩ (স্বাধীন নিরীক্ষা দল) অনুযায়ী, সাধারণ সভায় সরাসরি নির্বাচিত আমরা ২ জন নিরপেক্ষ অডিট সদস্য প্রত্যয়ন করছি যে, আমরা নির্বাহী পরিষদ, সচিবালয় বা ট্রেজারির কোনো পদে নেই। ফল ২০২৬ সেমিস্টারের সকল হিসাব, ব্যাংক স্টেটমেন্ট ও ভাউচার সম্পূর্ণ নির্ভুলভাবে নিরীক্ষিত হয়েছে।"
              </p>
              <div className="text-[10px] text-slate-500">
                নিরীক্ষকদের স্বাক্ষর: তানভীরুল হাসান (প্রধান নিরীক্ষক) • সাবরিনা চৌধুরী (সহকারী নিরীক্ষক)
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              {auditCertified ? (
                <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Digitally Certified by Dr. Tanvir Ahmed (Faculty Advisor) on {new Date().toLocaleDateString()}</span>
                </span>
              ) : (
                <span>Awaiting formal digital signature authorization from Faculty Advisor.</span>
              )}
            </div>

            <button
              disabled={auditCertified}
              onClick={() => setAuditCertified(true)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                auditCertified
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800 cursor-default"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/60"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{auditCertified ? "Audit Certified & Sealed" : "Digitally Certify & Sign Audit"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
