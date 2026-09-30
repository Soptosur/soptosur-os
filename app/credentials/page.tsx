"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  Printer,
  Shield,
  ExternalLink,
  ArrowLeft,
  Key,
  Mail,
  UserCheck,
  Sparkles,
} from "lucide-react";

interface CredentialRow {
  tier: number;
  tierName: string;
  role: string;
  roleDescription: string;
  name: string;
  studentId: string;
  aliasEmail: string;
  officialEmail: string;
  password: string;
  permittedRoute: string;
}

const CREDENTIALS: CredentialRow[] = [
  {
    tier: 1,
    tierName: "Tier 1: Faculty Advisor",
    role: "Faculty Advisor",
    roleDescription: "Faculty Advisor & Unblinded Tribunal Lead",
    name: "Dr. Tanvir Ahmed",
    studentId: "FAC-00109",
    aliasEmail: "advisor@northsouth.edu",
    officialEmail: "tanvir.ahmed@northsouth.edu",
    password: "soptosur2026",
    permittedRoute: "/dashboard/advisor",
  },
  {
    tier: 2,
    tierName: "Tier 2: Club President",
    role: "Club President",
    roleDescription: "Club President & Chief Executive (Dual-Signature Banking)",
    name: "Abrar Chowdhury",
    studentId: "2011234042",
    aliasEmail: "president@northsouth.edu",
    officialEmail: "abrar.chowdhury@northsouth.edu",
    password: "soptosur2026",
    permittedRoute: "/dashboard/president",
  },
  {
    tier: 3,
    tierName: "Tier 3: Executive Board",
    role: "General Secretary",
    roleDescription: "General Secretary & Parliamentary Custodian",
    name: "Samira Hossain",
    studentId: "2031456042",
    aliasEmail: "gs@northsouth.edu",
    officialEmail: "samira.hossain@northsouth.edu",
    password: "soptosur2026",
    permittedRoute: "/dashboard/executive",
  },
  {
    tier: 3,
    tierName: "Tier 3: Executive Board",
    role: "Treasurer",
    roleDescription: "Treasurer & Financial Custodian (Petty Cash 72h Gate)",
    name: "Farhan Kabir",
    studentId: "2011567042",
    aliasEmail: "treasurer@northsouth.edu",
    officialEmail: "farhan.kabir@northsouth.edu",
    password: "soptosur2026",
    permittedRoute: "/dashboard/executive",
  },
  {
    tier: 3,
    tierName: "Tier 3: Executive Board",
    role: "Vice President",
    roleDescription: "Vice President & Operations Oversight",
    name: "Nabil Rahman",
    studentId: "2021345042",
    aliasEmail: "vp@northsouth.edu",
    officialEmail: "nabil.rahman@northsouth.edu",
    password: "soptosur2026",
    permittedRoute: "/dashboard/executive",
  },
  {
    tier: 4,
    tierName: "Tier 4: Department Head",
    role: "Music & Performance Head",
    roleDescription: "Section 12 Creative Firewall Lead (Vocal & Composition)",
    name: "Zafir Ahsan",
    studentId: "2111678042",
    aliasEmail: "music.head@northsouth.edu",
    officialEmail: "zafir.ahsan@northsouth.edu",
    password: "soptosur2026",
    permittedRoute: "/dashboard/departments",
  },
  {
    tier: 4,
    tierName: "Tier 4: Department Head",
    role: "Member Management Head",
    roleDescription: "Member Management & 50% Attendance Discipline Lead",
    name: "Tasnim Haque",
    studentId: "2111901042",
    aliasEmail: "mm.head@northsouth.edu",
    officialEmail: "tasnim.haque@northsouth.edu",
    password: "soptosur2026",
    permittedRoute: "/dashboard/departments",
  },
  {
    tier: 4,
    tierName: "Tier 4: Department Head",
    role: "Event & Logistics Head",
    roleDescription: "Event & Logistics Operations Lead",
    name: "Mehnaz Islam",
    studentId: "2121789042",
    aliasEmail: "event.head@northsouth.edu",
    officialEmail: "mehnaz.islam@northsouth.edu",
    password: "soptosur2026",
    permittedRoute: "/dashboard/departments",
  },
  {
    tier: 4,
    tierName: "Tier 4: Department Head",
    role: "Media & Design Head",
    roleDescription: "Media, Branding & Design Production Lead",
    name: "Rayan Siddiqui",
    studentId: "2131890042",
    aliasEmail: "media.head@northsouth.edu",
    officialEmail: "rayan.siddiqui@northsouth.edu",
    password: "soptosur2026",
    permittedRoute: "/dashboard/departments",
  },
  {
    tier: 4,
    tierName: "Tier 4: Department Head",
    role: "Sponsorship Head",
    roleDescription: "Sponsorship & Corporate Partnership Lead",
    name: "Kazi Shahriar",
    studentId: "2122012042",
    aliasEmail: "sponsorship.head@northsouth.edu",
    officialEmail: "kazi.shahriar@northsouth.edu",
    password: "soptosur2026",
    permittedRoute: "/dashboard/departments",
  },
  {
    tier: 5,
    tierName: "Tier 5: Coordinator",
    role: "Music Coordinator",
    roleDescription: "Department Coordinator (Max 2 Quota)",
    name: "Arham Karim",
    studentId: "2212345042",
    aliasEmail: "coordinator@northsouth.edu",
    officialEmail: "arham.karim@northsouth.edu",
    password: "soptosur2026",
    permittedRoute: "/dashboard/member",
  },
  {
    tier: 5,
    tierName: "Tier 5: General Member",
    role: "General Assembly Member",
    roleDescription: "General Assembly Member (33% Floor Quorum & 25% EGM Petition)",
    name: "Sarafat Karim",
    studentId: "2132123042",
    aliasEmail: "member@northsouth.edu",
    officialEmail: "sarafat.karim@northsouth.edu",
    password: "soptosur2026",
    permittedRoute: "/dashboard/member",
  },
  {
    tier: 5,
    tierName: "Tier 5: Whitelisted Gmail",
    role: "Google OAuth Test User",
    roleDescription: "Direct Google OAuth Test Account (1-Click Sign In)",
    name: "Rizwan Ahmed",
    studentId: "2620000001",
    aliasEmail: "rezwanahmed399@gmail.com",
    officialEmail: "rezwanahmed399@gmail.com",
    password: "soptosur2026",
    permittedRoute: "/dashboard/member",
  },
];

