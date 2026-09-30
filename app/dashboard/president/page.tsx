"use client";

import React, { useState } from "react";
import { useGovernance } from "@/context/GovernanceContext";
import { MultiSignatureBadge } from "@/components/MultiSignatureBadge";
import {
  Crown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Send,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Building,
  Lock,
} from "lucide-react";

export default function PresidentSuitePage() {
  const {
    currentUser,
    requisitions,
    approveRequisition,
    triggerRejection,
  } = useGovernance();

  const [activeTab, setActiveTab] = useState<"banking" | "meetings" | "vacancies">("banking");

  // Executive Meeting Dispatcher state
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("2026-10-02T15:00");
  const [meetingAgenda, setMeetingAgenda] = useState("");
  const [confirmedAttendees, setConfirmedAttendees] = useState<string[]>([
    "President (EB Officer)",
    "Vice President (EB Officer)",
    "General Secretary (EB Officer)",
  ]); // 3 of 4 = 75% -> Quorum Met!
  const [dispatchedMeetings, setDispatchedMeetings] = useState([
    {
      id: "MTG-2026-01",
      title: "EB Session on Semester Planning & Budget Allocation",
      date: "2026-10-02 15:00",
      quorumPct: 100,
      status: "SCHEDULED",
      attendees: 4,
    },
  ]);

  // Vacancy Monitor State (15-day countdown under Article 6)
  const [vacancies, setVacancies] = useState([
    {
      role: "Media & Design Head",
      status: "VACANT",
      actingOfficer: "Unassigned (VACANT)",
      daysRemaining: 15,
      startDate: "2026-09-30",
    },
    {
      role: "Sponsorship & Partnership Head",
      status: "VACANT",
      actingOfficer: "Unassigned (VACANT)",
      daysRemaining: 15,
      startDate: "2026-09-30",
    },
  ]);

  // Filter Tier 2 requisitions (2,001 - 20,000 BDT)
  const tier2Requisitions = requisitions.filter(
    (r) => r.tier === 2 || (r.amountBDT > 2000 && r.amountBDT <= 20000)
  );

  // EB Quorum (Article 3:2): Minimum 3 out of 4 officers present (must include President or VP)
  const totalEBMembers = 4;
  const hasPresidentOrVP = confirmedAttendees.some(
    (a) => a.includes("President") || a.includes("VP")
  );
  const currentQuorumPct = (confirmedAttendees.length / totalEBMembers) * 100;
  const isEBQuorumMet = confirmedAttendees.length >= 3 && hasPresidentOrVP;

  const handleDispatchMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle) return;

    setDispatchedMeetings((prev) => [
      {
        id: `MTG-2026-0${prev.length + 9}`,
        title: meetingTitle,
        date: meetingDate.replace("T", " "),
        quorumPct: currentQuorumPct,
        status: "DISPATCHED",
        attendees: confirmedAttendees.length,
      },
      ...prev,
    ]);

    setMeetingTitle("");
    setMeetingAgenda("");
  };

  const toggleAttendee = (officer: string) => {
    if (confirmedAttendees.includes(officer)) {
      setConfirmedAttendees(confirmedAttendees.filter((a) => a !== officer));
    } else {
      setConfirmedAttendees([...confirmedAttendees, officer]);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Tier 2 Executive Suite
            </span>
            <span className="text-[10px] font-mono text-slate-500">PRES-EXEC-2026</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center space-x-2.5">
            <Crown className="w-6 h-6 text-blue-600" />
            <span>President Executive Suite</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dual-signature financial governance, executive convocations, and constitutional vacancy oversight.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl">
          <button
            onClick={() => setActiveTab("banking")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "banking"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Banking Desk ({tier2Requisitions.length})
          </button>
          <button
            onClick={() => setActiveTab("meetings")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "meetings"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Meeting Dispatcher
          </button>
          <button
            onClick={() => setActiveTab("vacancies")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "vacancies"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            15-Day Vacancy Monitor
          </button>
        </div>
      </div>

      {/* Access Gate Invariant Check */}
      {process.env.NODE_ENV !== "production" && currentUser.tier !== 2 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <strong>Preview Notification:</strong> You are currently viewing as {currentUser.legalName} ({currentUser.tierLabel}). Dual-signature co-signing and executive dispatch authority belong to Tier 2 (President or Acting President).
          </div>
        </div>
      )}

      {/* TAB 1: Dual-Signature Banking Desk */}
      {activeTab === "banking" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Tier 2 Dual-Signature Protocol (2,001 to 20,000 BDT)</span>
            </h3>
            <p className="text-xs text-blue-950/80 leading-relaxed">
              Under NSU OSA financial controls, any expenditure between 2,001 and 20,000 BDT requires mandatory co-signatures from both the Treasurer and the President before disbursement. Neither officer may disburse unilaterally.
            </p>
          </div>

          <div className="space-y-4">
            {tier2Requisitions.map((req) => (
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
                      <span className="text-sm font-bold text-blue-600 font-mono">
                        {req.amountBDT.toLocaleString()} BDT
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        Tier 2 Requisition
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Initiator: <span className="text-slate-900 font-semibold">{req.requestedBy}</span> ({req.initiatorRole})
                    </div>
                  </div>

                  <div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        req.signatures.presidentSigned
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {req.signatures.presidentSigned ? "President Co-Signed" : "Awaiting President Co-Signature"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-slate-700">
                    <strong>Purpose:</strong> {req.purpose}
                  </div>
                  <div className="text-slate-600">
                    <strong>Vendor:</strong> {req.vendorName}
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
                  {!req.signatures.presidentSigned && req.status !== "REJECTED" && (
                    <>
                      {currentUser.tier <= 2 && (
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
                      )}

                      {currentUser.tier <= 2 || (currentUser.isActing && currentUser.actingRole?.toLowerCase().includes("president")) ? (
                        <button
                          onClick={() => approveRequisition(req.id)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center space-x-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Digital Co-Sign (President Signature)</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 opacity-60 cursor-not-allowed flex items-center space-x-1.5"
                          title="Action Locked: Requires Tier 2 (President or Acting President)"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Co-Sign Locked (Tier 2 Only)</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Executive Meeting Dispatcher */}
      {activeTab === "meetings" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Executive Board Convocation Dispatcher</span>
              </h3>

              <form onSubmit={handleDispatchMeeting} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Convocation Title / Purpose <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="e.g., Executive Board Strategic Review for Fall Musical Show"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Session Schedule (Date & Time)
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Location / Hall
                    </label>
                    <input
                      type="text"
                      defaultValue="NSU Student Lounge Room 402"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Confirmed Executive Attendees (EB Quorum Calculator)
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    {[
                      "President (EB Officer)",
                      "Vice President (EB Officer)",
                      "General Secretary (EB Officer)",
                      "Treasurer (EB Officer)",
                    ].map((officer) => {
                      const isChecked = confirmedAttendees.includes(officer);
                      return (
                        <button
                          key={officer}
                          type="button"
                          onClick={() => toggleAttendee(officer)}
                          className={`p-2 rounded-lg text-left text-[11px] font-semibold flex items-center justify-between border transition-all ${
                            isChecked
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <span>{officer}</span>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          isEBQuorumMet
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {isEBQuorumMet
                          ? `Article 3:2 Quorum Met (${confirmedAttendees.length}/4 officers present, President/VP included)`
                          : `Article 3:2 Quorum Lacking (${confirmedAttendees.length}/4 officers, President or VP required)`}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Pursuant to Article 3:3, the President exercises the Casting Vote in event of a tie (2–2 or 1–1).
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={!isEBQuorumMet}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 transition-all flex items-center space-x-2 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish & Dispatch Convocation</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Dispatched Executive Convocations
            </h4>
            {dispatchedMeetings.map((mtg) => (
              <div
                key={mtg.id}
                className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-blue-700 font-bold">{mtg.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {mtg.status}
                  </span>
                </div>
                <div className="font-semibold text-slate-900">{mtg.title}</div>
                <div className="text-[11px] text-slate-500 font-mono">{mtg.date}</div>
                <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Quorum: {mtg.quorumPct}%</span>
                  <span>{mtg.attendees} / 4 EB Officers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Acting Officer & Vacancy Monitor (15-Day Countdown) */}
      {activeTab === "vacancies" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
            <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Article 11: 15-Day Constitutional Officer Vacancy Protocol</span>
            </h3>
            <p className="text-xs text-amber-950/80 leading-relaxed">
              Whenever an executive office or department leadership seat becomes vacant, an acting officer must be appointed within 15 calendar days. Failure to appoint within 15 days automatically transfers appointment authority to the Faculty Advisor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancies.map((v, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{v.role}</h4>
                    <span className="text-[10px] text-slate-500">Vacancy Created: {v.startDate}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      v.status === "ACTING_APPOINTED"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {v.status.replace("_", " ")}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Active Designee:</span>
                    <strong className="text-slate-900">{v.actingOfficer}</strong>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">15-Day Constitutional Window:</span>
                      <span className="font-bold text-amber-700 font-mono">
                        {v.daysRemaining} Days Remaining
                      </span>
                    </div>
                    {/* Visual countdown progress bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          v.daysRemaining <= 5 ? "bg-red-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${(v.daysRemaining / 15) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    {v.daysRemaining <= 5 ? (
                      <span className="text-red-600 font-semibold flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-red-600 inline" />
                        <span>Imminent Advisor Default</span>
                      </span>
                    ) : (
                      "Standard Appointment Window"
                    )}
                  </span>
                  <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs">
                    Formalize Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
