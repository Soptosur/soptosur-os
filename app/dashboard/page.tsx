"use client";

import React from "react";
import Link from "next/link";
import { useGovernance } from "@/context/GovernanceContext";
import {
  Shield,
  Crown,
  Briefcase,
  Music2,
  Users,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Building,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { currentUser, requisitions, visibleDossiers, repertoire, petitions } = useGovernance();

  // Primary route for current user
  const getPrimaryConsoleRoute = () => {
    switch (currentUser?.tier ?? 5) {
      case 1:
        return { href: "/dashboard/advisor", title: "Faculty Advisor Desk" };
      case 2:
        return { href: "/dashboard/president", title: "President Executive Suite" };
      case 3:
        return { href: "/dashboard/executive", title: "Secretariat & Treasury Desks" };
      case 4:
        return { href: "/dashboard/departments", title: "Department Workspaces" };
      case 5:
      default:
        return { href: "/dashboard/members", title: "Constitutional Member Directory" };
    }
  };

  const primaryRoute = getPrimaryConsoleRoute();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#8B3A0F] to-[#5C2307] p-6 sm:p-8 shadow-sm text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                Soptosur Governance OS
              </span>
              {currentUser?.isActing && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold border border-amber-300 animate-pulse">
                  Acting Officer Status
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {currentUser?.legalName || "Institutional Observer"}
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 font-medium max-w-2xl leading-relaxed">
              Constitutional System Status:{" "}
              <span className="text-white font-bold">100% Vacant State Active</span>. Operating under the North South University Office of Student Affairs (OSA) Charter.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href={primaryRoute.href}
              className="px-5 py-3 rounded-xl bg-white hover:bg-[#FAF4EE] text-[#8B3A0F] font-bold text-xs shadow-md flex items-center space-x-2 transition-all group"
            >
              <span>Launch {primaryRoute.title}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Genesis Vacancy State Alert */}
      <div className="p-4 rounded-2xl bg-[#FAF4EE] border border-[#E0D2C4] flex items-start space-x-3.5 shadow-2xs">
        <AlertCircle className="w-5 h-5 text-[#8B3A0F] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#5A4D41] space-y-1">
          <div className="font-bold text-[#2A1A10]">
            Genesis Constitutional State (সকল পদ শূন্য - Official Vacant Roster)
          </div>
          <p className="leading-relaxed">
            Per the new official constitution, all previous mock personas have been permanently purged from the database. All 10 permanent constitutional offices (Tier 1 Advisor, Tier 2 President, Tier 3 VP/GS/Treasurer, Tier 4 Dept Heads) remain in a pure VACANT state until officially appointed and inducted by NSU OSA.
          </p>
        </div>
      </div>

      {/* Real-time KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E8E2D8] shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-[#7A6A58]">Constitutional Offices</div>
          <div className="text-xl font-bold text-[#8B3A0F] font-mono">10 / 10</div>
          <div className="text-[10px] text-[#7A6A58] flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>100% Vacant • Ready for Induction</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E2D8] shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-[#7A6A58]">Treasury Liquidity</div>
          <div className="text-xl font-bold text-[#2D5A3F] font-mono">0.00 BDT</div>
          <div className="text-[10px] text-[#7A6A58]">Bank mandate counter-signature active</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E2D8] shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-[#7A6A58]">Section 12 Creative Studio</div>
          <div className="text-xl font-bold text-[#8B3A0F] font-mono">
            {repertoire.length} Arrangements
          </div>
          <div className="text-[10px] text-[#7A6A58]">Section 12 firewall locked</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E8E2D8] shadow-2xs space-y-1">
          <div className="text-[11px] font-semibold text-[#7A6A58]">Active Petitions & Quorum</div>
          <div className="text-xl font-bold text-[#2A1A10] font-mono">
            {petitions.filter((p) => p.status === "ACTIVE" || p.status === "THRESHOLD_REACHED").length} Active
          </div>
          <div className="text-[10px] text-[#7A6A58]">Article 7 Rounding-Up rule applied</div>
        </div>
      </div>

      {/* 5-Tier Single-Supervisor Architectural Blueprint */}
      <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 space-y-6 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-[#2A1A10] flex items-center space-x-2">
            <Shield className="w-5 h-5 text-[#8B3A0F]" />
            <span>5-Tier Single-Supervisor Constitutional Blueprint</span>
          </h2>
          <p className="text-xs text-[#7A6A58] mt-0.5">
            Every officer and member reports to exactly one direct supervisor. Dual-reporting is constitutionally barred.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Tier 1 */}
          <div className="p-4 rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#8B3A0F]/10 text-[#8B3A0F] border border-[#8B3A0F]/20">
                Tier 1
              </span>
              <Shield className="w-4 h-4 text-[#8B3A0F]" />
            </div>
            <h3 className="text-xs font-bold text-[#2A1A10]">Faculty Advisor</h3>
            <p className="text-[11px] text-[#7A6A58] leading-relaxed">
              VACANT (পদ শূন্য). Unblinded tribunal oversight, Tier 3 expenditure counter-signature, IT recovery & audit certification.
            </p>
            <div className="pt-2 border-t border-[#E8E2D8] text-[10px] text-[#8B3A0F] font-semibold">
              Supervises: Tier 2 (President)
            </div>
          </div>

          {/* Tier 2 */}
          <div className="p-4 rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#2A1A10]/10 text-[#2A1A10] border border-[#2A1A10]/20">
                Tier 2
              </span>
              <Crown className="w-4 h-4 text-[#8B3A0F]" />
            </div>
            <h3 className="text-xs font-bold text-[#2A1A10]">Club President</h3>
            <p className="text-[11px] text-[#7A6A58] leading-relaxed">
              VACANT (পদ শূন্য). Dual-signature banking partner, EB meeting convener, 15-day vacancy supervisor.
            </p>
            <div className="pt-2 border-t border-[#E8E2D8] text-[10px] text-[#8B3A0F] font-semibold">
              Reports to: Tier 1 • Supervises: Tier 3
            </div>
          </div>

          {/* Tier 3 */}
          <div className="p-4 rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                Tier 3
              </span>
              <Briefcase className="w-4 h-4 text-amber-800" />
            </div>
            <h3 className="text-xs font-bold text-[#2A1A10]">Executive Officers</h3>
            <p className="text-[11px] text-[#7A6A58] leading-relaxed">
              VACANT (3 Offices: VP, General Secretary, Treasurer). Roster disputes, Annexure 'খ' counter-signatures, 72h cash advance locks.
            </p>
            <div className="pt-2 border-t border-[#E8E2D8] text-[10px] text-[#8B3A0F] font-semibold">
              Reports to: Tier 2 • Supervises: Tier 4
            </div>
          </div>

          {/* Tier 4 */}
          <div className="p-4 rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Tier 4
              </span>
              <Music2 className="w-4 h-4 text-emerald-700" />
            </div>
            <h3 className="text-xs font-bold text-[#2A1A10]">Department Heads</h3>
            <p className="text-[11px] text-[#7A6A58] leading-relaxed">
              VACANT (5 Offices: Music, Logistics, Media, MM, Sponsorship). Section 12 creative firewall, Gate Pass 'ক', 50% attendance cutoff.
            </p>
            <div className="pt-2 border-t border-[#E8E2D8] text-[10px] text-[#8B3A0F] font-semibold">
              Reports to: Tier 3 • Supervises: Tier 5
            </div>
          </div>

          {/* Tier 5 */}
          <div className="p-4 rounded-xl border border-[#E8E2D8] bg-[#FAF7F2] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EFE9DF] text-[#5A4D41] border border-[#E0D7C9]">
                Tier 5
              </span>
              <Users className="w-4 h-4 text-[#5A4D41]" />
            </div>
            <h3 className="text-xs font-bold text-[#2A1A10]">General Assembly</h3>
            <p className="text-[11px] text-[#7A6A58] leading-relaxed">
              Coordinators & Active Members. Personal attendance meters, leave submission, parliamentary voting booth & digital petitions.
            </p>
            <div className="pt-2 border-t border-[#E8E2D8] text-[10px] text-[#7A6A58] font-semibold">
              Reports to: Tier 4 Dept Head
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
