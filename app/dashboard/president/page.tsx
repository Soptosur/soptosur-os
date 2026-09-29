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
    "Farhan Rahman (President)",
    "Anika Tabassum (VP)",
    "Tasnim Khan (GS)",
  ]); // 3 of 4 = 75% -> Quorum Met!
  const [dispatchedMeetings, setDispatchedMeetings] = useState([
    {
      id: "MTG-2026-08",
      title: "EB Emergency Session on Fall Plaza Staging Acoustics",
      date: "2026-09-28 16:30",
      quorumPct: 100,
      status: "CONCLUDED",
      attendees: 4,
    },
  ]);

  // Vacancy Monitor State (15-day countdown)
  const [vacancies, setVacancies] = useState([
    {
      role: "Publications & Graphics Head",
      status: "ACTING_APPOINTED",
      actingOfficer: "Tahmid Ahsan",
      daysRemaining: 9, // 9 days remaining of 15-day constitutional window
      startDate: "2026-09-24",
    },
    {
      role: "Assistant General Secretary",
      status: "VACANT",
      actingOfficer: "Unassigned",
      daysRemaining: 4, // Critical: 4 days remaining!
      startDate: "2026-09-19",
    },
  ]);

  // Filter Tier 2 requisitions (2,001 - 20,000 BDT)
  const tier2Requisitions = requisitions.filter(
    (r) => r.tier === 2 || (r.amountBDT > 2000 && r.amountBDT <= 20000)
  );

  // EB Quorum: 3 of 4 required (75%)
  const totalEBMembers = 4;
  const currentQuorumPct = (confirmedAttendees.length / totalEBMembers) * 100;
  const isEBQuorumMet = currentQuorumPct >= 75;

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              Tier 2 Executive Suite
            </span>
            <span className="text-[10px] font-mono text-slate-500">PRES-EXEC-2026</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center space-x-2.5">
            <Crown className="w-6 h-6 text-blue-400" />
            <span>President Executive Suite</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dual-signature financial governance, executive convocations, and constitutional vacancy oversight.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab("banking")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "banking"
                ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Banking Desk ({tier2Requisitions.length})
          </button>
          <button
            onClick={() => setActiveTab("meetings")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "meetings"
                ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Meeting Dispatcher
          </button>
          <button
            onClick={() => setActiveTab("vacancies")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "vacancies"
                ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            15-Day Vacancy Monitor
          </button>
        </div>
      </div>

      {/* Access Gate Invariant Check */}
      {currentUser.tier !== 2 && (
        <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div>
            <strong>Preview Notification:</strong> You are currently viewing as {currentUser.legalName} ({currentUser.tierLabel}). Dual-signature co-signing and executive dispatch authority belong to Tier 2 (President or Acting President).
          </div>
        </div>
      )}

      {/* TAB 1: Dual-Signature Banking Desk */}
      {activeTab === "banking" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-800/40 space-y-1">
            <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Tier 2 Dual-Signature Protocol (2,001 to 20,000 BDT)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Under NSU OSA financial controls, any expenditure between 2,001 and 20,000 BDT requires mandatory co-signatures from both the Treasurer and the President before disbursement. Neither officer may disburse unilaterally.
            </p>
          </div>

          <div className="space-y-4">
            {tier2Requisitions.map((req) => (
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
                      <span className="text-sm font-bold text-blue-400 font-mono">
                        {req.amountBDT.toLocaleString()} BDT
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                        Tier 2 Requisition
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Initiator: <span className="text-slate-200 font-semibold">{req.requestedBy}</span> ({req.initiatorRole})
                    </div>
                  </div>

                  <div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        req.signatures.presidentSigned
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : "bg-amber-950 text-amber-300 border border-amber-800"
                      }`}
                    >
                      {req.signatures.presidentSigned ? "President Co-Signed" : "Awaiting President Co-Signature"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-slate-300">
                    <strong>Purpose:</strong> {req.purpose}
                  </div>
                  <div className="text-slate-400">
                    <strong>Vendor:</strong> {req.vendorName}
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
                  {!req.signatures.presidentSigned && req.status !== "REJECTED" && (
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
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-950/50 flex items-center space-x-1.5 transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Digital Co-Sign (President Signature)</span>
                      </button>
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
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>Executive Board Convocation Dispatcher</span>
              </h3>

              <form onSubmit={handleDispatchMeeting} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Convocation Title / Purpose <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="e.g., Executive Board Strategic Review for Fall Musical Show"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Session Schedule (Date & Time)
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Location / Hall
                    </label>
                    <input
                      type="text"
                      defaultValue="NSU Student Lounge Room 402"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Confirmed Executive Attendees (EB Quorum Calculator)
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                    {[
                      "Farhan Rahman (President)",
                      "Anika Tabassum (VP)",
                      "Tasnim Khan (GS)",
                      "Mehedi Hasan (Treasurer)",
                    ].map((officer) => {
                      const isChecked = confirmedAttendees.includes(officer);
                      return (
                        <button
                          key={officer}
                          type="button"
                          onClick={() => toggleAttendee(officer)}
                          className={`p-2 rounded-lg text-left text-[11px] font-semibold flex items-center justify-between border transition-all ${
                            isChecked
                              ? "bg-blue-600/20 text-blue-200 border-blue-500/50"
                              : "bg-slate-900 text-slate-400 border-slate-800"
                          }`}
                        >
                          <span>{officer}</span>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isEBQuorumMet
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : "bg-red-950 text-red-300 border border-red-800"
                      }`}
                    >
                      {isEBQuorumMet
                        ? `Quorum Satisfied (${currentQuorumPct}% ≥ 75%)`
                        : `Quorum Deficient (${currentQuorumPct}% < 75%)`}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={!isEBQuorumMet}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 transition-all flex items-center space-x-2 shadow-lg shadow-blue-950/60"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish & Dispatch Convocation</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Dispatched Executive Convocations
            </h4>
            {dispatchedMeetings.map((mtg) => (
              <div
                key={mtg.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-blue-300 font-bold">{mtg.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {mtg.status}
                  </span>
                </div>
                <div className="font-semibold text-slate-200">{mtg.title}</div>
                <div className="text-[11px] text-slate-400 font-mono">{mtg.date}</div>
                <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
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
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-1">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Article 11: 15-Day Constitutional Officer Vacancy Protocol</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Whenever an executive office or department leadership seat becomes vacant, an acting officer must be appointed within 15 calendar days. Failure to appoint within 15 days automatically transfers appointment authority to the Faculty Advisor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vacancies.map((v, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{v.role}</h4>
                    <span className="text-[10px] text-slate-400">Vacancy Created: {v.startDate}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      v.status === "ACTING_APPOINTED"
                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                        : "bg-red-950 text-red-300 border border-red-800"
                    }`}
                  >
                    {v.status.replace("_", " ")}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Active Designee:</span>
                    <strong className="text-slate-200">{v.actingOfficer}</strong>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400">15-Day Constitutional Window:</span>
                      <span className="font-bold text-amber-400 font-mono">
                        {v.daysRemaining} Days Remaining
                      </span>
                    </div>
                    {/* Visual countdown progress bar */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          v.daysRemaining <= 5 ? "bg-red-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${(v.daysRemaining / 15) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    {v.daysRemaining <= 5 ? "⚠️ Imminent Advisor Default" : "Standard Appointment Window"}
                  </span>
                  <button className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors">
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
