"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  GovernanceUser,
  GovernanceTier,
  WhistleblowerDossier,
  FinancialRequisition,
  SongArrangement,
  AttendanceRecord,
  ParliamentaryAgendaItem,
  DigitalPetition,
} from "@/types/governance";
import {
  INITIAL_PERSONAS,
  INITIAL_DOSSIERS,
  INITIAL_REQUISITIONS,
  INITIAL_REPERTOIRE,
  INITIAL_ATTENDANCE,
  INITIAL_PARLIAMENTARY_AGENDAS,
  INITIAL_PETITIONS,
} from "@/lib/mock-data";

interface RejectionTarget {
  id: string;
  type: "REQUISITION" | "LEAVE" | "PROPOSAL";
  title: string;
}

interface GovernanceContextType {
  currentUser: GovernanceUser;
  allPersonas: GovernanceUser[];
  switchPersona: (userId: string) => void;
  toggleActingStatus: () => void;
  // Requisitions
  requisitions: FinancialRequisition[];
  approveRequisition: (id: string) => void;
  disburseRequisition: (id: string) => void;
  triggerRejection: (target: RejectionTarget) => void;
  // Whistleblower
  dossiers: WhistleblowerDossier[];
  visibleDossiers: WhistleblowerDossier[];
  convokeTribunal: (dossierId: string) => void;
  // Creative Firewall
  repertoire: SongArrangement[];
  updateSong: (song: SongArrangement) => { success: boolean; error?: string };
  // Attendance & Discipline
  attendance: AttendanceRecord[];
  issueShowCause: (memberId: string) => void;
  submitLeave: (reason: string, sessionsCount: number) => void;
  // Parliamentary & Petitions
  agendas: ParliamentaryAgendaItem[];
  castVote: (agendaId: string, vote: "FOR" | "AGAINST" | "ABSTAIN") => { success: boolean; error?: string };
  petitions: DigitalPetition[];
  signPetition: (petitionId: string) => void;
  // Rejection Modal State
  rejectionModalTarget: RejectionTarget | null;
  submitRejection: (justification: string) => void;
  closeRejectionModal: () => void;
  // Profile Management
  updateProfile: (updatedData: Partial<GovernanceUser>) => Promise<{ success: boolean; error?: string }>;
  // Notifications
  notification: { message: string; type: "success" | "warning" | "error" } | null;
  clearNotification: () => void;
}

const GovernanceContext = createContext<GovernanceContextType | undefined>(undefined);

