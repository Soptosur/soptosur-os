"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  RefreshCw,
  Mail,
  Shield,
  GraduationCap,
  Building,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  List,
  Sparkles,
  ChevronRight,
  ScrollText,
  FileCheck2,
  Clock,
  Compass,
} from "lucide-react";

interface Member {
  id: string;
  isVacant: boolean;
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
  appointmentRequirement?: string;
  constitutionalClause?: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [lastSynced, setLastSynced] = useState<string>("");

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

  // Filtered members based on search and tier
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.departmentLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.constitutionalClause && m.constitutionalClause.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTier =
        selectedTier === "ALL" || m.tier.toString() === selectedTier;

      return matchesSearch && matchesTier;
    });
  }, [members, searchQuery, selectedTier]);

  // Statistics
  const stats = useMemo(() => {
    const counts = { total: members.length, vacant: 0, appointed: 0, t1: 0, t2: 0, t3: 0, t4: 0, t5: 0 };
    members.forEach((m) => {
      if (m.isVacant) counts.vacant++;
      else counts.appointed++;

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
        return "bg-[#F5EDEB] text-[#7A2C10] border-[#E2CCC7]";
      case 2:
        return "bg-[#FAF4EE] text-[#8B3A0F] border-[#E8D9CB]";
      case 3:
        return "bg-[#F8F5EE] text-[#92541A] border-[#E8DEC9]";
      case 4:
        return "bg-[#F3F6F2] text-[#2D5A3F] border-[#D4DEC9]";
      case 5:
      default:
        return "bg-[#F7F5F2] text-[#5A483E] border-[#E4DDD4]";
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Header with Institutional Seal & Realtime Neon PostgreSQL Connected Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E2D8] pb-6">
        <div>
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF4EE] text-[#8B3A0F] border border-[#E8D9CB]">
              Institutional Charter
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] font-medium text-[#2D5A3F] bg-[#F3F6F2] px-2.5 py-0.5 rounded border border-[#D4DEC9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A3F] animate-pulse" />
              <span>Realtime Neon PostgreSQL Connected</span>
            </div>
            {lastSynced && (
              <span className="text-[10px] font-mono text-[#8C7A6B]">
                Synced at {lastSynced}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2A1A10] tracking-tight mt-2 flex items-center space-x-3">
            <img src="/soptosur-logo.svg" alt="সপ্তসুর" className="h-8 w-auto object-contain" />
            <span>Constitutional Roster & Office Registry</span>
          </h1>
          <p className="text-xs text-[#6B584C] mt-1.5 max-w-3xl leading-relaxed">
            Official 5-tier constitutional directory governed by Articles 1–15. All offices are initialized in pure sovereign vacancy until officially inducted by the Faculty Advisor and General Assembly.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchMembers(true)}
            disabled={isRefreshing || isLoading}
            className="px-4 py-2 rounded-xl bg-white border border-[#E8E2D8] hover:border-[#D1C7BA] text-[#4A3B32] text-xs font-bold transition-all shadow-xs flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#8B3A0F] ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Status"}</span>
          </button>

          <Link
            href="/charter"
            className="px-4 py-2 rounded-xl bg-[#8B3A0F] hover:bg-[#732F0C] text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 shadow-[#8B3A0F]/20"
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>View Full Charter</span>
          </Link>
        </div>
      </div>

      {/* Sovereign Genesis Vacancy Banner */}
      {stats.appointed === 0 && (
        <div className="bg-[#FAF7F2] border border-[#E8DEC9] rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5 shadow-2xs">
          <Compass className="w-5 h-5 text-[#8B3A0F] mt-0.5 flex-shrink-0" />
          <div className="text-xs text-[#5A483E] space-y-1">
            <div className="font-bold text-[#2A1A10] text-sm flex items-center space-x-2">
              <span>Pure Sovereign Vacancy State (Genesis Protocol)</span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#EFE8DF] text-[#7A3015] border border-[#DDD3C5]">
                Zero Pre-Seeded Personas
              </span>
            </div>
            <p>
              In strict accordance with the updated Constitution, no placeholder identities, mock student IDs, or simulated emails are active. All {stats.vacant} constitutional leadership offices remain formally vacant until official induction under <strong>Article 8.1 (Founding Council)</strong> or <strong>Article 8.2 (Selection Panel & Secret Ballot)</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Roster Overview Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setSelectedTier("ALL")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedTier === "ALL"
              ? "bg-[#FAF4EE] border-[#D1B8A5] shadow-xs"
              : "bg-white border-[#E8E2D8] hover:border-[#D1C7BA] shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A685B]">
            All Offices
          </div>
          <div className="text-xl font-black text-[#2A1A10] mt-0.5">
            {stats.total}
          </div>
          <div className="text-[10px] text-[#8B3A0F] font-semibold mt-1">
            {stats.vacant} Vacant • {stats.appointed} Appointed
          </div>
        </button>

        <button
          onClick={() => setSelectedTier("1")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedTier === "1"
              ? "bg-[#F5EDEB] border-[#D8BCB5] shadow-xs"
              : "bg-white border-[#E8E2D8] hover:border-[#D1C7BA] shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A2C10]">
            Tier 1
          </div>
          <div className="text-xl font-black text-[#2A1A10] mt-0.5">
            {stats.t1}
          </div>
          <div className="text-[10px] text-[#7A685B] font-medium mt-1 truncate">Faculty Advisor</div>
        </button>

        <button
          onClick={() => setSelectedTier("2")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedTier === "2"
              ? "bg-[#FAF4EE] border-[#D1B8A5] shadow-xs"
              : "bg-white border-[#E8E2D8] hover:border-[#D1C7BA] shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#8B3A0F]">
            Tier 2
          </div>
          <div className="text-xl font-black text-[#2A1A10] mt-0.5">
            {stats.t2}
          </div>
          <div className="text-[10px] text-[#7A685B] font-medium mt-1 truncate">Club President</div>
        </button>

        <button
          onClick={() => setSelectedTier("3")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedTier === "3"
              ? "bg-[#F8F5EE] border-[#D6CBB4] shadow-xs"
              : "bg-white border-[#E8E2D8] hover:border-[#D1C7BA] shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#92541A]">
            Tier 3
          </div>
          <div className="text-xl font-black text-[#2A1A10] mt-0.5">
            {stats.t3}
          </div>
          <div className="text-[10px] text-[#7A685B] font-medium mt-1 truncate">Executive Board</div>
        </button>

        <button
          onClick={() => setSelectedTier("4")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedTier === "4"
              ? "bg-[#F3F6F2] border-[#C3D1B5] shadow-xs"
              : "bg-white border-[#E8E2D8] hover:border-[#D1C7BA] shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#2D5A3F]">
            Tier 4
          </div>
          <div className="text-xl font-black text-[#2A1A10] mt-0.5">
            {stats.t4}
          </div>
          <div className="text-[10px] text-[#7A685B] font-medium mt-1 truncate">Dept Heads</div>
        </button>

        <button
          onClick={() => setSelectedTier("5")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedTier === "5"
              ? "bg-[#F7F5F2] border-[#D4CDC4] shadow-xs"
              : "bg-white border-[#E8E2D8] hover:border-[#D1C7BA] shadow-2xs"
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#5A483E]">
            Tier 5
          </div>
          <div className="text-xl font-black text-[#2A1A10] mt-0.5">
            {stats.t5}
          </div>
          <div className="text-[10px] text-[#7A685B] font-medium mt-1 truncate">General Assembly</div>
        </button>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A8988B] absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search constitutional office, tier, department, or supervisory clause..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FBF9F5] border border-[#E8E2D8] rounded-xl text-xs text-[#2A1A10] placeholder-[#A8988B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B3A0F]/20 focus:border-[#8B3A0F] font-medium"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-[#F7F5F2] p-1 rounded-xl border border-[#E8E2D8]">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                viewMode === "grid"
                  ? "bg-white text-[#8B3A0F] shadow-xs"
                  : "text-[#6B584C] hover:text-[#2A1A10]"
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Offices Grid</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all ${
                viewMode === "table"
                  ? "bg-white text-[#8B3A0F] shadow-xs"
                  : "text-[#6B584C] hover:text-[#2A1A10]"
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Registry Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Member Display Section */}
      {isLoading ? (
        <div className="bg-white border border-[#E8E2D8] rounded-2xl p-12 text-center shadow-xs">
          <RefreshCw className="w-8 h-8 text-[#8B3A0F] animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#2A1A10] mt-3">Connecting to Neon PostgreSQL...</p>
          <p className="text-[11px] text-[#8C7A6B] mt-0.5">Fetching verified constitutional office registry</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-white border border-[#E8E2D8] rounded-2xl p-12 text-center shadow-xs">
          <Shield className="w-10 h-10 text-[#C9BFB5] mx-auto" />
          <p className="text-sm font-bold text-[#2A1A10] mt-3">No constitutional offices match your filter</p>
          <p className="text-xs text-[#8C7A6B] mt-1">Try clearing your search query or selecting &quot;All Offices&quot;.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedTier("ALL");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#FAF4EE] text-[#8B3A0F] border border-[#E8D9CB] text-xs font-bold hover:bg-[#F3E8DC] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => {
            return (
              <div
                key={member.id}
                className="bg-white border border-[#E8E2D8] hover:border-[#D1B8A5] rounded-2xl p-5 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top Row: Office Icon, Title & Tier Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px] rounded-xl overflow-hidden border border-[#E8E2D8] bg-[#FBF9F5] flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:border-[#8B3A0F] transition-colors p-2">
                        <img
                          src="/soptosur-logo.svg"
                          alt="Office Seal"
                          className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-[#2A1A10] group-hover:text-[#8B3A0F] transition-colors leading-tight truncate">
                          {member.roleTitle}
                        </h3>
                        <div className="flex items-center space-x-1.5 text-[11px] font-medium text-[#7A685B] mt-0.5">
                          <Building className="w-3.5 h-3.5 text-[#8B3A0F] flex-shrink-0" />
                          <span className="truncate">{member.departmentLabel}</span>
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

                  {/* Incumbent Occupant or Sovereign Vacancy Badge */}
                  <div className="mt-4 pt-3 border-t border-[#F2ECE4]">
                    {member.isVacant ? (
                      <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DEC9] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EFE8DF] text-[#7A3015] border border-[#DDD3C5]">
                            VACANT (পদ শূন্য)
                          </span>
                          <span className="text-[10px] font-mono text-[#8C7A6B]">
                            Awaiting Induction
                          </span>
                        </div>
                        <div className="text-[11px] text-[#5A483E] leading-relaxed">
                          <strong>Induction Requirement:</strong> {member.appointmentRequirement}
                        </div>
                        {member.constitutionalClause && (
                          <div className="text-[10px] font-mono text-[#8C7A6B] pt-1 border-t border-[#E8DEC9]/60 flex items-center space-x-1">
                            <ScrollText className="w-3 h-3 text-[#8B3A0F]" />
                            <span>Governed by {member.constitutionalClause}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-[#F3F6F2] border border-[#D4DEC9] space-y-1.5">
                        <div className="text-xs font-bold text-[#2A1A10] flex items-center justify-between">
                          <span>{member.legalName}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2D5A3F] text-white font-bold">
                            Appointed
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-[#5A483E]">
                          Student ID: {member.studentId}
                        </div>
                        <div className="text-[11px] font-mono text-[#5A483E]">
                          Official Email: {member.nsuEmail}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer: Supervisory Chain of Command */}
                <div className="pt-3 border-t border-[#F2ECE4] mt-2 flex items-center justify-between text-[11px] text-[#7A685B]">
                  <span className="truncate" title={`Reports to: ${member.supervisor}`}>
                    <strong>Reports to:</strong> {member.supervisor}
                  </span>
                  <span className="text-[10px] font-mono text-[#8B3A0F] font-semibold flex-shrink-0 ml-2">
                    Single-Tree RBAC
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DATA TABLE VIEW */
        <div className="bg-white border border-[#E8E2D8] rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E8E2D8] text-[11px] font-bold text-[#7A685B] uppercase tracking-wider">
                  <th className="py-3 px-4">Constitutional Office</th>
                  <th className="py-3 px-4">Tier</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Occupant Status</th>
                  <th className="py-3 px-4">Direct Supervisor</th>
                  <th className="py-3 px-4">Constitutional Authority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE4]">
                {filteredMembers.map((member) => {
                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-[#FAF4EE]/50 transition-colors"
                    >
                      {/* Office Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#E8E2D8] bg-[#FBF9F5] flex items-center justify-center flex-shrink-0 p-1">
                            <img src="/soptosur-logo.svg" alt="Office Seal" className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <div className="font-bold text-[#2A1A10] leading-tight">
                              {member.roleTitle}
                            </div>
                            <div className="text-[10px] text-[#8C7A6B]">
                              {member.isVacant ? "Vacancy Initialized" : `ID: ${member.studentId}`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tier */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getTierBadgeStyle(
                            member.tier
                          )}`}
                        >
                          Tier {member.tier}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="py-3 px-4 text-[#5A483E] font-medium">
                        {member.departmentLabel}
                      </td>

                      {/* Occupant Status */}
                      <td className="py-3 px-4">
                        {member.isVacant ? (
                          <span className="text-[10px] font-bold text-[#7A3015] bg-[#FAF4EE] px-2 py-0.5 rounded border border-[#E8D9CB] inline-flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-[#8B3A0F]" />
                            <span>VACANT (পদ শূন্য)</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#2D5A3F] bg-[#F3F6F2] px-2 py-0.5 rounded border border-[#D4DEC9] inline-flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 text-[#2D5A3F]" />
                            <span>{member.legalName}</span>
                          </span>
                        )}
                      </td>

                      {/* Direct Supervisor */}
                      <td className="py-3 px-4 text-[#5A483E] font-medium text-[11px]">
                        {member.supervisor}
                      </td>

                      {/* Constitutional Authority Clause */}
                      <td className="py-3 px-4 font-mono text-[10px] text-[#8C7A6B]">
                        {member.constitutionalClause || "Articles 1–15"}
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
