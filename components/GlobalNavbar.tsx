"use client";

import React from "react";
import Link from "next/link";
import { useGovernance } from "@/context/GovernanceContext";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import {
  Shield,
  Music,
  Calendar,
  AlertCircle,
  Building,
  CheckCircle,
  AlertTriangle,
  X,
  ExternalLink,
  ScrollText,
} from "lucide-react";

export function GlobalNavbar() {
  const { currentUser, notification, clearNotification } = useGovernance();

  // Tier color styling
  const getTierBadgeStyle = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-purple-50 text-purple-700 border-purple-200 shadow-xs";
      case 2:
        return "bg-blue-50 text-blue-700 border-blue-200 shadow-xs";
      case 3:
        return "bg-cyan-50 text-cyan-800 border-cyan-200 shadow-xs";
      case 4:
        return "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs";
      case 5:
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 shadow-xs";
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/90 bg-white/90 backdrop-blur-md shadow-xs">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`w-full px-4 py-2 text-xs flex items-center justify-between border-b transition-all duration-300 ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : notification.type === "warning"
              ? "bg-amber-50 text-amber-800 border-amber-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === "success" && <CheckCircle className="w-4 h-4 text-emerald-600" />}
            {notification.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-600" />}
            {notification.type === "error" && <AlertCircle className="w-4 h-4 text-red-600" />}
            <span className="font-semibold">{notification.message}</span>
          </div>
          <button
            onClick={clearNotification}
            className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/25 ring-1 ring-blue-300 group-hover:scale-105 transition-transform duration-200">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                    Soptosur
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700">
                    Governance OS
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 font-medium">
                  <span>North South University OSA</span>
                </div>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-200 text-xs">
              <div className="flex items-center space-x-1.5 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200 text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold text-slate-800">Fall 2026</span>
                <span className="text-slate-400">•</span>
                <span className="text-amber-700 font-mono font-medium">Day 29 / 90</span>
              </div>

              <Link
                href="/charter"
                className="flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-900 px-2.5 py-1 rounded-md border border-blue-200 transition-colors font-medium"
                title="View Official Charter (গঠনতন্ত্র)"
              >
                <ScrollText className="w-3.5 h-3.5 text-blue-600" />
                <span>গঠনতন্ত্র (Charter)</span>
              </Link>
            </div>
          </div>

          {/* User Identification, Tier Badge & Persona Switcher */}
          <div className="flex items-center space-x-3">
            {/* Acting Officer Badge (Amber) */}
            {currentUser.isActing && (
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 text-xs font-semibold animate-pulse shadow-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>ACTING: {currentUser.actingRole || "Acting Officer"}</span>
              </div>
            )}

            {/* Dynamic Tier Badge */}
            <div
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold shadow-xs ${getTierBadgeStyle(
                currentUser.tier
              )}`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Tier {currentUser.tier}</span>
            </div>

            {/* User Meta */}
            <div className="hidden lg:block text-right">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.legalName}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                ID: {currentUser.studentId}
              </div>
            </div>

            {/* Persona Switcher Dropdown */}
            <PersonaSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
