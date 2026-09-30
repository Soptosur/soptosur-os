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
  ScrollText,
  UserCircle,
  Contact,
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
      tierRequired: 5,
      icon: Compass,
      description: "Institutional 5-Tier Org Blueprint",
    },
    {
      title: "Member Directory & Roster",
      href: "/dashboard/members",
      tierRequired: 5,
      icon: Contact,
      description: "Tier 1–5 Realtime Database List",
      badge: "Realtime",
    },
    {
      title: "Official Charter (Constitution)",
      href: "/charter",
      tierRequired: 5,
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
    {
      title: "My Profile & Identity",
      href: "/dashboard/profile",
      tierRequired: 5,
      icon: UserCircle,
      description: "Edit Photo, ID, Email & Details",
      badge: "Edit",
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white/80 border-r border-slate-200/90 p-4 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 hidden md:flex backdrop-blur-md">
      <div className="space-y-6">
        <div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2">
            Governance Navigation
          </h3>
          <p className="text-[10px] text-slate-400 px-2 mt-0.5">
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
                  className="px-3 py-2.5 rounded-xl border border-slate-200/60 bg-slate-100/50 text-slate-400 flex items-center justify-between cursor-not-allowed opacity-60"
                  title={`Requires Tier ${item.tierRequired} clearance. Active: Tier ${currentUser.tier}`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-500 flex items-center space-x-1.5">
                        <span>{item.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{item.description}</div>
                    </div>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 flex items-center justify-between ${
                  isActive
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-xs font-semibold"
                    : "border-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"
                    }`}
                  />
                  <div className="truncate">
                    <div
                      className={`truncate ${
                        isActive ? "font-bold text-blue-900" : "font-semibold text-slate-700 group-hover:text-slate-900"
                      }`}
                    >
                      {item.title}
                    </div>
                    <div className={`text-[10px] truncate ${isActive ? "text-blue-600/80" : "text-slate-400"}`}>
                      {item.description}
                    </div>
                  </div>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ml-1 ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
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
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-2">
        <div className="flex items-center space-x-2 text-slate-800 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>OSA Constitution 2026</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Operating under NSU Office of Student Affairs strict chain-of-command invariants.
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>v1.0.0-PROD</span>
          <span className="text-emerald-600 font-bold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span>Vercel Edge</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
