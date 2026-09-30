"use client";

import React, { useState } from "react";
import { useGovernance } from "@/context/GovernanceContext";
import {
  Users,
  Vote,
  FileCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Send,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  X,
} from "lucide-react";

export default function MemberStationPage() {
  const {
    currentUser,
    attendance,
    submitLeave,
    agendas,
    castVote,
    petitions,
    signPetition,
  } = useGovernance();

  const [activeTab, setActiveTab] = useState<"profile" | "voting" | "petitions">("profile");

  // Leave submission drawer state
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveSessions, setLeaveSessions] = useState(1);
  const [leaveDocUrl, setLeaveDocUrl] = useState("");
  const [leaveDrawerOpen, setLeaveDrawerOpen] = useState(false);

  // Find member's personal attendance record
  const personalRecord =
    attendance.find((a) => a.memberId === currentUser.id) || attendance[0];

  const isBelowCutoff = personalRecord.effectivePercentage < 50;

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason) return;
    submitLeave(leaveReason, Number(leaveSessions));
    setLeaveReason("");
    setLeaveDocUrl("");
    setLeaveDrawerOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Tier 5 Member Booth
            </span>
            <span className="text-[10px] font-mono text-slate-500">GEN-ASSEMBLY-2026</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center space-x-2.5">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Member Profile & Parliamentary Booth</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personal attendance tracking, excused leave submissions, floor quorum voting, and digital petitioning.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Personal Attendance Meter
          </button>
          <button
            onClick={() => setActiveTab("voting")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "voting"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Parliamentary Voting Booth ({agendas.length})
          </button>
          <button
            onClick={() => setActiveTab("petitions")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "petitions"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Digital Petitions ({petitions.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Member Personal Profile & Attendance Meter */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Identity Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Member Credentials
                </span>
                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                  Standing: Active
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-slate-500">Legal Name</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{currentUser.legalName}</div>
                </div>

                <div>
                  <div className="text-slate-500">NSU Student ID</div>
                  <div className="font-mono text-slate-800 font-semibold">{currentUser.studentId}</div>
                </div>

                <div>
                  <div className="text-slate-500">Assigned Department</div>
                  <div className="text-slate-800 font-semibold">{currentUser.department}</div>
                </div>

                <div>
                  <div className="text-slate-500">Constitutional Tier</div>
                  <div className="text-blue-700 font-semibold">{currentUser.tierLabel}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => setLeaveDrawerOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Submit Excused Leave Application</span>
                </button>
              </div>
            </div>

            {/* Attendance Meter & Denominator Adjustment */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Constitutional Attendance Meter</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live calculation with automatic denominator adjustment for approved excused leaves.
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-slate-900">
                    {personalRecord.effectivePercentage}%
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isBelowCutoff
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {isBelowCutoff ? "Below 50% Cutoff (Voting Blocked)" : "Above 50% (Voting Eligible)"}
                  </span>
                </div>
              </div>

              {/* Visual Meter Bar */}
              <div className="space-y-2">
                <div className="relative w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200">
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-red-400 z-10" title="50% Cutoff" />
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isBelowCutoff ? "bg-red-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, personalRecord.effectivePercentage)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>0%</span>
                  <span className="text-red-600 font-bold">50% Cutoff Threshold</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Denominator breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="text-slate-500">Sessions Attended</div>
                  <div className="text-base font-bold text-slate-900 mt-1 font-mono">
                    {personalRecord.attendedSessions}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="text-slate-500">Excused Leaves (Deducted)</div>
                  <div className="text-base font-bold text-blue-600 mt-1 font-mono">
                    {personalRecord.excusedLeaves}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="text-slate-500">Adjusted Total Denominator</div>
                  <div className="text-base font-bold text-emerald-600 mt-1 font-mono">
                    {personalRecord.totalSessions - personalRecord.excusedLeaves}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900 font-mono">
                Formula: {personalRecord.attendedSessions} / ({personalRecord.totalSessions} - {personalRecord.excusedLeaves}) = {personalRecord.effectivePercentage}%
              </div>
            </div>
          </div>

          {/* Leave Submission Modal / Drawer */}
          {leaveDrawerOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
              <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Official Excused Leave Submission</span>
                  </h3>
                  <button
                    onClick={() => setLeaveDrawerOpen(false)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-mono flex items-center space-x-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Close</span>
                  </button>
                </div>

                <form onSubmit={handleLeaveSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Reason for Absence (Medical, Academic, Bereavement) <span className="text-blue-600">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      placeholder="Detail the valid justification with course exam slip or medical document reference..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Sessions Missed
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        required
                        value={leaveSessions}
                        onChange={(e) => setLeaveSessions(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        Document Upload URL / Path
                      </label>
                      <input
                        type="text"
                        placeholder="https://drive.google.com/..."
                        value={leaveDocUrl}
                        onChange={(e) => setLeaveDocUrl(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setLeaveDrawerOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs"
                    >
                      Submit Leave Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Parliamentary Voting Booth (Quorum & Recusal States) */}
      {activeTab === "voting" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
            <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Vote className="w-4 h-4 text-blue-600" />
              <span>ধারা ৭: সাধারণ সভা ও ফ্লোর কোরাম (ARTICLE 7: FLOOR QUORUM)</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              গঠনতন্ত্রের ধারা ৭:৩ অনুযায়ী, গঠনতন্ত্র সংশোধন (ধারা ১১), কর্মকর্তা অপসারণ (ধারা ৪), বা সংগঠন বিলুপ্তির (ধারা ১৩) মতো গুরুত্বপূর্ণ বিষয়ে ন্যূনতম ৩৩% সক্রিয় সদস্যের উপস্থিতি (Floor Quorum) নিশ্চিত থাকা বাধ্যতামূলক। এছাড়া ধারা ৩:৪ অনুযায়ী কোনো প্রস্তাবে স্বার্থের সংঘাত থাকলে সংশ্লিষ্ট সদস্য ভোটদানে বিরত (Recusal) থাকবেন।
            </p>
          </div>

          <div className="space-y-4">
            {agendas.map((agenda) => {
              const isConflicted = agenda.conflictedMembers.includes(currentUser.id);
              const isFloorQuorumMet = agenda.activeQuorumPercentage >= agenda.floorQuorumThreshold;

              return (
                <div
                  key={agenda.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          {agenda.agendaCode}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {agenda.category.replace(/_/g, " ")}
                        </span>
                        {isConflicted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 flex items-center space-x-1">
                            <ShieldAlert className="w-3 h-3 text-red-600" />
                            <span>Conflict of Interest: Recusal Active</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5">{agenda.title}</h4>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-800">
                        Floor Quorum: {agenda.activeQuorumPercentage}%
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isFloorQuorumMet
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {isFloorQuorumMet ? "Floor Quorum Satisfied (≥ 33%)" : "Quorum Deficient"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{agenda.description}</p>

                  {/* Real-time Tally */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">In Favor (Yes)</span>
                      <div className="text-lg font-black text-emerald-600 font-mono mt-0.5">
                        {agenda.votesInFavor}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Against (No)</span>
                      <div className="text-lg font-black text-red-600 font-mono mt-0.5">
                        {agenda.votesAgainst}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Abstentions</span>
                      <div className="text-lg font-black text-slate-600 font-mono mt-0.5">
                        {agenda.abstentions}
                      </div>
                    </div>
                  </div>

                  {/* Voting Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="text-[11px] text-slate-500">
                      {isConflicted ? (
                        <span className="text-red-600 font-semibold flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600 inline flex-shrink-0" />
                          <span>You are formally recused from this vote due to departmental or financial conflict.</span>
                        </span>
                      ) : (
                        <span>Authenticated member vote recorded on the immutable roll.</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => castVote(agenda.id, "FOR")}
                        disabled={isConflicted || isBelowCutoff}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition-colors shadow-xs"
                      >
                        Vote In Favor
                      </button>
                      <button
                        onClick={() => castVote(agenda.id, "AGAINST")}
                        disabled={isConflicted || isBelowCutoff}
                        className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition-colors shadow-xs"
                      >
                        Vote Against
                      </button>
                      <button
                        onClick={() => castVote(agenda.id, "ABSTAIN")}
                        disabled={isConflicted || isBelowCutoff}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 font-semibold text-xs transition-colors"
                      >
                        Abstain
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Digital Petition Desk (25% EGM Threshold) */}
      {activeTab === "petitions" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
            <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Article 7: Digital Petition & 25% EGM Convocation Gate</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              General members can initiate and digitally sign petitions for Extraordinary General Meetings (EGMs) or policy reviews. When signatures reach 25% of all active members in good standing, the General Secretary is constitutionally obligated to schedule the EGM within 7 days.
            </p>
          </div>

          <div className="space-y-4">
            {petitions.map((pet) => {
              const signaturePct = (pet.currentSignatures / pet.totalEligibleMembers) * 100;
              const thresholdMet = signaturePct >= pet.targetThresholdPercentage;

              return (
                <div
                  key={pet.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          {pet.code}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                          {pet.category.replace(/_/g, " ")}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5">{pet.title}</h4>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          thresholdMet
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {thresholdMet ? "25% Threshold Met (EGM Mandated)" : "Active Petition Collection"}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{pet.description}</p>

                  {/* Progress Bar towards 25% */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">
                        Signatures: <strong className="text-slate-900 font-mono">{pet.currentSignatures}</strong> of {pet.totalEligibleMembers} Active Members
                      </span>
                      <span className="font-bold text-purple-700 font-mono">
                        {signaturePct.toFixed(1)}% / 25.0% Required
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          thresholdMet ? "bg-emerald-500" : "bg-purple-600"
                        }`}
                        style={{ width: `${Math.min(100, (signaturePct / 25.0) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Signature Deadline: {new Date(pet.deadline).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => signPetition(pet.id)}
                      disabled={pet.signedByUser}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                        pet.signedByUser
                          ? "bg-slate-100 text-emerald-700 border border-emerald-300 cursor-default"
                          : "bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{pet.signedByUser ? "Verified & Digitally Signed" : "Digitally Sign Petition"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
