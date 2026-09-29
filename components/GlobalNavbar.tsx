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
} from "lucide-react";

export function GlobalNavbar() {
  const { currentUser, notification, clearNotification } = useGovernance();

  // Tier color styling
  const getTierBadgeStyle = (tier: number) => {
    switch (tier) {
      case 1:
        return "bg-purple-900/60 text-purple-200 border-purple-600/50 shadow-purple-900/20";
      case 2:
        return "bg-blue-900/60 text-blue-200 border-blue-500/50 shadow-blue-900/20";
      case 3:
        return "bg-cyan-900/60 text-cyan-200 border-cyan-500/50 shadow-cyan-900/20";
      case 4:
        return "bg-emerald-900/60 text-emerald-200 border-emerald-500/50 shadow-emerald-900/20";
      case 5:
      default:
        return "bg-slate-800 text-slate-300 border-slate-700 shadow-slate-900/20";
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`w-full px-4 py-2 text-xs flex items-center justify-between border-b transition-all duration-300 ${
            notification.type === "success"
              ? "bg-emerald-950/90 text-emerald-200 border-emerald-800"
              : notification.type === "warning"
              ? "bg-amber-950/90 text-amber-200 border-amber-800"
              : "bg-red-950/90 text-red-200 border-red-800"
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === "success" && <CheckCircle className="w-4 h-4 text-emerald-400" />}
            {notification.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            {notification.type === "error" && <AlertCircle className="w-4 h-4 text-red-400" />}
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            onClick={clearNotification}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/40 ring-1 ring-blue-400/30 group-hover:scale-105 transition-transform duration-200">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-100 tracking-tight text-base sm:text-lg">
                    Shaptasur
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800/80 text-blue-300">
                    Governance OS
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 font-medium">
                  <span>North South University OSA</span>
                </div>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-slate-800 text-xs">
              <div className="flex items-center space-x-1.5 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold text-slate-200">Fall 2026</span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-400 font-mono">Day 29 / 90</span>
              </div>
            </div>
          </div>

          {/* User Identification, Tier Badge & Persona Switcher */}
          <div className="flex items-center space-x-3">
            {/* Acting Officer Badge (Amber) */}
            {currentUser.isActing && (
              <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold animate-pulse shadow-sm shadow-amber-900/30">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>ACTING: {currentUser.actingRole || "Acting Officer"}</span>
              </div>
            )}

            {/* Dynamic Tier Badge */}
            <div
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold shadow-sm ${getTierBadgeStyle(
                currentUser.tier
              )}`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Tier {currentUser.tier}</span>
            </div>

            {/* User Meta */}
            <div className="hidden lg:block text-right">
              <div className="text-xs font-bold text-slate-200 leading-tight">
                {currentUser.legalName}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
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
