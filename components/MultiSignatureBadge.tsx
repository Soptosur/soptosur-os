"use client";

import React from "react";
import { FinancialRequisition } from "@/types/governance";
import { CheckCircle2, Clock, AlertCircle, ChevronRight } from "lucide-react";

export function MultiSignatureBadge({ requisition }: { requisition: FinancialRequisition }) {
  const { tier, signatures, status, voucherDeadlineHours } = requisition;

  interface Step {
    label: string;
    completed: boolean;
    active: boolean;
    rejected: boolean;
  }

  const steps: Step[] = [];

  // Step 1: GS Verification
  steps.push({
    label: "GS Verification",
    completed: Boolean(signatures.gsSigned),
    active: !signatures.gsSigned && status !== "REJECTED",
    rejected: status === "REJECTED" && !signatures.gsSigned,
  });

  // Step 2: Treasurer Sign
  steps.push({
    label: "Treasurer Sign",
    completed: Boolean(signatures.treasurerSigned),
    active: Boolean(signatures.gsSigned) && !signatures.treasurerSigned && status !== "REJECTED",
    rejected: status === "REJECTED" && Boolean(signatures.gsSigned) && !signatures.treasurerSigned,
  });

  // Step 3: President (Tier 2 & 3)
  if (tier >= 2) {
    steps.push({
      label: "President Co-Sign",
      completed: Boolean(signatures.presidentSigned),
      active: Boolean(signatures.treasurerSigned) && !signatures.presidentSigned && status !== "REJECTED",
      rejected: status === "REJECTED" && Boolean(signatures.treasurerSigned) && !signatures.presidentSigned,
    });
  }

  // Step 4: Advisor Clearance (Tier 3 > 20,000 BDT)
  if (tier === 3) {
    steps.push({
      label: "Advisor Gate (>20k)",
      completed: Boolean(signatures.advisorSigned),
      active: Boolean(signatures.presidentSigned) && !signatures.advisorSigned && status !== "REJECTED",
      rejected: status === "REJECTED" && Boolean(signatures.presidentSigned) && !signatures.advisorSigned,
    });
  }

  // Step 5: Disbursement & Voucher
  const isFullyApproved =
    tier === 1
      ? signatures.treasurerSigned
      : tier === 2
      ? signatures.presidentSigned
      : signatures.advisorSigned;

  steps.push({
    label: status === "DISBURSED" ? `Voucher Pending (${voucherDeadlineHours}h)` : "Disbursement",
    completed: status === "SETTLED",
    active: status === "DISBURSED" || Boolean(isFullyApproved && status !== "SETTLED" && status !== "REJECTED"),
    rejected: false,
  });

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-1">
      {steps.map((step, idx) => {
        let badgeColor = "bg-slate-800 text-slate-400 border-slate-700";
        let Icon = Clock;

        if (step.completed) {
          badgeColor = "bg-emerald-950/80 text-emerald-300 border-emerald-700/60";
          Icon = CheckCircle2;
        } else if (step.rejected) {
          badgeColor = "bg-red-950/80 text-red-300 border-red-700/60";
          Icon = AlertCircle;
        } else if (step.active) {
          badgeColor = "bg-blue-950/80 text-blue-300 border-blue-600/60 animate-pulse";
          Icon = Clock;
        }

        return (
          <div key={idx} className="flex items-center space-x-1">
            <div
              className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold flex items-center space-x-1 ${badgeColor}`}
            >
              <Icon className="w-3 h-3" />
              <span>{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </div>
  );
}
