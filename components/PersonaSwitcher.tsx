"use client";

import React, { useState } from "react";
import { useGovernance } from "@/context/GovernanceContext";
import { Shield, UserCheck, RefreshCw, AlertTriangle, ChevronDown } from "lucide-react";

export function PersonaSwitcher() {
  const { currentUser, allPersonas, switchPersona, toggleActingStatus } = useGovernance();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-200 transition-all duration-200 shadow-sm"
        title="Simulate Constitutional Personas"
      >
        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-semibold text-slate-100">{currentUser.legalName}</span>
        <span className="text-slate-400 hidden sm:inline">({currentUser.tierLabel.split(":")[0]})</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700/90 rounded-xl shadow-2xl z-50 p-2.5 space-y-2 backdrop-blur-md">
            <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 flex justify-between items-center">
              <span>Constitutional Persona Simulator</span>
              <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded">Preview Mode</span>
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
                        ? "bg-blue-600/20 border border-blue-500/50 text-white"
                        : "hover:bg-slate-800/80 text-slate-300 border border-transparent"
                    }`}
                  >
                    <div className="mt-0.5">
                      <Shield
                        className={`w-3.5 h-3.5 ${
                          persona.tier === 1
                            ? "text-purple-400"
                            : persona.tier === 2
                            ? "text-blue-400"
                            : persona.tier === 3
                            ? "text-amber-400"
                            : persona.tier === 4
                            ? "text-emerald-400"
                            : "text-slate-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold truncate">{persona.legalName}</span>
                        <span className="text-[10px] font-mono text-slate-400">{persona.studentId}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{persona.roleTitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  toggleActingStatus();
                  setIsOpen(false);
                }}
                className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-2 transition-all ${
                  currentUser.isActing
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
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
