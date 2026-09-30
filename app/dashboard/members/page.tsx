"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Phone,
  Shield,
  GraduationCap,
  Building,
  CheckCircle2,
  Copy,
  Check,
  LayoutGrid,
  List,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";

interface Member {
  id: string;
  studentId: string;
  nsuEmail: string;
  legalName: string;
  contactPhone: string | null;
  avatarUrl: string | null;
  standing: string;
  hasProctorialClearance: boolean;
  cgpa: string | null;
  completedSemesters: number;
  joinedSemester: string;
  tier: number;
  tierLabel: string;
  role: string;
  roleTitle: string;
  department: string;
  departmentLabel: string;
  isActing: boolean;
  supervisor: string | null;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [lastSynced, setLastSynced] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchMembers = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const res = await fetch("/api/members", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.members)) {
        setMembers(data.members);
        setLastSynced(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtered members based on search and tier
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.nsuEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.departmentLabel.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTier =
        selectedTier === "ALL" || m.tier.toString() === selectedTier;

      return matchesSearch && matchesTier;
    });
  }, [members, searchQuery, selectedTier]);

  // Statistics
  const tierCounts = useMemo(() => {
    const counts = { total: members.length, t1: 0, t2: 0, t3: 0, t4: 0, t5: 0 };
    members.forEach((m) => {
      if (m.tier === 1) counts.t1++;
      else if (m.tier === 2) counts.t2++;
      else if (m.tier === 3) counts.t3++;
      else if (m.tier === 4) counts.t4++;
      else if (m.tier === 5) counts.t5++;
    });
    return counts;
  }, [members]);

  const getTierBadgeStyle = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-purple-50 text-purple-700 border-purple-200";
      case 2:
        return "bg-blue-50 text-blue-700 border-blue-200";
      case 3:
        return "bg-cyan-50 text-cyan-800 border-cyan-200";
      case 4:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case 5:
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Header with Live Database Sync Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Institutional Roster
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Realtime Neon PostgreSQL Connected</span>
            </div>
            {lastSynced && (
              <span className="text-[10px] font-mono text-slate-400">
                Synced at {lastSynced}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center space-x-2.5">
            <Users className="w-7 h-7 text-blue-600" />
            <span>Member Directory & Governance Roster</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Live database registry of all official members from Tier 1 Faculty Advisory through Tier 5 General Assembly, enforcing single-supervisor chain-of-command records.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchMembers(true)}
            disabled={isRefreshing || isLoading}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Roster"}</span>
          </button>

          <Link
            href="/dashboard/profile"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 shadow-blue-500/20"
          >
            <span>Edit My Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Roster Overview Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setSelectedTier("ALL")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedTier === "ALL"
              ? "bg-blue-50/70 border-blue-300 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Total Roster
          </div>
          <div className="text-xl font-black text-slate-900 mt-0.5">
            {tierCounts.total}
          </div>
          <div className="text-[10px] text-blue-600 font-semibold mt-1">All Active Tiers</div>
        </button>

        <button
          onClick={() => setSelectedTier("1")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedTier === "1"
              ? "bg-purple-50/70 border-purple-300 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
            Tier 1
          </div>
          <div className="text-xl font-black text-purple-900 mt-0.5">
            {tierCounts.t1}
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-1 truncate">Faculty Advisor</div>
        </button>

        <button
          onClick={() => setSelectedTier("2")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedTier === "2"
              ? "bg-blue-50/70 border-blue-300 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
            Tier 2
          </div>
          <div className="text-xl font-black text-blue-900 mt-0.5">
            {tierCounts.t2}
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-1 truncate">Club President</div>
        </button>

        <button
          onClick={() => setSelectedTier("3")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedTier === "3"
              ? "bg-cyan-50/70 border-cyan-300 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-700">
            Tier 3
          </div>
          <div className="text-xl font-black text-cyan-900 mt-0.5">
            {tierCounts.t3}
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-1 truncate">Executive Board</div>
        </button>

        <button
          onClick={() => setSelectedTier("4")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedTier === "4"
              ? "bg-emerald-50/70 border-emerald-300 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            Tier 4
          </div>
          <div className="text-xl font-black text-emerald-900 mt-0.5">
            {tierCounts.t4}
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-1 truncate">Dept Heads</div>
        </button>

        <button
          onClick={() => setSelectedTier("5")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedTier === "5"
              ? "bg-slate-100 border-slate-400 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Tier 5
          </div>
          <div className="text-xl font-black text-slate-900 mt-0.5">
            {tierCounts.t5}
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-1 truncate">General Assembly</div>
        </button>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by member name, NSU ID, email, role, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
          />
        </div>

        {/* Tier Chips & View Toggle */}
        <div className="flex items-center space-x-2">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                viewMode === "grid"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                viewMode === "table"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Member Display Section */}
      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700 mt-3">Connecting to Neon PostgreSQL...</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Fetching verified roster credentials</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700 mt-3">No members match your search criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting &quot;All Tiers&quot;.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedTier("ALL");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => {
            const emailKey = `email-${member.id}`;
            const avatarSrc =
              member.avatarUrl ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                member.legalName
              )}&backgroundColor=2563eb,3b82f6,1d4ed8`;

            return (
              <div
                key={member.id}
                className="bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top Row: Avatar & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:border-blue-400 transition-colors">
                        <img
                          src={avatarSrc}
                          alt={member.legalName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as any).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                              member.legalName
                            )}`;
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight truncate">
                          {member.legalName}
                        </h3>
                        <div className="flex items-center space-x-1.5 text-[11px] font-mono font-semibold text-slate-500 mt-0.5">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                          <span className="truncate">ID: {member.studentId}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border shadow-2xs flex-shrink-0 ${getTierBadgeStyle(
                        member.tier
                      )}`}
                    >
                      Tier {member.tier}
                    </span>
                  </div>

                  {/* Role Title & Department */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="text-xs font-black text-slate-800 flex items-center justify-between">
                      <span>{member.roleTitle}</span>
                      {member.isActing && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-bold">
                          Acting
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-1 font-medium">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{member.departmentLabel}</span>
                    </div>
                  </div>

                  {/* Contact Credentials */}
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    {/* NSU Official Email */}
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-700 truncate pr-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{member.nsuEmail}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(member.nsuEmail, emailKey)}
                        className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors flex-shrink-0"
                        title="Copy Official Email"
                      >
                        {copiedKey === emailKey ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Contact Phone (if available) */}
                    {member.contactPhone && (
                      <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-500 px-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{member.contactPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Badges & Supervisor */}
                <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between text-[10px]">
                  <div className="flex items-center space-x-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Active Standing</span>
                  </div>

                  {member.supervisor && (
                    <span className="text-slate-400 font-medium truncate max-w-[150px]" title={`Supervised by: ${member.supervisor}`}>
                      Reports to: {member.supervisor.split(" ")[0]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DATA TABLE VIEW */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Tier & Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">NSU Official Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4 text-center">Standing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((member) => {
                  const avatarSrc =
                    member.avatarUrl ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      member.legalName
                    )}&backgroundColor=2563eb`;

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      {/* Name & Photo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                            <img
                              src={avatarSrc}
                              alt={member.legalName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as any).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                  member.legalName
                                )}`;
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 leading-tight">
                              {member.legalName}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Joined {member.joinedSemester}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                        {member.studentId}
                      </td>

                      {/* Tier & Role */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getTierBadgeStyle(
                              member.tier
                            )}`}
                          >
                            Tier {member.tier}
                          </span>
                          <span className="font-semibold text-slate-800">
                            {member.roleTitle}
                          </span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {member.departmentLabel}
                      </td>

                      {/* Official Email */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                        <a
                          href={`mailto:${member.nsuEmail}`}
                          className="hover:text-blue-600 underline decoration-slate-300 underline-offset-2"
                        >
                          {member.nsuEmail}
                        </a>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {member.contactPhone || "—"}
                      </td>

                      {/* Standing */}
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                          <span>Active</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
