"use client";

import React, { useState, useEffect } from "react";
import { useGovernance } from "@/context/GovernanceContext";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Shield,
  CheckCircle2,
  AlertCircle,
  Building,
  GraduationCap,
  Sparkles,
  RefreshCw,
  Upload,
} from "lucide-react";

export default function ProfilePage() {
  const { currentUser, updateProfile } = useGovernance();

  const [legalName, setLegalName] = useState(currentUser.legalName);
  const [studentId, setStudentId] = useState(currentUser.studentId);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.contactPhone || "+8801711000000");
  const [avatarUrl, setAvatarUrl] = useState(
    currentUser.avatarUrl ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        currentUser.legalName
      )}&backgroundColor=2563eb,3b82f6,1d4ed8`
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [avatarInputUrl, setAvatarInputUrl] = useState("");

  useEffect(() => {
    setLegalName(currentUser.legalName);
    setStudentId(currentUser.studentId);
    setEmail(currentUser.email);
    if (currentUser.contactPhone) setPhone(currentUser.contactPhone);
    if (currentUser.avatarUrl) setAvatarUrl(currentUser.avatarUrl);
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const result = await updateProfile({
      legalName,
      studentId,
      email,
      contactPhone: phone,
      avatarUrl,
    });

    setIsSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetPresetAvatar = (seed: string) => {
    const preset = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      seed
    )}&backgroundColor=2563eb,1e40af,4338ca`;
    setAvatarUrl(preset);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Institutional Identity
          </span>
          <span className="text-[10px] font-mono text-slate-500">OSA-VERIFIED-ROSTER</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center space-x-2.5">
          <User className="w-6 h-6 text-blue-600" />
          <span>Member Profile & Identity Management</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your official roster photo, NSU student ID, institutional email address, and verified member credentials.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2.5 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">
            Profile details updated and synchronized with institutional roster successfully.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Profile Card */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-center space-y-4">
            {/* Avatar Preview */}
            <div className="relative inline-block mx-auto">
              <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-md flex items-center justify-center mx-auto">
                <img
                  src={avatarUrl}
                  alt={currentUser.legalName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image URL fails
                    (e.target as any).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      currentUser.legalName
                    )}`;
                  }}
                />
              </div>

              {/* Upload Trigger Label */}
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer transition-all border-2 border-white"
                title="Upload Photo from Device"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">{legalName}</h2>
              <div className="text-xs font-mono font-semibold text-slate-500 mt-0.5">
                {studentId}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Constitutional Tier:</span>
                <span className="font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
                  {currentUser.tierLabel}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Designation:</span>
                <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[170px]">
                  {currentUser.roleTitle}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Department:</span>
                <span className="font-semibold text-slate-800 text-[11px]">
                  {currentUser.department}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Standing Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px]">
                  ACTIVE STANDING
                </span>
              </div>
            </div>

            {/* Avatar URL or Preset Selector */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-left">
              <label className="block text-[11px] font-bold text-slate-600">
                Update Profile Photo:
              </label>

              {/* Direct URL input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  value={avatarInputUrl}
                  onChange={(e) => setAvatarInputUrl(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (avatarInputUrl) {
                      setAvatarUrl(avatarInputUrl);
                      setAvatarInputUrl("");
                    }
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg font-semibold flex-shrink-0"
                >
                  Set
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <span>Presets:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleSetPresetAvatar(currentUser.legalName)}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200"
                  >
                    Initials
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAvatarUrl(
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                          studentId
                        )}`
                      )
                    }
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200"
                  >
                    Bot
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAvatarUrl(
                        `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
                          legalName
                        )}`
                      )
                    }
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200"
                  >
                    Portrait
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
          >
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Edit Personal & Institutional Details
                </h3>
                <p className="text-xs text-slate-500">
                  Update your verified credentials for Soptosur Governance OS and NSU OSA records.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">EDITABLE PROFILE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Legal Name */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Legal Full Name <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="e.g. Abrar Chowdhury"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Student ID */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  NSU Student ID <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 2011234042"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-mono font-semibold"
                  />
                </div>
              </div>

              {/* Authorized Email */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  NSU Official Email <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. abrar.chowdhury@northsouth.edu"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-mono font-semibold"
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+8801700000000"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Profile Photo Direct Input */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Avatar Photo URL
                </label>
                <div className="relative">
                  <Camera className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Read-Only Institutional Governance Record */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Institutional Governance & Conduct Records
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    Constitutional Tier
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {currentUser.tierLabel}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    Assigned Department
                  </span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {currentUser.department}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    Proctorial Clearance
                  </span>
                  <div className="text-sm font-bold text-emerald-600 mt-0.5 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CLEARED (OSA Verified)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Only Save Profile */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
