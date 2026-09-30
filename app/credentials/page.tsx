"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  Shield,
  ArrowLeft,
  Key,
  Mail,
  AlertCircle,
  Building,
  ScrollText,
} from "lucide-react";

interface ConstitutionalOfficeInfo {
  tier: number;
  tierName: string;
  role: string;
  roleDescription: string;
  status: string;
  officialEmailPattern: string;
  supervisor: string;
  clearanceRequired: string;
  permittedRoute: string;
}

const CONSTITUTIONAL_OFFICES: ConstitutionalOfficeInfo[] = [
  {
    tier: 1,
    tierName: "Tier 1: Faculty Advisor",
    role: "Faculty Advisor",
    roleDescription: "Highest Tribunal Authority & Unblinded Whistleblower Oversight",
    status: "VACANT (পদ শূন্য)",
    officialEmailPattern: "advisor@northsouth.edu",
    supervisor: "North South University Administration (OSA)",
    clearanceRequired: "OSA Appointment & University Faculty Status",
    permittedRoute: "/dashboard/advisor",
  },
  {
    tier: 2,
    tierName: "Tier 2: Club President",
    role: "Club President",
    roleDescription: "Executive Chief & Dual-Signature Banking Custodian",
    status: "VACANT (পদ শূন্য)",
    officialEmailPattern: "president@northsouth.edu",
    supervisor: "Faculty Advisor (Tier 1)",
    clearanceRequired: "Article 8 Election / Selection Slate Approval",
    permittedRoute: "/dashboard/president",
  },
  {
    tier: 3,
    tierName: "Tier 3: Executive Board",
    role: "Vice President",
    roleDescription: "Operations & Departmental Oversight (Music & Logistics)",
    status: "VACANT (পদ শূন্য)",
    officialEmailPattern: "vp@northsouth.edu",
    supervisor: "Club President (Tier 2)",
    clearanceRequired: "Article 8 General Assembly Election",
    permittedRoute: "/dashboard/executive",
  },
  {
    tier: 3,
    tierName: "Tier 3: Executive Board",
    role: "General Secretary",
    roleDescription: "Secretariat, Minutes Custodian & Parliamentary Protocol",
    status: "VACANT (পদ শূন্য)",
    officialEmailPattern: "gs@northsouth.edu",
    supervisor: "Club President (Tier 2)",
    clearanceRequired: "Article 8 General Assembly Election",
    permittedRoute: "/dashboard/executive",
  },
  {
    tier: 3,
    tierName: "Tier 3: Executive Board",
    role: "Treasurer",
    roleDescription: "Financial Custodian, Requisitions & Double-Entry Ledger",
    status: "VACANT (পদ শূন্য)",
    officialEmailPattern: "treasurer@northsouth.edu",
    supervisor: "Club President (Tier 2)",
    clearanceRequired: "Article 8 General Assembly Election",
    permittedRoute: "/dashboard/executive",
  },
  {
    tier: 4,
    tierName: "Tier 4: Department Head",
    role: "Music & Performance Head",
    roleDescription: "Section 12 Creative Autonomy & Repertoire Lead",
    status: "VACANT (পদ শূন্য)",
    officialEmailPattern: "music.head@northsouth.edu",
    supervisor: "Vice President (Tier 3)",
    clearanceRequired: "Executive Board 3-Vote Majority",
    permittedRoute: "/dashboard/departments",
  },
  {
    tier: 4,
    tierName: "Tier 4: Department Head",
    role: "Event & Logistics Head",
    roleDescription: "Logistics Inventory, Gate Pass 'ক' & Stage Management",
    status: "VACANT (পদ শূন্য)",
    officialEmailPattern: "logistics.head@northsouth.edu",
    supervisor: "Vice President (Tier 3)",
    clearanceRequired: "Executive Board 3-Vote Majority",
    permittedRoute: "/dashboard/departments",
  },
  {
    tier: 4,
    tierName: "Tier 4: Department Head",
    role: "Media & Design Head",
    roleDescription: "Social Media Dual Admin, Graphics & Brand Custody",
    status: "VACANT (পদ শূন্য)",
    officialEmailPattern: "media.head@northsouth.edu",
    supervisor: "General Secretary (Tier 3)",
    clearanceRequired: "Executive Board 3-Vote Majority",
    permittedRoute: "/dashboard/departments",
  },
  {
    tier: 4,
    tierName: "Tier 4: Department Head",
    role: "Member Management & Discipline Head",
    roleDescription: "Attendance Tracking, 50% Cutoff & Roster Management",
    status: "VACANT (পদ শূন্য)",
    officialEmailPattern: "mm.head@northsouth.edu",
    supervisor: "General Secretary (Tier 3)",
    clearanceRequired: "Executive Board 3-Vote Majority",
    permittedRoute: "/dashboard/departments",
  },
  {
    tier: 4,
    tierName: "Tier 4: Department Head",
    role: "Sponsorship & Partnership Head",
    roleDescription: "Fundraising, MoU Agreements & In-Kind Register 'গ'",
    status: "VACANT (পদ শূন্য)",
    officialEmailPattern: "sponsorship.head@northsouth.edu",
    supervisor: "Treasurer (Tier 3)",
    clearanceRequired: "Executive Board 3-Vote Majority",
    permittedRoute: "/dashboard/departments",
  },
];