export default function CredentialsPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Actions Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 print:hidden">
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center space-x-2"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print or Save as PDF</span>
            </button>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Go to Sign In Portal</span>
            </Link>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center sm:text-left space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>North South University • Office of Student Affairs (OSA)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Soptosur Governance OS — Authorized Testing Credentials & Copy Booth
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
            To verify RBAC access across constitutional tiers, click the{" "}
            <span className="font-semibold text-blue-600">Copy</span> button next to any email or password to instantly copy it to your clipboard.
          </p>
        </div>

        {/* Universal Password Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-blue-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Universal Testing Password
              </div>
              <div className="text-base font-black font-mono text-slate-900 mt-0.5">
                soptosur2026
              </div>
            </div>
          </div>

          <button
            onClick={() => handleCopy("soptosur2026", "universal-pass")}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-2"
          >
            {copiedKey === "universal-pass" ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Password</span>
              </>
            )}
          </button>
        </div>

        {/* Credentials Cards Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CREDENTIALS.map((item, idx) => {
            const aliasKey = `alias-${idx}`;
            const officialKey = `official-${idx}`;
            const passKey = `pass-${idx}`;

            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 hover:border-blue-300 transition-colors"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      Tier {item.tier}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{item.role}</h3>
                    <p className="text-[11px] text-slate-500">{item.roleDescription}</p>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex-shrink-0">
                    {item.name}
                  </span>
                </div>

                {/* Email 1: Easy Alias */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Authorized Easy Alias:
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
                    <span className="text-slate-800 font-semibold truncate mr-2">{item.aliasEmail}</span>
                    <button
                      onClick={() => handleCopy(item.aliasEmail, aliasKey)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold transition-all shadow-xs flex items-center space-x-1 flex-shrink-0"
                      title="Copy Alias Email"
                    >
                      {copiedKey === aliasKey ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Email 2: Official NSU Email */}
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Official NSU Email:
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
                    <span className="text-slate-800 truncate mr-2">{item.officialEmail}</span>
                    <button
                      onClick={() => handleCopy(item.officialEmail, officialKey)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold transition-all shadow-xs flex items-center space-x-1 flex-shrink-0"
                      title="Copy Official Email"
                    >
                      {copiedKey === officialKey ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Password & Direct Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500">Password:</span>
                    <code className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.password}
                    </code>
                    <button
                      onClick={() => handleCopy(item.password, passKey)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700"
                      title="Copy Password"
                    >
                      {copiedKey === passKey ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <Link
                    href={`/login?email=${encodeURIComponent(item.aliasEmail)}`}
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-bold text-[11px]"
                  >
                    <span>Sign In Now</span>
                    <ArrowLeft className="w-3 h-3 rotate-180" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Notes */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-800">Testing Guidelines & Instructions:</div>
          <p>
            1. Enter any of the authorized email aliases on the sign-in form with universal test password: <strong>soptosur2026</strong>.
          </p>
          <p>
            2. To test with Google OAuth in production, you can sign in with <strong>rezwanahmed399@gmail.com</strong> in 1 click.
          </p>
          <p>
            3. To print or save this credential sheet, click the <strong>&quot;Print or Save as PDF&quot;</strong> button at the top right.
          </p>
        </div>
      </div>
    </div>
  );
}
