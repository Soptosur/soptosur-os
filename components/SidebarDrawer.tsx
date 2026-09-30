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
  ScrollText,
  UserCircle,
  Contact,
  Sparkles,
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

  const userTier = currentUser?.tier ?? 5;

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
      description: "Articles 1–15 & Annexures ক, খ, গ",
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
    <aside className="w-64 flex-shrink-0 bg-[#FAF7F2] border-r border-[#E8E2D8] p-4 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 hidden md:flex">
      <div className="space-y-6">
        <div>
          <h3 className="text-[11px] font-bold text-[#8B3A0F] uppercase tracking-wider px-2">
            Governance Navigation
          </h3>
          <p className="text-[10px] text-[#7A6A58] px-2 mt-0.5">
            Single-Supervisor Hierarchical RBAC
          </p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const hasAccess = userTier <= item.tierRequired;
            const isActive = pathname === item.href;
            const Icon = item.icon;

            if (!hasAccess) {
              return (
                <div
                  key={item.href}
                  className="px-3 py-2.5 rounded-xl border border-[#E8E2D8]/60 bg-[#F5F1E8]/50 text-[#8C7E72] flex items-center justify-between cursor-not-allowed opacity-60"
                  title={`Requires Tier ${item.tierRequired} clearance. Active: Tier ${userTier}`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-[#A89A88]" />
                    <div>
                      <div className="text-xs font-semibold text-[#7A6A58] flex items-center space-x-1.5">
                        <span>{item.title}</span>
                      </div>
                      <div className="text-[10px] text-[#A89A88] truncate">{item.description}</div>
                    </div>
                  </div>
                  <Lock className="w-3.5 h-3.5 text-[#A89A88]" />
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 flex items-center justify-between ${
                  isActive
                    ? "bg-[#8B3A0F]/10 border-[#8B3A0F]/20 text-[#8B3A0F] shadow-2xs font-bold"
                    : "border-transparent text-[#5A4D41] hover:bg-[#F2ECE1] hover:text-[#2A1A10] hover:border-[#E8E2D8]"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-[#8B3A0F]" : "text-[#7A6A58] group-hover:text-[#8B3A0F]"
                    }`}
                  />
                  <div className="truncate">
                    <div
                      className={`truncate ${
                        isActive
                          ? "font-bold text-[#8B3A0F]"
                          : "font-semibold text-[#2A1A10] group-hover:text-[#8B3A0F]"
                      }`}
                    >
                      {item.title}
                    </div>
                    <div
                      className={`text-[10px] truncate ${
                        isActive ? "text-[#8B3A0F]/80" : "text-[#7A6A58]"
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ml-1 ${
                      isActive
                        ? "bg-[#8B3A0F]/20 text-[#8B3A0F] border-[#8B3A0F]/30"
                        : "bg-[#EFE9DF] text-[#7A6A58] border-[#E0D7C9]"
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
      <div className="p-3 rounded-xl bg-[#F5F1E8] border border-[#E8E2D8] text-[11px] text-[#5A4D41] space-y-2">
        <div className="flex items-center space-x-2 text-[#2A1A10] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#8B3A0F]" />
          <span>OSA Constitution 2026</span>
        </div>
        <p className="text-[10px] text-[#7A6A58] leading-relaxed">
          Operating under NSU Office of Student Affairs strict single-supervisor invariants.
        </p>
        <div className="pt-1 flex items-center justify-between text-[10px] text-[#8C7E72] font-mono">
          <span>v1.0.0-PROD</span>
          <span className="text-[#2D5A3F] font-bold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A3F] inline-block" />
            <span>Vercel Edge</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
