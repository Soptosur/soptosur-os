"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useGovernance } from "@/context/GovernanceContext";
import {
  Shield,
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Key,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { allPersonas, switchPersona } = useGovernance();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("soptosur2026");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const qEmail = searchParams.get("email");
    if (qEmail) {
      setEmail(qEmail);
    }
  }, [searchParams]);

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

      router.push("/dashboard");
    } catch (err: any) {
      setError("Authentication failed. Please verify credentials.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-center items-center p-4 relative overflow-hidden text-[#2A1A10]">
      {/* Decorative Warm Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8B3A0F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#8B3A0F]/10 border border-[#8B3A0F]/20 p-2 shadow-2xs">
            <img src="/soptosur-logo.svg" alt="Soptosur Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#2A1A10]">
            Soptosur Governance OS
          </h1>
          <p className="text-xs text-[#7A6A58] font-medium">
            North South University • Office of Student Affairs (OSA)
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-[#E8E2D8] pb-4">
            <h2 className="text-base font-semibold text-[#2A1A10] flex items-center justify-between">
              <span>Institutional Sign In</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#8B3A0F]/10 text-[#8B3A0F] border border-[#8B3A0F]/20">
                NSU Single Sign-On
              </span>
            </h2>
            <p className="text-xs text-[#7A6A58] mt-1">
              Enforcing strict single-supervisor RBAC & anti-bypass gates.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google OAuth Sign In Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#2A1A10] bg-white hover:bg-[#FAF7F2] border border-[#D5C9B8] hover:border-[#8B3A0F]/40 transition-all duration-200 shadow-2xs flex items-center justify-center space-x-2.5 disabled:opacity-50 cursor-pointer"
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
            <span className="text-[10px] text-[#7A6A58] mt-1.5 block text-center">
              Permitted domains: <code className="text-[#8B3A0F] font-semibold">@northsouth.edu</code> &amp; <code className="text-[#2D5A3F] font-semibold">@gmail.com</code> (test whitelist)
            </span>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#E8E2D8]"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-[#A89A88] tracking-wider">
              Or Institutional Credentials
            </span>
            <div className="flex-grow border-t border-[#E8E2D8]"></div>
          </div>

          <form onSubmit={handleDomainLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5A4D41] mb-1.5">
                Authorized Email <span className="text-[#8B3A0F]">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A89A88] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="name@northsouth.edu or user@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D5C9B8] rounded-xl text-xs text-[#2A1A10] placeholder:text-[#A89A88] focus:outline-none focus:border-[#8B3A0F] font-sans shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5A4D41] mb-1.5">
                Governance Credentials <span className="text-[#8B3A0F]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A89A88] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#D5C9B8] rounded-xl text-xs text-[#2A1A10] placeholder:text-[#A89A88] focus:outline-none focus:border-[#8B3A0F] font-sans shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#8B3A0F] hover:bg-[#682907] transition-all duration-200 shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
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
        </div>

        {/* Links to Charter & Directory */}
        <div className="text-center space-y-2">
          <Link
            href="/charter"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#8B3A0F] hover:text-[#682907] bg-[#FAF4EE] hover:bg-[#F5ECE2] border border-[#E0D2C4] px-3.5 py-1.5 rounded-xl transition-all shadow-2xs mr-2"
          >
            <span>View Official Charter (15 Articles)</span>
          </Link>
          <Link
            href="/dashboard/members"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#2A1A10] hover:text-[#8B3A0F] bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#E8E2D8] px-3.5 py-1.5 rounded-xl transition-all shadow-2xs"
          >
            <span>Constitutional Roster</span>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-[#A89A88]">
          Protected by North South University (NSU) OSA Enterprise Security Protocol
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center text-xs text-[#7A6A58] font-mono">
          Loading login portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
