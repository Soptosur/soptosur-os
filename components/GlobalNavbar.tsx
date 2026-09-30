"use client";

import React from "react";
import Link from "next/link";
import { useGovernance } from "@/context/GovernanceContext";
import { signOut } from "next-auth/react";
import {
  Shield,
  Calendar,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  X,
  ScrollText,
  Users,
  LogOut,
} from "lucide-react";

export function GlobalNavbar() {
  const { currentUser, notification, clearNotification } = useGovernance();

  // Tier color styling with Soptosur Terracotta Minimalist palette
  const getTierBadgeStyle = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-[#8B3A0F]/10 text-[#8B3A0F] border-[#8B3A0F]/30 shadow-2xs";
      case 2:
        return "bg-[#2A1A10]/10 text-[#2A1A10] border-[#2A1A10]/20 shadow-2xs";
      case 3:
        return "bg-amber-50 text-amber-900 border-amber-200 shadow-2xs";
      case 4:
        return "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-2xs";
      case 5:
      default:
        return "bg-[#F5F1E8] text-[#5A4D41] border-[#E8E2D8] shadow-2xs";
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("soptosur_active_persona");
      document.cookie = "soptosur_tier=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "soptosur_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch (e) {}
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#E8E2D8] bg-[#FDFBF7]/95 backdrop-blur-md shadow-2xs">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`w-full px-4 py-2 text-xs flex items-center justify-between border-b transition-all duration-300 ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : notification.type === "warning"
              ? "bg-amber-50 text-amber-900 border-amber-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === "success" && <CheckCircle className="w-4 h-4 text-emerald-600" />}
            {notification.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-600" />}
            {notification.type === "error" && <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span className="font-semibold">{notification.message}</span>
          </div>
          <button
            onClick={clearNotification}
            className="text-stone-400 hover:text-stone-700 p-0.5 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Semester */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#8B3A0F]/10 border border-[#8B3A0F]/20 flex items-center justify-center p-1.5 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                <img
                  src="/soptosur-logo.svg"
                  alt="Soptosur Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#2A1A10] tracking-tight text-base sm:text-lg">
                    Soptosur
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#8B3A0F]/10 border border-[#8B3A0F]/20 text-[#8B3A0F]">
                    Governance OS
                  </span>
                </div>
                <div className="text-[11px] text-[#7A6A58] flex items-center space-x-1.5 font-medium">
                  <span>North South University OSA</span>
                </div>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-[#E8E2D8] text-xs">
              <div className="flex items-center space-x-1.5 bg-[#F5F1E8] px-2.5 py-1 rounded-md border border-[#E8E2D8] text-[#5A4D41]">
                <Calendar className="w-3.5 h-3.5 text-[#8B3A0F]" />
                <span className="font-semibold text-[#2A1A10]">Fall 2026</span>
                <span className="text-[#A89A88]">•</span>
                <span className="text-[#8B3A0F] font-mono font-medium">Day 29 / 90</span>
              </div>

              <Link
                href="/charter"
                className="flex items-center space-x-1.5 bg-[#FAF4EE] hover:bg-[#F5ECE2] text-[#8B3A0F] hover:text-[#682907] px-2.5 py-1 rounded-md border border-[#E0D2C4] transition-colors font-medium"
                title="View Official Charter (15 Articles & Annexures)"
              >
                <ScrollText className="w-3.5 h-3.5 text-[#8B3A0F]" />
                <span>Official Charter</span>
              </Link>

              <Link
                href="/dashboard/members"
                className="flex items-center space-x-1.5 bg-[#F7F3EC] hover:bg-[#EFE9DF] text-[#2A1A10] hover:text-[#8B3A0F] px-2.5 py-1 rounded-md border border-[#E2DBD0] transition-colors font-medium"
                title="Realtime Constitutional Member Directory"
              >
                <Users className="w-3.5 h-3.5 text-[#8B3A0F]" />
                <span>Member Directory</span>
              </Link>
            </div>
          </div>

          {/* User Identification, Tier Badge & Single Logout */}
          <div className="flex items-center space-x-3">
            {/* Acting Officer Badge (Amber) */}
            {currentUser?.isActing && (
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold animate-pulse shadow-2xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>ACTING: {currentUser.actingRole || "Acting Officer"}</span>
              </div>
            )}

            {/* Dynamic Tier Badge */}
            <div
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${getTierBadgeStyle(
                currentUser?.tier ?? 5
              )}`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Tier {currentUser?.tier ?? 5}</span>
            </div>

            {/* User Profile Quick Link / Avatar */}
            <Link
              href="/dashboard/profile"
              className="flex items-center space-x-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-[#E8E2D8] bg-[#F5F1E8] hover:bg-[#FAF4EE] hover:border-[#8B3A0F]/40 transition-all duration-200 group shadow-2xs"
              title="View and Edit Profile"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#E0D7C9] bg-white flex items-center justify-center flex-shrink-0 group-hover:border-[#8B3A0F] shadow-2xs">
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.legalName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        currentUser?.legalName || "Member"
                      )}&backgroundColor=8B3A0F`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#8B3A0F] text-white font-bold text-xs flex items-center justify-center">
                    {currentUser?.legalName ? currentUser.legalName.charAt(0).toUpperCase() : "V"}
                  </div>
                )}
              </div>
              <div className="hidden lg:block text-left pr-1">
                <div className="text-xs font-bold text-[#2A1A10] group-hover:text-[#8B3A0F] leading-tight truncate max-w-[130px]">
                  {currentUser?.legalName || "VACANT (পদ শূন্য)"}
                </div>
                <div className="text-[10px] text-[#7A6A58] font-mono truncate">
                  ID: {currentUser?.studentId || "UNASSIGNED"}
                </div>
              </div>
            </Link>

            {/* Prominent Single Logout Button (The ONLY sign-out button across the app) */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-700 hover:text-rose-800 text-xs font-bold transition-all duration-200 shadow-2xs group cursor-pointer"
              title="Sign Out of Governance OS"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
