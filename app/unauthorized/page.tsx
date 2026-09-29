"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowLeft, Lock, UserCheck } from "lucide-react";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const required = searchParams.get("required") || "Higher Tier Clearance";
  const activeTier = searchParams.get("activeTier") || "5";
  const attemptedPath = searchParams.get("path") || "/dashboard";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full bg-slate-900/90 border border-red-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-950/80 border border-red-800 text-red-400 mx-auto shadow-lg shadow-red-950/40">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-950 text-red-300 border border-red-800">
            Constitutional Anti-Bypass Guard
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Access Intercepted & Blocked
          </h1>
          <p className="text-xs text-slate-400">
            Deep-link URL tampering was detected and blocked by the Next.js routing layer.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-left space-y-2 font-mono">
          <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
            <span className="text-slate-500">Attempted Route:</span>
            <span className="text-red-400 font-bold">{attemptedPath}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
            <span className="text-slate-500">Required Authority:</span>
            <span className="text-amber-400 font-bold">{required}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Your Active Tier:</span>
            <span className="text-slate-300 font-bold">Tier {activeTier}</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Pursuant to the North South University OSA Single-Supervisor Security Charter, members may not navigate outside their constitutional jurisdiction.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors flex items-center justify-center space-x-2 border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Permitted Console</span>
          </Link>
          <div className="w-full sm:w-auto flex justify-center">
            <PersonaSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Checking permissions...</div>}>
      <UnauthorizedContent />
    </Suspense>
  );
}
