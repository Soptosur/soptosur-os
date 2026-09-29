"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGovernance } from "@/context/GovernanceContext";
import {
  ShieldAlert,
  Crown,
  Briefcase,
  Music2,
  Users,
  Compass,
  Lock,
  ChevronRight,
  Sparkles,
  FileText,
  ScrollText,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  tierRequired: number;
  icon: React.ElementType;
  description: string;
  badge?: string;
}

export function SidebarDrawer() {
  const pathname = usePathname();
  const { currentUser } = useGovernance();

  const navItems: NavItem[] = [
    {
      title: "Chain of Command",
      href: "/dashboard",
      tierRequired: 5, // All tiers can view constitutional hierarchy
      icon: Compass,
      description: "Institutional 5-Tier Org Blueprint",
    },
    {
      title: "Official Charter (গঠনতন্ত্র)",
      href: "/charter",
      tierRequired: 5, // All tiers can read the constitution
      icon: ScrollText,
      description: "Articles 1–14 Full Constitution",
    },
    {
      title: "Faculty Advisor Desk",
      href: "/dashboard/advisor",
      tierRequired: 1,
      icon: ShieldAlert,
      description: "Whistleblower & Audit Certification",
      badge: "Tier 1",
    },
    {
      title: "President Executive Suite",
      href: "/dashboard/president",
      tierRequired: 2,
      icon: Crown,
      description: "Dual-Signature Banking & Quorum",
      badge: "Tier 2",
    },
    {
      title: "Secretariat & Treasury",
      href: "/dashboard/executive",
      tierRequired: 3,
      icon: Briefcase,
      description: "Ledger, 72h Cash Bar & Disputes",
      badge: "Tier 3",
    },
    {
      title: "Department Workspaces",
      href: "/dashboard/departments",
      tierRequired: 4,
      icon: Music2,
      description: "Section 12 Studio & 50% Cutoff",
      badge: "Tier 4",
    },
    {
      title: "Parliamentary Booth",
      href: "/dashboard/member",
      tierRequired: 5,
      icon: Users,
      description: "Attendance, Floor Quorum & Petitions",
      badge: "Tier 5",
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-950/70 border-r border-slate-800/80 p-4 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 hidden md:flex">
      <div className="space-y-6">
        <div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
            Governance Navigation
          </h3>
          <p className="text-[10px] text-slate-500 px-2 mt-0.5">
            Single-Supervisor Hierarchical RBAC
          </p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const hasAccess = currentUser.tier <= item.tierRequired;
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (!hasAccess) {
              return (
                <div
                  key={item.href}
                  className="px-3 py-2.5 rounded-xl border border-slate-900/50 bg-slate-900/30 text-slate-600 flex items-center justify-between cursor-not-allowed opacity-60"
                  title={`Requires Tier ${item.tierRequired} clearance. Active: Tier ${currentUser.tier}`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-slate-700" />
                    <div>
                      <div className="text-xs font-semibold text-slate-600 flex items-center space-x-1.5">
                        <span>{item.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-700 truncate">{item.description}</div>
                    </div>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-slate-700" />
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 flex items-center justify-between ${
                  isActive
                    ? "bg-blue-600/15 border-blue-500/40 text-blue-200 shadow-sm shadow-blue-950/40"
                    : "border-transparent text-slate-300 hover:bg-slate-900/80 hover:text-slate-100 hover:border-slate-800"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-blue-400" : "text-slate-400 group-hover:text-blue-300"
                    }`}
                  />
                  <div className="truncate">
                    <div className="font-semibold text-slate-200 truncate group-hover:text-white">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{item.description}</div>
                  </div>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ml-1 ${
                      isActive
                        ? "bg-blue-500/20 text-blue-300 border-blue-400/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Institutional Footer Pill */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-center space-x-2 text-slate-300 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>OSA Constitution 2026</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Operating under NSU Office of Student Affairs strict chain-of-command invariants.
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>v1.0.0-PROD</span>
          <span className="text-emerald-400 font-bold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            <span>Vercel Edge</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
