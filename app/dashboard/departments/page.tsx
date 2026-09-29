"use client";

import React, { useState } from "react";
import { useGovernance } from "@/context/GovernanceContext";
import { SongArrangement } from "@/types/governance";
import {
  Music2,
  Shield,
  Lock,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Users,
  AlertCircle,
  FileWarning,
  Sparkles,
  Sliders,
  Send,
} from "lucide-react";

export default function DepartmentWorkspacesPage() {
  const {
    currentUser,
    repertoire,
    updateSong,
    attendance,
    issueShowCause,
  } = useGovernance();

  const [activeTab, setActiveTab] = useState<"firewall" | "discipline" | "coordinators">("firewall");

  // Song edit state
  const [selectedSong, setSelectedSong] = useState<SongArrangement | null>(repertoire[0]);
  const [editedLeadVocal, setEditedLeadVocal] = useState(repertoire[0]?.leadVocal || "");
  const [editedBpm, setEditedBpm] = useState(repertoire[0]?.tempoBpm || 118);
  const [editedKey, setEditedKey] = useState(repertoire[0]?.keySignature || "D minor");

  // Section 12 Creative Firewall Check:
  // Strictly permitted ONLY to Music Department (Music Head / Creative Lead)
  const isMusicAuthority =
    currentUser.department === "Music & Performance" &&
    (currentUser.isCreativeLead || currentUser.tier === 4);

  const handleSelectSong = (song: SongArrangement) => {
    setSelectedSong(song);
    setEditedLeadVocal(song.leadVocal);
    setEditedBpm(song.tempoBpm);
    setEditedKey(song.keySignature);
  };

  const handleSaveArrangement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSong) return;

    updateSong({
      ...selectedSong,
      leadVocal: editedLeadVocal,
      tempoBpm: Number(editedBpm),
      keySignature: editedKey,
      lastEditedBy: `${currentUser.legalName} (${currentUser.roleTitle.split("(")[0]})`,
    });
  };

  // Coordinator Quotas
  const departmentQuotas = [
    { department: "Music & Performance", activeCoordinators: 2, maxCap: 2, status: "CAP_REACHED" },
    { department: "Event Logistics", activeCoordinators: 2, maxCap: 2, status: "CAP_REACHED" },
    { department: "Member Management", activeCoordinators: 1, maxCap: 2, status: "SLOT_AVAILABLE" },
    { department: "Publications & Graphics", activeCoordinators: 1, maxCap: 2, status: "SLOT_AVAILABLE" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Tier 4 Workspaces
            </span>
            <span className="text-[10px] font-mono text-slate-500">DEPT-LEAD-2026</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center space-x-2.5">
            <Music2 className="w-6 h-6 text-emerald-400" />
            <span>Department Head Workspaces & Creative Firewall</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Section 12 Creative Autonomy Firewall, Member 50% attendance cutoff enforcement, and coordinator quotas.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab("firewall")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "firewall"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Section 12 Studio ({repertoire.length})
          </button>
          <button
            onClick={() => setActiveTab("discipline")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "discipline"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Attendance & 50% Cutoff
          </button>
          <button
            onClick={() => setActiveTab("coordinators")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "coordinators"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Coordinator Quotas (Cap 2)
          </button>
        </div>
      </div>

      {/* TAB 1: Section 12 Creative Firewall Studio */}
      {activeTab === "firewall" && (
        <div className="space-y-6">
          {/* Firewall Status Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-start space-x-3.5 transition-all ${
              isMusicAuthority
                ? "bg-purple-950/30 border-purple-800/60 text-purple-200"
                : "bg-amber-950/40 border-amber-700 text-amber-200"
            }`}
          >
            {isMusicAuthority ? (
              <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Lock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="text-xs leading-relaxed">
              <div className="font-bold flex items-center space-x-2">
                <span>CONSTITUTIONAL ARTICLE 12: CREATIVE AUTONOMY FIREWALL</span>
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${
                    isMusicAuthority ? "bg-purple-900 text-purple-300" : "bg-amber-900 text-amber-300"
                  }`}
                >
                  {isMusicAuthority ? "Firewall Write-Clearance Granted" : "Read-Only Spectator Mode Enforced"}
                </span>
              </div>
              <p className="mt-1 text-slate-300">
                {isMusicAuthority
                  ? `Authenticated as ${currentUser.legalName} (${currentUser.roleTitle}). You possess exclusive constitutional authority over repertoire arrangements, vocal casting, and performance setlists.`
                  : `Authenticated as ${currentUser.legalName} (${currentUser.roleTitle}). Executive and administrative officers are strictly barred by Article 12 from altering musical arrangements, setlists, or vocal casting.`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Song Repertoire List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Active Repertoire Compositions</span>
                <span className="text-[10px] font-mono text-purple-400">Locked Vault</span>
              </h3>

              <div className="space-y-2">
                {repertoire.map((song) => {
                  const isSelected = selectedSong?.id === song.id;
                  return (
                    <button
                      key={song.id}
                      onClick={() => handleSelectSong(song)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/30"
                          : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-100 text-xs">{song.title}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            song.status === "LOCKED_FOR_CONCERT"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                              : song.status === "REHEARSAL_READY"
                              ? "bg-blue-950 text-blue-300 border border-blue-800"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {song.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">{song.genre}</div>
                      <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Lead: <strong className="text-slate-200">{song.leadVocal}</strong></span>
                        <span className="font-mono text-purple-300">{song.tempoBpm} BPM • {song.keySignature}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Arrangement & Vocal Casting Studio */}
            <div className="lg:col-span-2">
              {selectedSong ? (
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-white">{selectedSong.title}</h3>
                        <span className="text-[10px] font-mono bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">
                          Section 12 Protected
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Arranged by: {selectedSong.lastEditedBy}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400">Genre: </span>
                      <span className="text-xs font-semibold text-slate-200">{selectedSong.genre}</span>
                    </div>
                  </div>

                  <form onSubmit={handleSaveArrangement} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Key Signature
                        </label>
                        <input
                          type="text"
                          disabled={!isMusicAuthority}
                          value={editedKey}
                          onChange={(e) => setEditedKey(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Tempo (BPM)
                        </label>
                        <input
                          type="number"
                          disabled={!isMusicAuthority}
                          value={editedBpm}
                          onChange={(e) => setEditedBpm(Number(e.target.value))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Lead Vocal Casting
                        </label>
                        <input
                          type="text"
                          disabled={!isMusicAuthority}
                          value={editedLeadVocal}
                          onChange={(e) => setEditedLeadVocal(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-slate-300 font-semibold">
                        Harmonies & Choral Sections
                      </label>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                        {selectedSong.harmonies.map((h, i) => (
                          <div key={i} className="text-slate-300 flex items-center space-x-2">
                            <span className="text-purple-400 font-bold">•</span>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-slate-300 font-semibold">
                        Instrumentation Ensembles
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSong.instrumentation.map((inst, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium"
                          >
                            {inst}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <div className="text-[11px] text-slate-400">
                        {!isMusicAuthority ? (
                          <span className="text-amber-400 font-medium flex items-center space-x-1">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Read-Only: Section 12 firewall blocks mutations from non-music roles.</span>
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-medium flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>You hold write authority for this arrangement.</span>
                          </span>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={!isMusicAuthority}
                        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-purple-950/60 transition-all flex items-center space-x-2"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update Arrangement</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">Select a song to review arrangement</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Member Management & Discipline Station (50% Cutoff Line) */}
      {activeTab === "discipline" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Article 14: 50% Physical Attendance Cutoff Line & Show-Cause Gates</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Active voting eligibility requires maintaining an adjusted attendance rate of at least 50% across regular rehearsal sessions. Members falling below 50% are automatically disqualified from parliamentary voting. Members accumulating 3 consecutive unexcused absences receive a formal Show-Cause notice.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {attendance.map((record) => {
              const isBelowCutoff = record.effectivePercentage < 50;
              const has3Absences = record.consecutiveAbsences >= 3;

              return (
                <div
                  key={record.memberId}
                  className={`p-5 rounded-2xl border transition-all space-y-3 ${
                    isBelowCutoff
                      ? "bg-red-950/20 border-red-900/50 shadow-red-950/20"
                      : "bg-slate-900/80 border-slate-800"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-100">{record.memberName}</span>
                        <span className="font-mono text-xs text-slate-400 font-medium">
                          ({record.studentId})
                        </span>
                        {isBelowCutoff && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                            Below 50% Cutoff
                          </span>
                        )}
                        {has3Absences && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                            3+ Consecutive Absences
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Sessions Attended: <strong className="text-slate-200">{record.attendedSessions}</strong> / {record.totalSessions} • Approved Excused Leaves: <strong className="text-blue-300">{record.excusedLeaves}</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black font-mono text-white">
                        {record.effectivePercentage}%
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Formula: {record.attendedSessions} / ({record.totalSessions} - {record.excusedLeaves})
                      </span>
                    </div>
                  </div>

                  {/* Attendance Gauge Bar with 50% cutoff line marker */}
                  <div className="space-y-1">
                    <div className="relative w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                      {/* 50% cutoff marker */}
                      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-red-500 z-10" title="50% Cutoff Line" />
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isBelowCutoff ? "bg-red-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(100, record.effectivePercentage)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>0%</span>
                      <span className="text-red-400 font-bold">50% Minimum Threshold</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="text-xs text-slate-400">
                      Voting Status:{" "}
                      <strong className={isBelowCutoff ? "text-red-400" : "text-emerald-400"}>
                        {record.status.replace(/_/g, " ")}
                      </strong>
                    </div>

                    <div className="flex items-center space-x-2">
                      {has3Absences && !record.showCauseIssued && (
                        <button
                          onClick={() => issueShowCause(record.memberId)}
                          className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-950/60 transition-all flex items-center space-x-1.5"
                        >
                          <FileWarning className="w-3.5 h-3.5" />
                          <span>Issue Official Show-Cause Notice</span>
                        </button>
                      )}

                      {record.showCauseIssued && (
                        <span className="text-xs font-bold text-red-400 bg-red-950/60 px-3 py-1 rounded-xl border border-red-900/60">
                          Show-Cause Notice Active (Voting Suspended)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Department Coordinator Management (Max 2 Cap) */}
      {activeTab === "coordinators" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-800/40 space-y-1">
            <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Article 9: Department Coordinator Quota (Strict Cap of 2)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              To prevent administrative bloat and supervisory dilution, the club constitution enforces an absolute cap of exactly 2 active Coordinators per functional department. Any attempt to register a 3rd coordinator is rejected at the database trigger layer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departmentQuotas.map((dept, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">{dept.department}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      dept.status === "CAP_REACHED"
                        ? "bg-red-950 text-red-300 border border-red-800"
                        : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                    }`}
                  >
                    {dept.status === "CAP_REACHED" ? "Maximum Cap Reached" : "1 Seat Available"}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Active Coordinators:</span>
                    <strong className="text-slate-100 font-mono">
                      {dept.activeCoordinators} / {dept.maxCap} Maximum
                    </strong>
                  </div>

                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 mt-2">
                    <div
                      className={`h-full rounded-full ${
                        dept.status === "CAP_REACHED" ? "bg-amber-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${(dept.activeCoordinators / dept.maxCap) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">Enforced by PL/pgSQL Trigger</span>
                  <button
                    disabled={dept.status === "CAP_REACHED"}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {dept.status === "CAP_REACHED" ? "Seat Locked" : "Nominate Coordinator"}
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
