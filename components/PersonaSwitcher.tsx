"use client";

import React, { useState } from "react";
import { useGovernance } from "@/context/GovernanceContext";
import { Shield, UserCheck, RefreshCw, AlertTriangle, ChevronDown } from "lucide-react";

export function PersonaSwitcher() {
  const { currentUser, allPersonas, switchPersona, toggleActingStatus } = useGovernance();
  const [isOpen, setIsOpen] = useState(false);

  // Render ONLY in development mode
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 transition-all duration-200 shadow-xs"
        title="Simulate Constitutional Personas"
      >
        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
        <span className="font-semibold text-slate-900">{currentUser.legalName}</span>
        <span className="text-slate-500 hidden sm:inline">({currentUser.tierLabel.split(":")[0]})</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2.5 space-y-2">
            <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 flex justify-between items-center">
              <span>Constitutional Persona Simulator</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-semibold">Preview Mode</span>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
              {allPersonas.map((persona) => {
                const isSelected = persona.id === currentUser.id;
                return (
                  <button
                    key={persona.id}
                    onClick={() => {
                      switchPersona(persona.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start space-x-2.5 ${
                      isSelected
                        ? "bg-blue-50 border border-blue-200 text-blue-900 shadow-xs font-semibold"
                        : "hover:bg-slate-50 text-slate-700 border border-transparent"
                    }`}
                  >
                    <div className="mt-0.5">
                      <Shield
                        className={`w-3.5 h-3.5 ${
                          persona.tier === 1
                            ? "text-purple-600"
                            : persona.tier === 2
                            ? "text-blue-600"
                            : persona.tier === 3
                            ? "text-cyan-600"
                            : persona.tier === 4
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 truncate">{persona.legalName}</span>
                        <span className="text-[10px] font-mono text-slate-400">{persona.studentId}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{persona.roleTitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  toggleActingStatus();
                  setIsOpen(false);
                }}
                className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-2 transition-all ${
                  currentUser.isActing
                    ? "bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {currentUser.isActing ? "Deactivate Acting Officer Status" : "Simulate Active Acting Officer Status"}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
