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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
              Tier 1 Authority
            </span>
            <span className="text-[10px] font-mono text-slate-500">FAC-OSA-2026</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center space-x-2.5">
            <ShieldAlert className="w-6 h-6 text-purple-600" />
            <span>Faculty Advisor Tribunal Console</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official executive oversight under North South University Office of Student Affairs.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl">
          <button
            onClick={() => setActiveTab("whistleblower")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "whistleblower"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Tribunal Desk ({visibleDossiers.length})
          </button>
          <button
            onClick={() => setActiveTab("expenditures")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "expenditures"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Major Expenditures ({tier3Requisitions.length})
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "audit"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Semester Audit
          </button>
        </div>
      </div>

      {/* Access Gate Invariant Check */}
      {process.env.NODE_ENV !== "production" && currentUser.tier !== 1 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <strong>Preview Notification:</strong> You are currently simulating this console as {currentUser.legalName} ({currentUser.tierLabel}). Unblinded tribunal powers and formal clearance signatures are reserved for Tier 1 (Faculty Advisor).
          </div>
        </div>
      )}

      {/* TAB 1: Whistleblower Tribunal Desk */}
      {activeTab === "whistleblower" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
            <div className="flex items-center space-x-2 text-purple-800 font-bold text-xs uppercase tracking-wider">
              <Eye className="w-4 h-4 text-purple-600" />
              <span>Unblinded Whistleblower Oversight Protocol (Article 10)</span>
            </div>
            <p className="text-xs text-purple-950/80 leading-relaxed">
              Pursuant to Article 10 (Grievance Resolution Matrix) of the Charter, the Faculty Advisor exercises independent oversight of all encrypted dossiers. If an allegation targets the Club President, the Advisor convenes a 3-member impartial panel, while any complaint against Executive Board members is automatically blinded from their query filters.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {visibleDossiers.map((dossier) => (
              <div
                key={dossier.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-300 transition-all space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                      {dossier.trackingNumber}
                    </span>
                    {dossier.isAgainstPresident && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        <span>Target: Club President</span>
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {dossier.allegationType.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-500">Status:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        dossier.status === "PANEL_CONVOKED"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {dossier.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Accused Individual: <strong className="text-slate-900">{dossier.targetName}</strong> ({dossier.targetRole})
                    </span>
                    <span>
                      Evidence Vault: <strong className="text-purple-700">{dossier.evidenceCount} Sealed Documents</strong>
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
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
                        className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-all"
                      >
                        <Gavel className="w-3.5 h-3.5" />
                        <span>Convoke Independent Tribunal</span>
                      </button>
                    ) : (
                      <div className="text-xs font-semibold text-amber-800 flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200">
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
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>Tier 3 Financial Clearance Gate (&gt; 20,000 BDT)</span>
            </h3>
            <p className="text-xs text-blue-950/80 leading-relaxed">
              All expenditures above 20,000 BDT require an attached Executive Board Resolution, dual-signatures from the Treasurer and President, and mandatory digital clearance by the Tier 1 Faculty Advisor prior to disbursement.
            </p>
          </div>

          <div className="space-y-4">
            {tier3Requisitions.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {req.requisitionNumber}
                      </span>
                      <span className="text-xs font-bold text-amber-600 font-mono text-sm">
                        {req.amountBDT.toLocaleString()} BDT
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        Tier 3 Major Expense
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Initiator: <span className="text-slate-900 font-semibold">{req.requestedBy}</span> ({req.initiatorRole})
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        req.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : req.status === "REJECTED"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {req.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-slate-700">
                    <strong>Purpose:</strong> {req.purpose}
                  </div>
                  <div className="text-xs text-slate-600">
                    <strong>Vendor:</strong> {req.vendorName}
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-500">Executive Board Resolution:</span>
                    {req.hasEBResolution ? (
                      <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Attached & Verified (Resolution EB-2026-09)</span>
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Resolution Missing</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Multi-signature workflow badges */}
                <div className="pt-2 border-t border-slate-200">
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
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-all"
                      >
                        Reject with Justification
                      </button>

                      <button
                        onClick={() => approveRequisition(req.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-xs flex items-center space-x-1.5 transition-all"
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
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-purple-600" />
                <span>Semester Audit Report Certification (Fall 2026)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit conducted by Independent Audit Committee (Neutral Non-EB Appointees).
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                REPORT: AUD-NSU-2026-F
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">Total Certified Inflow</div>
              <div className="text-lg font-bold text-emerald-600 font-mono mt-1">385,000 BDT</div>
              <div className="text-[10px] text-slate-400">100% receipt-backed</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">Audited Outflow</div>
              <div className="text-lg font-bold text-blue-600 font-mono mt-1">218,500 BDT</div>
              <div className="text-[10px] text-slate-400">All vouchers validated</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] text-slate-500">Discrepancy Ratio</div>
              <div className="text-lg font-bold text-emerald-600 font-mono mt-1">0.00%</div>
              <div className="text-[10px] text-slate-400">Zero variance detected</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Independent Auditor Attestation
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono space-y-2">
              <p>
                &quot;Pursuant to Article 9:3 (Independent Audit Team), we, the 2 independent auditors elected directly by the General Assembly, certify that we hold no office on the Executive Board, Secretariat, or Treasury. All accounts, bank statements, and vouchers for the Fall 2026 semester have been audited with zero variance.&quot;
              </p>
              <div className="text-[10px] text-slate-500">
                Auditors Signatures: Tanvirul Hasan (Lead Auditor) • Sabrina Chowdhury (Associate Auditor)
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-500">
              {auditCertified ? (
                <span className="text-emerald-700 font-bold flex items-center space-x-1.5">
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
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                  : "bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
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
