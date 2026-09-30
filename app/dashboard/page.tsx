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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-6 sm:p-8 shadow-md text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                Institutional Session Active
              </span>
              {currentUser.isActing && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold border border-amber-300 animate-pulse">
                  Acting Officer Status
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, {currentUser.legalName}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-medium max-w-2xl leading-relaxed">
              Assigned jurisdiction: <span className="text-white font-bold">{currentUser.roleTitle}</span> ({currentUser.department}) under the North South University Office of Student Affairs Charter.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href={primaryRoute.href}
              className="px-5 py-3 rounded-xl bg-white hover:bg-blue-50 text-blue-800 font-bold text-xs shadow-md flex items-center space-x-2 transition-all group"
            >
              <span>Launch {primaryRoute.title}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Real-time KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Total Treasury Liquidity</div>
          <div className="text-xl font-bold text-emerald-600 font-mono">166,500 BDT</div>
          <div className="text-[10px] text-slate-500 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>385k Inflow • 218.5k Outflow</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Pending Requisitions</div>
          <div className="text-xl font-bold text-amber-600 font-mono">
            {requisitions.filter((r) => r.status === "PENDING_APPROVAL").length} In Queue
          </div>
          <div className="text-[10px] text-slate-500">Tier 2 & Tier 3 authorizations</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Section 12 Repertoire</div>
          <div className="text-xl font-bold text-blue-600 font-mono">
            {repertoire.length} Arrangements
          </div>
          <div className="text-[10px] text-slate-500">Creative autonomy firewall locked</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-semibold text-slate-500">Active Petitions & Quorum</div>
          <div className="text-xl font-bold text-purple-600 font-mono">
            {petitions.filter((p) => p.status === "ACTIVE" || p.status === "THRESHOLD_REACHED").length} Active
          </div>
          <div className="text-[10px] text-slate-500">1 met 25% EGM threshold</div>
        </div>
      </div>

      {/* 5-Tier Single-Supervisor Architectural Blueprint */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>5-Tier Single-Supervisor Constitutional Blueprint</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every officer and member reports to exactly one direct supervisor. Dual-reporting is constitutionally barred.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Tier 1 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentUser.tier === 1
                ? "bg-purple-50 border-purple-300 shadow-sm"
                : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                Tier 1
              </span>
              <Shield className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Faculty Advisor</h3>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Dr. Tanvir Ahmed (OSA). Highest tribunal authority, unblinded whistleblower oversight, Tier 3 expenditure gate & audit certification.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-purple-700 font-semibold">
              Supervises: Tier 2 (President)
            </div>
          </div>

          {/* Tier 2 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentUser.tier === 2
                ? "bg-blue-50 border-blue-300 shadow-sm"
                : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                Tier 2
              </span>
              <Crown className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Club President</h3>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Farhan Rahman. Dual-signature banking partner, EB meeting convener, 15-day vacancy supervisor.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-blue-700 font-semibold">
              Reports to: Tier 1 • Supervises: Tier 3
            </div>
          </div>

          {/* Tier 3 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentUser.tier === 3
                ? "bg-cyan-50 border-cyan-300 shadow-sm"
                : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-200">
                Tier 3
              </span>
              <Briefcase className="w-4 h-4 text-cyan-600" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Executive Officers</h3>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              VP, General Secretary & Treasurer. Roster disputes, 15-day resignation queue, double-entry ledger & 72h cash freeze gates.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-cyan-700 font-semibold">
              Reports to: Tier 2 • Supervises: Tier 4
            </div>
          </div>

          {/* Tier 4 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentUser.tier === 4
                ? "bg-emerald-50 border-emerald-300 shadow-sm"
                : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                Tier 4
              </span>
              <Music2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Department Heads</h3>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Music, MM, Logistics & Publications. Section 12 creative firewall autonomy, 50% attendance cutoff enforcement & coordinator caps.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-emerald-700 font-semibold">
              Reports to: Tier 3 • Supervises: Tier 5
            </div>
          </div>

          {/* Tier 5 */}
          <div
            className={`p-4 rounded-xl border transition-all ${
              currentUser.tier === 5
                ? "bg-slate-100 border-slate-300 shadow-sm"
                : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-800 border border-slate-300">
                Tier 5
              </span>
              <Users className="w-4 h-4 text-slate-600" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">General Assembly</h3>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Active Members. Personal attendance meters, leave submission drawers, parliamentary voting booth & digital petitioning.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-semibold">
              Reports to: Tier 4 Dept Head
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
