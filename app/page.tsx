"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Music, Shield, ArrowRight, CheckCircle2, Lock } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-center relative overflow-hidden">
      <div className="absolute top-1/4 w-[500px] h-[500px] bg-blue-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 shadow-2xl shadow-blue-900/40 border border-blue-400/30">
          <Music className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
            North South University • Office of Student Affairs
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Soptosur Governance OS
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Enterprise University Club Management ERP enforcing strict 5-Tier single-supervisor hierarchy, Section 12 creative firewall, and anti-bypass whistleblower protocols.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/40 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Enter Governance Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center space-x-2 transition-all"
          >
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Institutional SSO Portal</span>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-8 text-left">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-2" />
            <h4 className="text-xs font-bold text-slate-200">5-Tier Single-Supervisor</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Strict constitutional reporting lines with zero supervisory ambiguity.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <Lock className="w-4 h-4 text-purple-400 mb-2" />
            <h4 className="text-xs font-bold text-slate-200">Section 12 Creative Firewall</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Music repertoire and vocal casting protected from executive interference.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <Shield className="w-4 h-4 text-blue-400 mb-2" />
            <h4 className="text-xs font-bold text-slate-200">Unblinded Tribunal Gate</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Independent whistleblower oversight directly accessible to Faculty Advisor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
