"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Music, Shield, ArrowRight, CheckCircle2, Lock } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/25 border border-blue-200">
          <Music className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
            North South University • Office of Student Affairs
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Soptosur Governance OS
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Enterprise University Club Management ERP enforcing strict 5-Tier single-supervisor hierarchy, Section 12 creative firewall, and anti-bypass whistleblower protocols.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Enter Governance Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 shadow-xs flex items-center space-x-2 transition-all"
          >
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Institutional SSO Portal</span>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-8 text-left">
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-900">5-Tier Single-Supervisor</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal">
              Strict constitutional reporting lines with zero supervisory ambiguity.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
            <Lock className="w-4 h-4 text-purple-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-900">Section 12 Creative Firewall</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal">
              Music repertoire and vocal casting protected from executive interference.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
            <Shield className="w-4 h-4 text-blue-600 mb-2" />
            <h4 className="text-xs font-bold text-slate-900">Unblinded Tribunal Gate</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal">
              Independent whistleblower oversight directly accessible to Faculty Advisor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
