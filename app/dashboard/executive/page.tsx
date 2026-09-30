"use client";

import React, { useState } from "react";
import { useGovernance } from "@/context/GovernanceContext";
import { MultiSignatureBadge } from "@/components/MultiSignatureBadge";
import {
  Briefcase,
  TrendingUp,
  Clock,
  AlertOctagon,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Send,
  Building,
  Users,
  Lock,
} from "lucide-react";

export default function ExecutiveSuitePage() {
  const { currentUser, requisitions, disburseRequisition, triggerRejection } = useGovernance();

  const [activeTab, setActiveTab] = useState<"treasurer" | "gs" | "vp">("treasurer");
  const [pettyCashFrozen, setPettyCashFrozen] = useState(false);

  // General Secretary Attendance Disputes state (Empty in Genesis State)
  const [disputes, setDisputes] = useState<Array<{
    id: string;
    memberName: string;
    studentId: string;
    sessionDate: string;
    claim: string;
    evidence: string;
    status: string;
  }>>([]);

  // Dual-Routed Resignations Queue (Simultaneous GS + President - Empty in Genesis State)
  const [resignations, setResignations] = useState<Array<{
    id: string;
    officerName: string;
    role: string;
    submittedDate: string;
    effectiveDate: string;
    daysRemaining: number;
    reason: string;
    status: string;
    dualRouting: string;
  }>>([]);

  // Published Minutes
  const [minutesList, setMinutesList] = useState([
    {
      code: "MIN-EB-2026-06",
      title: "Minutes of Executive Board Meeting on Fall Gala Vendor Approvals",
      sessionDate: "2026-09-26",
      verifiedBy: "Tasnim Khan (GS)",
      hash: "SHA256:7f4a...9b12",
    },
  ]);

  const [newMinutesTitle, setNewMinutesTitle] = useState("");
  const [newMinutesDate, setNewMinutesDate] = useState("2026-09-29");

  const handlePublishMinutes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMinutesTitle) return;

    setMinutesList([
      {
        code: `MIN-EB-2026-0${minutesList.length + 7}`,
        title: newMinutesTitle,
        sessionDate: newMinutesDate,
        verifiedBy: `${currentUser.legalName} (${currentUser.roleTitle.split("(")[0]})`,
        hash: `SHA256:${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
      },
      ...minutesList,
    ]);
    setNewMinutesTitle("");
  };

  const handleResolveDispute = (disputeId: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: "RESOLVED_ATTENDANCE_CORRECTED" } : d))
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
              Tier 3 Executive Wings
            </span>
            <span className="text-[10px] font-mono text-slate-500">EXEC-SEC-TREAS-2026</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center space-x-2.5">
            <Briefcase className="w-6 h-6 text-cyan-600" />
            <span>Secretariat, Treasury & Vice President Desks</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Financial ledger accounting, 72-hour petty cash enforcement, roster dispute arbitration, and operational oversight.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl">
          <button
            onClick={() => setActiveTab("treasurer")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "treasurer"
                ? "bg-cyan-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Treasurer Station
          </button>
          <button
            onClick={() => setActiveTab("gs")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "gs"
                ? "bg-cyan-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            General Secretary Station
          </button>
          <button
            onClick={() => setActiveTab("vp")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "vp"
                ? "bg-cyan-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Vice President Wing
          </button>
        </div>
      </div>

      {/* Access Gate Invariant Check */}
      {process.env.NODE_ENV !== "production" && currentUser.tier > 3 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <strong>Preview Notification:</strong> You are currently viewing as {currentUser.legalName} ({currentUser.tierLabel}). Direct disbursement, dispute arbitration, and ledger management are reserved for Tier 3 officers.
          </div>
        </div>
      )}

      {/* SYSTEM-WIDE PETTY CASH FREEZE ALERT BANNER */}
      {pettyCashFrozen && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start space-x-3.5 shadow-sm animate-shake">
          <AlertOctagon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-sm text-red-900">
              SYSTEM-WIDE PETTY CASH FREEZE IN EFFECT (ARTICLE 16.4)
            </h4>
            <p className="mt-1 leading-relaxed text-red-800">
              An outstanding Tier 1 cash advance has surpassed the 72-hour deadline without an uploaded physical voucher and receipt reconciliation. In accordance with OSA Financial Directives, all new petty cash disbursements across all departments are locked until settled.
            </p>
            <div className="mt-2 flex items-center space-x-3">
              <button
                onClick={() => setPettyCashFrozen(false)}
                className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] transition-colors shadow-xs"
              >
                Clear Voucher & Lift Freeze
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: Treasurer Station */}
      {activeTab === "treasurer" && (
        <div className="space-y-6">
          {/* Double-Entry Ledger Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Verified Inflow (Debit)</span>
                <ArrowDownRight className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600 font-mono">385,000 BDT</div>
              <p className="text-[11px] text-slate-500">OSA Semester Allocation + Tickets</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Authorized Outflow (Credit)</span>
                <ArrowUpRight className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-blue-600 font-mono">218,500 BDT</div>
              <p className="text-[11px] text-slate-500">Equipment, Sound & Gala Production</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Net Treasury Reserve</span>
                <Shield className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">166,500 BDT</div>
              <p className="text-[11px] text-slate-500">Unencumbered Bank Balance</p>
            </div>
          </div>

          {/* 72-Hour Cash Advance Countdown Monitor */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>72-Hour Petty Cash Receipt Voucher Countdown</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tier 1 cash advances require validated merchant invoices submitted within 72 hours of disbursement.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPettyCashFrozen(!pettyCashFrozen)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all shadow-xs"
                >
                  {pettyCashFrozen ? "Lifting Freeze Simulation" : "Simulate 72h Freeze Expiry"}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                <div>
                  <span className="font-mono text-cyan-700 font-bold">REQ-2026-081</span>
                  <span className="text-slate-600 ml-2">2,500 BDT — Emergency XLR Cables (Music Dept)</span>
                </div>
                <div className="font-mono font-bold text-amber-700 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>28 Hours Remaining of 72h</span>
                </div>
              </div>

              {/* Visual Progress Bar (28h of 72h = 38.8% remaining) */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: "38.8%" }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Disbursed: 2026-09-28 16:00</span>
                <span>Deadline: 2026-10-01 16:00</span>
              </div>
            </div>
          </div>

          {/* Requisitions Queue for Disbursement */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Requisitions Pending Treasury Disbursement</h3>
            <div className="space-y-3">
              {requisitions.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900">{req.requisitionNumber}</span>
                      <span className="font-mono font-bold text-cyan-700">{req.amountBDT.toLocaleString()} BDT</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        Tier {req.tier}
                      </span>
                    </div>
                    <div className="text-slate-600">{req.purpose}</div>
                    <MultiSignatureBadge requisition={req} />
                  </div>

                  <div className="flex items-center space-x-2">
                    {req.status === "APPROVED" && (
                      currentUser.tier <= 3 ? (
                        <button
                          onClick={() => disburseRequisition(req.id)}
                          disabled={pettyCashFrozen}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold transition-all shadow-xs flex items-center space-x-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Disburse Funds</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 opacity-60 cursor-not-allowed text-slate-400 font-bold flex items-center space-x-1.5"
                          title="Action Locked: Disburse Gate requires Tier 3 (Treasurer or Executive Officer)"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Disburse Gate (Tier 3 Only)</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: General Secretary Station */}
      {activeTab === "gs" && (
        <div className="space-y-6">
          {/* Week 4 Attendance Dispute Resolution */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-cyan-600" />
                  <span>Week 4 Attendance Roster Dispute Management Console</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Members have 72 hours from roster publication to lodge verified attendance corrections with proof.
                </p>
              </div>
            </div>            <div className="space-y-3">
              {disputes.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200 font-mono">
                  No pending attendance disputes. Official rehearsal roster is fully reconciled.
                </div>
              ) : (
                disputes.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-cyan-700">{d.id}</span>
                        <span className="text-slate-900 font-semibold ml-2">
                          {d.memberName} ({d.studentId})
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          d.status === "PENDING_GS_REVIEW"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {d.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-700">
                      <div><strong>Session:</strong> {d.sessionDate}</div>
                      <div><strong>Dispute Claim:</strong> {d.claim}</div>
                      <div className="text-slate-600"><strong>Evidence:</strong> {d.evidence}</div>
                    </div>

                    {d.status === "PENDING_GS_REVIEW" && (
                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                        <button
                          onClick={() => handleResolveDispute(d.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center space-x-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Validate & Correct Roster</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 15-Day Dual-Routed Resignation Queue */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Users className="w-4 h-4 text-cyan-600" />
                <span>15-Day Dual-Routed Resignation Queue</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                All officer resignations are routed simultaneously to both General Secretary and President with a mandatory 15-day handover buffer.
              </p>
            </div>

            <div className="space-y-3">
              {resignations.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200 font-mono">
                  No pending officer resignations in transition queue. All constitutional roles intact.
                </div>
              ) : (
                resignations.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-cyan-700 font-bold">{r.id}</span>
                        <strong className="text-slate-900 ml-2">{r.officerName}</strong>
                        <span className="text-slate-500 ml-1">({r.role})</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {r.dualRouting}
                      </span>
                    </div>

                    <p className="text-slate-700 font-mono text-[11px]">"{r.reason}"</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                      <span>Notice Buffer: <strong className="text-slate-900">{r.daysRemaining} Days Remaining</strong></span>
                      <span>Effective: {r.effectiveDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Meeting Minutes Archival Publisher */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyan-600" />
              <span>Meeting Minutes Archival Publisher</span>
            </h3>

            <form onSubmit={handlePublishMinutes} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Minutes Session Title</label>
                  <input
                    type="text"
                    required
                    value={newMinutesTitle}
                    onChange={(e) => setNewMinutesTitle(e.target.value)}
                    placeholder="e.g. Minutes of Executive Board Rehearsal Review"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Session Date</label>
                  <input
                    type="date"
                    required
                    value={newMinutesDate}
                    onChange={(e) => setNewMinutesDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 transition-all flex items-center space-x-2 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Archive & Publish Minutes</span>
                </button>
              </div>
            </form>

            <div className="space-y-2 pt-2">
              {minutesList.map((m) => (
                <div
                  key={m.code}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{m.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {m.code} • Date: {m.sessionDate} • Sealed by: {m.verifiedBy}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    {m.hash}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Vice President Wing */}
      {activeTab === "vp" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 space-y-1">
            <h3 className="text-xs font-bold text-cyan-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Building className="w-4 h-4 text-cyan-600" />
              <span>Vice President Operational Oversight Desk</span>
            </h3>
            <p className="text-xs text-cyan-950/80 leading-relaxed">
              Pursuant to Article 8, the Vice President supervises the Event Logistics and Performance Operations wings, ensuring strict departmental alignment and rehearsal schedule compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Event Logistics Wing Status</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Operational
                </span>
              </h4>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Auditorium Booking:</span>
                  <span className="font-semibold text-slate-900">NSU Main Plaza Stage (Confirmed)</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Sound Rigging Vendor:</span>
                  <span className="font-semibold text-slate-900">Apex Production (Pending Clearance)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Coordinators Assigned:</span>
                  <span className="font-semibold text-slate-900">2 of 2 (Cap Enforced)</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Performance Operations Status</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Rehearsal Cycle Active
                </span>
              </h4>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Section 12 Creative Firewall:</span>
                  <span className="font-semibold text-purple-700">Fully Autonomous</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Active Song Arrangements:</span>
                  <span className="font-semibold text-slate-900">3 Compositions Locked</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Choir Rehearsal Attendance:</span>
                  <span className="font-semibold text-emerald-700">85.7% Average</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