export default function CredentialsPortalPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2A1A10] flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-[#E8E2D8] bg-[#FDFBF7]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-white border border-[#E8E2D8] text-[#5A4D41] hover:text-[#2A1A10] hover:bg-[#F5F1E8] transition-colors flex items-center space-x-1.5 text-xs font-semibold shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#8B3A0F]" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="h-5 w-px bg-[#E8E2D8] hidden sm:block" />
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#8B3A0F]/10 border border-[#8B3A0F]/20 flex items-center justify-center p-1">
                <img src="/soptosur-logo.svg" alt="Soptosur" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-[#2A1A10] text-sm sm:text-base tracking-tight">
                Soptosur Constitutional Offices & Induction Roster
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/charter"
              className="flex items-center space-x-1.5 text-xs font-semibold text-[#8B3A0F] hover:text-[#682907] bg-[#FAF4EE] hover:bg-[#F5ECE2] px-3 py-1.5 rounded-xl border border-[#E0D2C4] transition-colors shadow-2xs"
            >
              <ScrollText className="w-3.5 h-3.5 text-[#8B3A0F]" />
              <span>View Charter</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Policy Notice */}
        <section className="p-6 rounded-2xl bg-[#FAF4EE] border border-[#E0D2C4] space-y-2 shadow-2xs">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#8B3A0F]">
            <AlertCircle className="w-4 h-4" />
            <span>Constitutional Genesis Vacancy Protocol (সকল পদ শূন্য)</span>
          </div>
          <p className="text-xs text-[#5A4D41] leading-relaxed">
            Per the updated Soptosur Constitution under North South University Office of Student Affairs (OSA), all mock personas and placeholder credentials have been permanently deleted from the database. Every office listed below is currently <strong>VACANT (পদ শূন্য)</strong>. Induction into any post requires official appointment or election pursuant to Article 8, followed by Google SSO login with an authorized <code>@northsouth.edu</code> university account.
          </p>
        </section>

        {/* 10 Constitutional Offices Table */}
        <section className="bg-white border border-[#E8E2D8] rounded-2xl shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#2A1A10] flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[#8B3A0F]" />
                <span>10 Permanent Constitutional Offices</span>
              </h2>
              <p className="text-xs text-[#7A6A58] mt-0.5">
                Hierarchical RBAC mapping under the Article 1 Single-Supervisor Invariant.
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 w-fit">
              100% Vacant State
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#5A4D41] border-b border-[#E8E2D8] font-semibold">
                <tr>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Constitutional Office</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Direct Supervisor</th>
                  <th className="px-4 py-3">Official Email Identifier</th>
                  <th className="px-4 py-3">Appointment Mandate</th>
                  <th className="px-4 py-3 text-right">Console</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8] text-[#2A1A10]">
                {CONSTITUTIONAL_OFFICES.map((office, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF7F2]/80 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-[#8B3A0F] font-mono">
                        Tier {office.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#2A1A10]">{office.role}</div>
                      <div className="text-[10px] text-[#7A6A58]">{office.roleDescription}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF4EE] text-[#8B3A0F] border border-[#E0D2C4]">
                        {office.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#5A4D41] font-medium">
                      {office.supervisor}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#8B3A0F]">
                      <div className="flex items-center space-x-1.5">
                        <span>{office.officialEmailPattern}</span>
                        <button
                          onClick={() => copyToClipboard(office.officialEmailPattern, office.role)}
                          className="p-1 rounded text-[#A89A88] hover:text-[#8B3A0F] transition-colors"
                          title="Copy email"
                        >
                          {copiedKey === office.role ? (
                            <Check className="w-3.5 h-3.5 text-[#2D5A3F]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#7A6A58] text-[11px]">
                      {office.clearanceRequired}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={office.permittedRoute}
                        className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[#8B3A0F] hover:text-[#682907] underline"
                      >
                        <span>Workspace</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
