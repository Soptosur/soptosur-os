"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useGovernance } from "@/context/GovernanceContext";
import {
  Shield,
  Music,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { allPersonas, switchPersona } = useGovernance();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err: any) {
      setError("Failed to initiate Google Authentication. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleDomainLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normEmail = email.trim().toLowerCase();

    // Domain validation: @northsouth.edu or temporary @gmail.com
    if (!normEmail.endsWith("@northsouth.edu") && !normEmail.endsWith("@gmail.com")) {
      setError("Institutional Access Restricted: Only official @northsouth.edu (or whitelisted @gmail.com) accounts are permitted.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Security Policy: Password must meet institutional complexity standards (minimum 6 characters).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signIn("institutional-credentials", {
        email: normEmail,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setIsSubmitting(false);
        return;
      }

      // If in development mode, switch active persona if matched
      const matched = allPersonas.find((p) => p.email.toLowerCase() === normEmail);
      if (matched && process.env.NODE_ENV === "development") {
        switchPersona(matched.id);
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError("Authentication failed. Please verify credentials.");
      setIsSubmitting(false);
    }
  };

  const handleQuickPersonaSelect = (personaId: string) => {
    switchPersona(personaId);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 shadow-xl shadow-blue-900/40 border border-blue-400/30">
            <Music className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Soptosur Governance OS
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            North South University • Office of Student Affairs (OSA)
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-base font-semibold text-slate-100 flex items-center justify-between">
              <span>Institutional Sign In</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                NSU Single Sign-On
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Enforcing strict single-supervisor RBAC & anti-bypass gates.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/80 text-xs text-red-200 flex items-start space-x-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google OAuth Sign In Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all duration-200 shadow-md flex items-center justify-center space-x-2.5 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
            <span className="text-[10px] text-slate-500 mt-1.5 block text-center">
              Permitted domains: <code className="text-blue-400">@northsouth.edu</code> &amp; <code className="text-emerald-400">@gmail.com</code> (test whitelist)
            </span>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Or Institutional Credentials
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <form onSubmit={handleDomainLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Authorized Email <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="legal.name@northsouth.edu or user@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Governance Credentials <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all duration-200 shadow-lg shadow-blue-900/40 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Validating Institutional Gate...</span>
              ) : (
                <>
                  <span>Authenticate to Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Persona Switcher Demonstration Tray (Strictly Development Mode Only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instant Persona Demonstration</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">1-Click Preview</span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Select an authorized constitutional persona to enter their role-specific governance workspace:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {allPersonas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => handleQuickPersonaSelect(persona.id)}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-blue-500/50 hover:bg-blue-950/20 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-blue-300 truncate">
                        {persona.legalName}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          persona.tier === 1
                            ? "bg-purple-900/60 text-purple-300"
                            : persona.tier === 2
                            ? "bg-blue-900/60 text-blue-300"
                            : persona.tier === 3
                            ? "bg-cyan-900/60 text-cyan-300"
                            : persona.tier === 4
                            ? "bg-emerald-900/60 text-emerald-300"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        Tier {persona.tier}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
                      {persona.roleTitle.split("(")[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-500">
          Protected by North South University (NSU) OSA Enterprise Security Protocol
        </p>
      </div>
    </div>
  );
}
