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
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  Building,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { currentUser, requisitions, visibleDossiers, repertoire, petitions } = useGovernance();

  // Primary route for current user
  const getPrimaryConsoleRoute = () => {
    switch (currentUser.tier) {
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
        return { href: "/dashboard/member", title: "Parliamentary & Member Booth" };
    }
  };

  const primaryRoute = getPrimaryConsoleRoute();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/60">
                Institutional Session Active
              </span>
              {currentUser.isActing && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  Acting Officer Status
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {currentUser.legalName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
              Assigned jurisdiction: <span className="text-blue-300 font-semibold">{currentUser.roleTitle}</span> ({currentUser.department}) under the North South University Office of Student Affairs Charter.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href={primaryRoute.href}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-950/60 flex items-center space-x-2 transition-all group"
            >
              <span>Launch {primaryRoute.title}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Real-time KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-medium text-slate-400">Total Treasury Liquidity</div>
          <div className="text-xl font-bold text-emerald-400 font-mono">166,500 BDT</div>
          <div className="text-[10px] text-slate-500 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>385k Inflow • 218.5k Outflow</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-medium text-slate-400">Pending Requisitions</div>
          <div className="text-xl font-bold text-amber-400 font-mono">
            {requisitions.filter((r) => r.status === "PENDING_APPROVAL").length} In Queue
          </div>
          <div className="text-[10px] text-slate-500">Tier 2 & Tier 3 authorizations</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-medium text-slate-400">Section 12 Repertoire</div>
          <div className="text-xl font-bold text-blue-400 font-mono">
            {repertoire.length} Arrangements
          </div>
          <div className="text-[10px] text-slate-500">Creative autonomy firewall locked</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="text-[11px] font-medium text-slate-400">Active Petitions & Quorum</div>
          <div className="text-xl font-bold text-purple-400 font-mono">
            {petitions.filter((p) => p.status === "ACTIVE" || p.status === "THRESHOLD_REACHED").length} Active
          </div>
          <div className="text-[10px] text-slate-500">1 met 25% EGM threshold</div>
        </div>
      </div>

      {/* 5-Tier Single-Supervisor Architectural Blueprint */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span>5-Tier Single-Supervisor Constitutional Blueprint</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Every officer and member reports to exactly one direct supervisor. Dual-reporting is constitutionally barred.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Tier 1 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentUser.tier === 1
                ? "bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-950/30"
                : "bg-slate-950/70 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-900/50 text-purple-300">
                Tier 1
              </span>
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-xs font-bold text-white">Faculty Advisor</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Dr. Tanvir Ahmed (OSA). Highest tribunal authority, unblinded whistleblower oversight, Tier 3 expenditure gate & audit certification.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-purple-300 font-medium">
              Supervises: Tier 2 (President)
            </div>
          </div>

          {/* Tier 2 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentUser.tier === 2
                ? "bg-blue-950/40 border-blue-500/60 shadow-lg shadow-blue-950/30"
                : "bg-slate-950/70 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-900/50 text-blue-300">
                Tier 2
              </span>
              <Crown className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-xs font-bold text-white">Club President</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Farhan Rahman. Dual-signature banking partner, EB meeting convener, 15-day vacancy supervisor.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-blue-300 font-medium">
              Reports to: Tier 1 • Supervises: Tier 3
            </div>
          </div>

          {/* Tier 3 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentUser.tier === 3
                ? "bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/30"
                : "bg-slate-950/70 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-900/50 text-cyan-300">
                Tier 3
              </span>
              <Briefcase className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-xs font-bold text-white">Executive Officers</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              VP, General Secretary & Treasurer. Roster disputes, 15-day resignation queue, double-entry ledger & 72h cash freeze gates.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-cyan-300 font-medium">
              Reports to: Tier 2 • Supervises: Tier 4
            </div>
          </div>

          {/* Tier 4 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentUser.tier === 4
                ? "bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/30"
                : "bg-slate-950/70 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300">
                Tier 4
              </span>
              <Music2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-xs font-bold text-white">Department Heads</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Music, MM, Logistics & Publications. Section 12 creative firewall autonomy, 50% attendance cutoff enforcement & coordinator caps.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-emerald-300 font-medium">
              Reports to: Tier 3 • Supervises: Tier 5
            </div>
          </div>

          {/* Tier 5 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentUser.tier === 5
                ? "bg-slate-800/60 border-slate-500/60 shadow-lg shadow-slate-950/30"
                : "bg-slate-950/70 border-slate-800"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Tier 5
              </span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-xs font-bold text-white">General Assembly</h3>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Active Members. Personal attendance meters, leave submission drawers, parliamentary voting booth & digital petitioning.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-medium">
              Reports to: Tier 4 Dept Head
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