export function GovernanceProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status: sessionStatus } = useSession();

  // 1. Current User State
  // In production, do not default to mock Afrin Sultana; initialize with authenticating guest until session loads
  const [currentUser, setCurrentUser] = useState<GovernanceUser>(() => {
    if (process.env.NODE_ENV === "production") {
      return {
        id: "authenticating",
        studentId: "--------",
        legalName: "Authenticating Member...",
        email: "",
        roleTitle: "General Member",
        tier: 5,
        tierLabel: "Tier 5: General Member",
        department: "General",
        isActing: false,
        permissions: ["CAST_BALLOT", "SIGN_PETITION", "SUBMIT_LEAVE", "ATTEND_GBM"],
      };
    }
    return INITIAL_PERSONAS[0];
  });
  const [allPersonas, setAllPersonas] = useState<GovernanceUser[]>(INITIAL_PERSONAS);

  // 2. Domain Data State
  const [requisitions, setRequisitions] = useState<FinancialRequisition[]>(INITIAL_REQUISITIONS);
  const [dossiers, setDossiers] = useState<WhistleblowerDossier[]>(INITIAL_DOSSIERS);
  const [repertoire, setRepertoire] = useState<SongArrangement[]>(INITIAL_REPERTOIRE);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [agendas, setAgendas] = useState<ParliamentaryAgendaItem[]>(INITIAL_PARLIAMENTARY_AGENDAS);
  const [petitions, setPetitions] = useState<DigitalPetition[]>(INITIAL_PETITIONS);

  // 3. Modal & Notification State
  const [rejectionModalTarget, setRejectionModalTarget] = useState<RejectionTarget | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "warning" | "error" } | null>(
    null
  );

  const showNotification = (message: string, type: "success" | "warning" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // Sync session and cookies for Next.js Middleware deep-link protection
  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;
      const tierNum = (typeof u.tier === "number" ? u.tier : 5) as GovernanceTier;
      const roleTitle = u.role ? String(u.role).replace(/_/g, " ") : "General Member";
      const dept = u.department || "General";
      const liveUser: GovernanceUser = {
        id: u.id || u.email || "session-user",
        studentId: u.studentId || "2620000000",
        legalName: u.name || (u.email ? u.email.split("@")[0] : "Member"),
        email: u.email || "",
        roleTitle: roleTitle,
        tier: tierNum,
        tierLabel: `Tier ${tierNum}: ${roleTitle}`,
        department: dept,
        isActing: Boolean(u.isActing),
        actingRole: u.isActing ? "Acting Officer" : undefined,
        isCreativeLead: dept.toLowerCase().includes("music"),
        permissions:
          tierNum === 1
            ? ["TRIBUNAL_UNBLINDED", "FINAL_CLEARANCE", "CONSTITUTIONAL_INTERPRETATION"]
            : tierNum === 2
            ? ["EXECUTIVE_DISPATCH", "DUAL_SIGNATURE_BANKING", "COUNCIL_DIRECTION"]
            : tierNum === 3
            ? ["LEDGER_MANAGEMENT", "ATTENDANCE_ARBITRATION", "FINANCIAL_DISBURSEMENT"]
            : tierNum === 4
            ? ["CREATIVE_AUTONOMY", "DEPT_DISCIPLINE", "ROSTER_VERIFICATION"]
            : ["CAST_BALLOT", "SIGN_PETITION", "SUBMIT_LEAVE", "ATTEND_GBM"],
      };

      let customProfile: any = null;
      try {
        const raw =
          localStorage.getItem(`soptosur_profile_${liveUser.id}`) ||
          localStorage.getItem("soptosur_custom_profile");
        if (raw) customProfile = JSON.parse(raw);
      } catch (e) {}

      if (customProfile) {
        liveUser.legalName = customProfile.legalName || liveUser.legalName;
        liveUser.email = customProfile.email || liveUser.email;
        liveUser.studentId = customProfile.studentId || liveUser.studentId;
        liveUser.avatarUrl = customProfile.avatarUrl || liveUser.avatarUrl;
        liveUser.contactPhone = customProfile.contactPhone || liveUser.contactPhone;
      }

      setCurrentUser(liveUser);
      document.cookie = `soptosur_tier=${liveUser.tier}; path=/; SameSite=Lax`;
      document.cookie = `soptosur_user=${liveUser.id}; path=/; SameSite=Lax`;
      return;
    }

    // In development mode, allow localStorage persona simulation
    if (process.env.NODE_ENV === "development") {
      const savedUserId = localStorage.getItem("soptosur_active_persona");
      if (savedUserId) {
        const found = INITIAL_PERSONAS.find((p) => p.id === savedUserId);
        if (found) {
          const userWithCustom = { ...found };
          try {
            const raw = localStorage.getItem(`soptosur_profile_${found.id}`);
            if (raw) {
              const custom = JSON.parse(raw);
              Object.assign(userWithCustom, custom);
            }
          } catch (e) {}
          setCurrentUser(userWithCustom);
          document.cookie = `soptosur_tier=${userWithCustom.tier}; path=/; SameSite=Lax`;
          document.cookie = `soptosur_user=${userWithCustom.id}; path=/; SameSite=Lax`;
          return;
        }
      }
      document.cookie = `soptosur_tier=${currentUser.tier}; path=/; SameSite=Lax`;
      document.cookie = `soptosur_user=${currentUser.id}; path=/; SameSite=Lax`;
    }
  }, [session, sessionStatus]);

  const switchPersona = (userId: string) => {
    // Suppress in production
    if (process.env.NODE_ENV === "production") {
      return;
    }
    const selected = allPersonas.find((p) => p.id === userId);
    if (!selected) return;
    setCurrentUser(selected);
    localStorage.setItem("soptosur_active_persona", selected.id);
    document.cookie = `soptosur_tier=${selected.tier}; path=/; SameSite=Lax`;
    document.cookie = `soptosur_user=${selected.id}; path=/; SameSite=Lax`;
    showNotification(`Switched active persona to ${selected.legalName} (${selected.tierLabel})`, "success");
  };

  const toggleActingStatus = () => {
    if (process.env.NODE_ENV === "production") {
      return;
    }
    setCurrentUser((prev) => {
      const updated = {
        ...prev,
        isActing: !prev.isActing,
        actingRole: !prev.isActing ? "Acting President" : undefined,
      };
      showNotification(
        `Acting Officer Status ${updated.isActing ? "ACTIVATED (Amber Badge Enabled)" : "Deactivated"}`,
        updated.isActing ? "warning" : "success"
      );
      return updated;
    });
  };

  // Filtered Whistleblower dossiers:
  // - Advisor (Tier 1): Unblinded Tribunal Desk (sees all, including President)
  // - President (Tier 2): Blinded from seeing complaints against themselves
  // - General Secretary (Tier 3): Blinded from seeing complaints against President
  const visibleDossiers = dossiers.filter((dossier) => {
    if (currentUser.tier === 1) return true; // Unblinded Advisor
    if (currentUser.tier === 2 && dossier.isAgainstPresident) return false; // Blind President
    if (currentUser.roleTitle.includes("General Secretary") && dossier.isAgainstPresident) return false; // Blind GS
    return true;
  });

  const convokeTribunal = (dossierId: string) => {
    setDossiers((prev) =>
      prev.map((d) => (d.id === dossierId ? { ...d, status: "PANEL_CONVOKED" } : d))
    );
    showNotification(`Independent Whistleblower Tribunal panel convoked for dossier ${dossierId}.`, "warning");
  };

  // Requisitions Workflow
  const approveRequisition = (id: string) => {
    setRequisitions((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;

        const updatedSignatures = { ...req.signatures };
        let newStatus = req.status;

        if (currentUser.tier === 1) {
          updatedSignatures.advisorSigned = true;
          updatedSignatures.advisorName = currentUser.legalName;
          newStatus = "APPROVED";
          showNotification(`Tier 3 Requisition ${req.requisitionNumber} cleared by Faculty Advisor.`, "success");
        } else if (currentUser.tier === 2) {
          updatedSignatures.presidentSigned = true;
          updatedSignatures.presidentName = currentUser.legalName;
          newStatus = "APPROVED";
          showNotification(`Tier 2 Dual-Signature Requisition co-signed by President.`, "success");
        } else if (currentUser.roleTitle.includes("Treasurer")) {
          updatedSignatures.treasurerSigned = true;
          updatedSignatures.treasurerName = currentUser.legalName;
          showNotification(`Requisition ${req.requisitionNumber} signed by Treasurer.`, "success");
        }

        return {
          ...req,
          signatures: updatedSignatures,
          status: newStatus,
        };
      })
    );
  };

  const disburseRequisition = (id: string) => {
    setRequisitions((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;
        return {
          ...req,
          status: "DISBURSED",
          disbursedAt: new Date().toISOString(),
          voucherDeadlineHours: 72, // 72-hour countdown starts
        };
      })
    );
    showNotification(`Funds successfully disbursed. 72-hour receipt voucher countdown activated.`, "warning");
  };

  const triggerRejection = (target: RejectionTarget) => {
    setRejectionModalTarget(target);
  };

  const submitRejection = (justification: string) => {
    if (!rejectionModalTarget) return;

    if (!justification || justification.trim().length < 8) {
      showNotification("Rejection rejected: Written justification of at least 8 characters is required.", "error");
      return;
    }

    if (rejectionModalTarget.type === "REQUISITION") {
      setRequisitions((prev) =>
        prev.map((req) =>
          req.id === rejectionModalTarget.id ? { ...req, status: "REJECTED" } : req
        )
      );
      showNotification(
        `Requisition ${rejectionModalTarget.title} formally rejected with reason: "${justification}"`,
        "error"
      );
    }

    setRejectionModalTarget(null);
  };

  const closeRejectionModal = () => {
    setRejectionModalTarget(null);
  };

  // Section 12 Creative Firewall
  const updateSong = (song: SongArrangement) => {
    // Only Music Department (and specifically Music Head or Creative Lead) can mutate arrangements
    const isMusicLead = currentUser.department === "Music & Performance" && (currentUser.isCreativeLead || currentUser.tier === 4);
    if (!isMusicLead) {
      const err = `[SECTION 12 FIREWALL VIOLATION]: Only the Music & Performance Department possesses creative autonomy. Mutation blocked for ${currentUser.roleTitle}.`;
      showNotification(err, "error");
      return { success: false, error: err };
    }

    setRepertoire((prev) => prev.map((s) => (s.id === song.id ? song : s)));
    showNotification(`Musical arrangement "${song.title}" updated under Section 12 Creative Autonomy.`, "success");
    return { success: true };
  };

  // Attendance & Discipline
  const issueShowCause = (memberId: string) => {
    setAttendance((prev) =>
      prev.map((rec) =>
        rec.memberId === memberId
          ? { ...rec, showCauseIssued: true, status: "DISQUALIFIED_FROM_VOTING" }
          : rec
      )
    );
    showNotification(`Official Show-Cause notice issued for member ${memberId}. Voting privileges suspended.`, "error");
  };

  const submitLeave = (reason: string, sessionsCount: number) => {
    setAttendance((prev) =>
      prev.map((rec) => {
        if (rec.memberId !== currentUser.id) return rec;
        const updatedLeaves = rec.excusedLeaves + sessionsCount;
        const adjustedDenominator = Math.max(1, rec.totalSessions - updatedLeaves);
        const newEffective = Math.min(100, Math.round((rec.attendedSessions / adjustedDenominator) * 1000) / 10);
        return {
          ...rec,
          excusedLeaves: updatedLeaves,
          effectivePercentage: newEffective,
        };
      })
    );
    showNotification(`Official leave submitted. Denominator adjusted for ${sessionsCount} sessions.`, "success");
  };

  // Parliamentary Voting
  const castVote = (agendaId: string, vote: "FOR" | "AGAINST" | "ABSTAIN") => {
    const agenda = agendas.find((a) => a.id === agendaId);
    if (!agenda) return { success: false, error: "Agenda not found" };

    if (agenda.conflictedMembers.includes(currentUser.id)) {
      const err = `[PARLIAMENTARY RECUSAL ENFORCED]: You have a constitutional conflict of interest on this motion. Your voting button is disabled.`;
      showNotification(err, "error");
      return { success: false, error: err };
    }

    setAgendas((prev) =>
      prev.map((ag) => {
        if (ag.id !== agendaId) return ag;
        return {
          ...ag,
          votesInFavor: vote === "FOR" ? ag.votesInFavor + 1 : ag.votesInFavor,
          votesAgainst: vote === "AGAINST" ? ag.votesAgainst + 1 : ag.votesAgainst,
          abstentions: vote === "ABSTAIN" ? ag.abstentions + 1 : ag.abstentions,
        };
      })
    );
    showNotification(`Your vote of "${vote}" on ${agenda.agendaCode} has been recorded on the parliamentary floor.`, "success");
    return { success: true };
  };

  // Petitions
  const signPetition = (petitionId: string) => {
    setPetitions((prev) =>
      prev.map((pet) => {
        if (pet.id !== petitionId) return pet;
        if (pet.signedByUser) {
          showNotification("You have already digitally signed this petition.", "warning");
          return pet;
        }
        const updatedSignatures = pet.currentSignatures + 1;
        const pct = (updatedSignatures / pet.totalEligibleMembers) * 100;
        const thresholdMet = pct >= pet.targetThresholdPercentage;
        showNotification(
          `Digital petition verified & signed. Total signatures: ${updatedSignatures} (${pct.toFixed(1)}%).`,
          "success"
        );
        return {
          ...pet,
          currentSignatures: updatedSignatures,
          signedByUser: true,
          status: thresholdMet ? "THRESHOLD_REACHED" : "ACTIVE",
        };
      })
    );
  };

  const updateProfile = async (
    updatedData: Partial<GovernanceUser>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const mergedUser: GovernanceUser = {
        ...currentUser,
        ...updatedData,
        legalName: updatedData.legalName ? updatedData.legalName.trim() : currentUser.legalName,
        email: updatedData.email ? updatedData.email.trim().toLowerCase() : currentUser.email,
        studentId: updatedData.studentId ? updatedData.studentId.trim() : currentUser.studentId,
        avatarUrl: updatedData.avatarUrl !== undefined ? updatedData.avatarUrl : currentUser.avatarUrl,
        contactPhone: updatedData.contactPhone !== undefined ? updatedData.contactPhone : currentUser.contactPhone,
      };

      setCurrentUser(mergedUser);

      // Persist in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(`soptosur_profile_${currentUser.id}`, JSON.stringify(mergedUser));
        localStorage.setItem("soptosur_custom_profile", JSON.stringify(mergedUser));
      }

      // Call API endpoint
      try {
        await fetch("/api/user/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: currentUser.id,
            studentId: mergedUser.studentId,
            nsuEmail: mergedUser.email,
            legalName: mergedUser.legalName,
            contactPhone: mergedUser.contactPhone,
            avatarUrl: mergedUser.avatarUrl,
          }),
        });
      } catch (apiErr) {
        console.warn("API profile update:", apiErr);
      }

      showNotification("Profile updated and synchronized successfully!", "success");
      return { success: true };
    } catch (err: any) {
      showNotification("Failed to update profile: " + (err?.message || "Error"), "error");
      return { success: false, error: err?.message };
    }
  };

  return (
    <GovernanceContext.Provider
      value={{
        currentUser,
        allPersonas,
        switchPersona,
        toggleActingStatus,
        requisitions,
        approveRequisition,
        disburseRequisition,
        triggerRejection,
        dossiers,
        visibleDossiers,
        convokeTribunal,
        repertoire,
        updateSong,
        attendance,
        issueShowCause,
        submitLeave,
        agendas,
        castVote,
        petitions,
        signPetition,
        rejectionModalTarget,
        submitRejection,
        closeRejectionModal,
        updateProfile,
        notification,
        clearNotification: () => setNotification(null),
      }}
    >
      {children}
    </GovernanceContext.Provider>
  );
}

export function useGovernance() {
  const context = useContext(GovernanceContext);
  if (!context) {
    throw new Error("useGovernance must be used within a GovernanceProvider");
  }
  return context;
}
