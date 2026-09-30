"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  OFFICIAL_CHARTER_METADATA,
  OFFICIAL_CHARTER_ARTICLES,
  OFFICIAL_OPERATIONAL_ANNEXURES,
  OFFICIAL_COVER_LETTER,
} from "@/lib/official-charter";
import {
  ScrollText,
  Shield,
  Search,
  ArrowLeft,
  FileCheck,
  Scale,
  Landmark,
  ChevronRight,
  FileSpreadsheet,
  Mail,
  AlertCircle,
} from "lucide-react";

export default function OfficialCharterPage() {
  const [activeMainTab, setActiveMainTab] = useState<"ARTICLES" | "ANNEXURES" | "COVER_LETTER">(
    "ARTICLES"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticleNum, setSelectedArticleNum] = useState<number | null>(null);
  const [languageMode, setLanguageMode] = useState<"BOTH" | "BN" | "EN">("BOTH");

  // Filter articles based on query
  const filteredArticles = OFFICIAL_CHARTER_ARTICLES.filter((art) => {
    if (selectedArticleNum !== null && art.number !== selectedArticleNum) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch =
      art.titleBn.toLowerCase().includes(q) || art.titleEn.toLowerCase().includes(q);
    const contentMatch = art.sections.some(
      (sec) =>
        (sec.heading && sec.heading.toLowerCase().includes(q)) ||
        sec.content.some((c) => c.toLowerCase().includes(q))
    );
    return titleMatch || contentMatch;
  });

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2A1A10] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full border-b border-[#E8E2D8] bg-[#FDFBF7]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-white border border-[#E8E2D8] text-[#5A4D41] hover:text-[#2A1A10] hover:bg-[#F5F1E8] transition-colors flex items-center space-x-1.5 text-xs font-semibold shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#8B3A0F]" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="h-5 w-px bg-[#E8E2D8] hidden sm:block" />
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-[#8B3A0F]/10 border border-[#8B3A0F]/20 flex items-center justify-center p-1">
                <img src="/soptosur-logo.svg" alt="Soptosur" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-[#2A1A10] text-sm sm:text-base tracking-tight">
                {OFFICIAL_CHARTER_METADATA.organizationNameBn} — {OFFICIAL_CHARTER_METADATA.documentTitleBn}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="hidden md:inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#8B3A0F]/10 border border-[#8B3A0F]/20 text-[#8B3A0F]">
              NSU OSA Approved Charter
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Institutional Charter Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FAF4EE] via-[#FDFBF7] to-[#F5ECE2] border border-[#E8E2D8] p-6 sm:p-10 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#8B3A0F] uppercase tracking-widest">
                <Landmark className="w-4 h-4" />
                <span>{OFFICIAL_CHARTER_METADATA.authority}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2A1A10] tracking-tight leading-tight">
                {OFFICIAL_CHARTER_METADATA.organizationNameBn}
              </h1>
              <p className="text-xl sm:text-2xl text-[#8B3A0F] font-semibold">
                {OFFICIAL_CHARTER_METADATA.documentTitleBn} (Official Charter)
              </p>
              <p className="text-xs sm:text-sm text-[#7A6A58] font-mono">
                {OFFICIAL_CHARTER_METADATA.organizationNameEn} • {OFFICIAL_CHARTER_METADATA.documentTitleEn}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F5F1E8] border border-[#E0D7C9] max-w-md space-y-2 shadow-2xs">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#8B3A0F]">
                <Shield className="w-4 h-4" />
                <span>প্রাতিষ্ঠানিক অগ্রাধিকার নীতি (Institutional Supremacy)</span>
              </div>
              <p className="text-xs text-[#5A4D41] leading-relaxed">
                {OFFICIAL_CHARTER_METADATA.priorityPolicy}
              </p>
            </div>
          </div>
        </section>

        {/* Top View Selector Tabs (Articles vs. Operational Annexures vs. Cover Letter) */}
        <section className="flex flex-wrap items-center gap-2 border-b border-[#E8E2D8] pb-4">
          <button
            onClick={() => setActiveMainTab("ARTICLES")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeMainTab === "ARTICLES"
                ? "bg-[#8B3A0F] text-white shadow-xs"
                : "bg-white border border-[#E8E2D8] text-[#5A4D41] hover:text-[#2A1A10] hover:bg-[#F5F1E8]"
            }`}
          >
            <ScrollText className="w-4 h-4" />
            <span>মূল গঠনতন্ত্র (১৫টি পূর্ণাঙ্গ ধারা)</span>
          </button>

          <button
            onClick={() => setActiveMainTab("ANNEXURES")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeMainTab === "ANNEXURES"
                ? "bg-[#8B3A0F] text-white shadow-xs"
                : "bg-white border border-[#E8E2D8] text-[#5A4D41] hover:text-[#2A1A10] hover:bg-[#F5F1E8]"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>প্রশাসনিক পরিশিষ্টসমূহ (পরিশিষ্ট ক, খ, গ)</span>
          </button>

          <button
            onClick={() => setActiveMainTab("COVER_LETTER")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeMainTab === "COVER_LETTER"
                ? "bg-[#8B3A0F] text-white shadow-xs"
                : "bg-white border border-[#E8E2D8] text-[#5A4D41] hover:text-[#2A1A10] hover:bg-[#F5F1E8]"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>অফিসিয়াল কভার লেটার (OSA Cover Letter)</span>
          </button>
        </section>

        {/* Tab 1: Articles 1 to 15 */}
        {activeMainTab === "ARTICLES" && (
          <div className="space-y-6">
            {/* Search and Language Selector */}
            <section className="bg-white border border-[#E8E2D8] rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xs">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative w-full md:w-96">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#A89A88]" />
                  <input
                    type="text"
                    placeholder="ধারা বা বিষয় খুঁজুন (যেমন: কোরাম, অনাস্থা, অডিট, লজিস্টিক্স)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D8] rounded-xl pl-10 pr-4 py-2 text-xs text-[#2A1A10] placeholder-[#A89A88] focus:outline-none focus:border-[#8B3A0F] focus:bg-white transition-colors"
                  />
                </div>

                {/* Language Mode Toggle */}
                <div className="flex items-center space-x-1.5 bg-[#F5F1E8] border border-[#E8E2D8] p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setLanguageMode("BOTH")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      languageMode === "BOTH"
                        ? "bg-[#8B3A0F] text-white shadow-2xs"
                        : "text-[#5A4D41] hover:text-[#2A1A10]"
                    }`}
                  >
                    দ্বিভাষিক (Both)
                  </button>
                  <button
                    onClick={() => setLanguageMode("BN")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      languageMode === "BN"
                        ? "bg-[#8B3A0F] text-white shadow-2xs"
                        : "text-[#5A4D41] hover:text-[#2A1A10]"
                    }`}
                  >
                    বাংলা (Bengali)
                  </button>
                  <button
                    onClick={() => setLanguageMode("EN")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      languageMode === "EN"
                        ? "bg-[#8B3A0F] text-white shadow-2xs"
                        : "text-[#5A4D41] hover:text-[#2A1A10]"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Article Pill Filter */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-thin">
                <button
                  onClick={() => setSelectedArticleNum(null)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedArticleNum === null
                      ? "bg-[#8B3A0F] text-white"
                      : "bg-[#F5F1E8] border border-[#E8E2D8] text-[#5A4D41] hover:text-[#2A1A10] hover:bg-[#EFE9DF]"
                  }`}
                >
                  সকল ১৫টি ধারা (All 15)
                </button>
                {OFFICIAL_CHARTER_ARTICLES.map((art) => (
                  <button
                    key={art.number}
                    onClick={() => setSelectedArticleNum(art.number)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedArticleNum === art.number
                        ? "bg-[#8B3A0F] text-white"
                        : "bg-[#F5F1E8] border border-[#E8E2D8] text-[#5A4D41] hover:text-[#2A1A10] hover:bg-[#EFE9DF]"
                    }`}
                  >
                    ধারা {art.number}
                  </button>
                ))}
              </div>
            </section>

            {/* Articles List */}
            <section className="space-y-6">
              {filteredArticles.length === 0 ? (
                <div className="p-12 text-center bg-white border border-[#E8E2D8] rounded-2xl space-y-2 shadow-2xs">
                  <Scale className="w-8 h-8 text-[#A89A88] mx-auto" />
                  <div className="text-sm font-semibold text-[#2A1A10]">কোনো ধারা মেলেনি</div>
                  <p className="text-xs text-[#7A6A58]">
                    আপনার অনুসন্ধানের সাথে কোনো ধারা খুঁজে পাওয়া যায়নি।
                  </p>
                </div>
              ) : (
                filteredArticles.map((art) => (
                  <article
                    key={art.number}
                    id={`article-${art.number}`}
                    className="bg-white border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs hover:border-[#8B3A0F]/30 transition-colors"
                  >
                    {/* Article Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D8]">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8B3A0F]/10 text-[#8B3A0F] border border-[#8B3A0F]/20">
                            Article {art.number}
                          </span>
                          {art.number === 1 && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Single Supervisor
                            </span>
                          )}
                          {art.number === 9 && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                              Multi-Sig Banking
                            </span>
                          )}
                          {art.number === 12 && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                              Section 12 Creative Firewall
                            </span>
                          )}
                        </div>
                        {(languageMode === "BOTH" || languageMode === "BN") && (
                          <h2 className="text-xl sm:text-2xl font-bold text-[#2A1A10] tracking-tight">
                            {art.titleBn}
                          </h2>
                        )}
                        {(languageMode === "BOTH" || languageMode === "EN") && (
                          <h3 className="text-sm sm:text-base font-semibold text-[#8B3A0F] font-mono">
                            {art.titleEn}
                          </h3>
                        )}
                      </div>

                      {/* Quick links to active consoles */}
                      <div className="flex-shrink-0">
                        {art.number === 1 && (
                          <Link
                            href="/dashboard"
                            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#8B3A0F] hover:text-[#682907] bg-[#FAF4EE] hover:bg-[#F5ECE2] px-3 py-1.5 rounded-xl border border-[#E0D2C4] transition-colors shadow-2xs"
                          >
                            <span>View 5-Tier Blueprint</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        {art.number === 9 && (
                          <Link
                            href="/dashboard/president"
                            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors shadow-2xs"
                          >
                            <span>Dual-Sig Console</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        {art.number === 10 && (
                          <Link
                            href="/dashboard/advisor"
                            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-purple-800 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition-colors shadow-2xs"
                          >
                            <span>Tribunal Desk</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        {art.number === 12 && (
                          <Link
                            href="/dashboard/departments"
                            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors shadow-2xs"
                          >
                            <span>Section 12 Studio</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Article Sections & Clauses */}
                    <div className="space-y-4">
                      {art.sections.map((sec, sIdx) => (
                        <div key={sIdx} className="space-y-2">
                          {sec.heading && (
                            <h4 className="text-sm font-bold text-[#2A1A10] flex items-center space-x-2">
                              <span className="w-2 h-2 rounded-full bg-[#8B3A0F] inline-block" />
                              <span>{sec.heading}</span>
                            </h4>
                          )}
                          <div className="space-y-2 pl-3 border-l-2 border-[#E8E2D8] text-xs sm:text-sm text-[#4A3E33] leading-relaxed">
                            {sec.content.map((clause, cIdx) => (
                              <p key={cIdx} className="hover:text-[#2A1A10] transition-colors">
                                {clause}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                ))
              )}
            </section>

            {/* Official Genesis Institutional Vacancy Notice & Signature Roster */}
            <section className="bg-white border border-[#E8E2D8] rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xs">
              <div className="space-y-1 border-b border-[#E8E2D8] pb-4">
                <div className="flex items-center space-x-2 text-[10px] font-bold text-[#8B3A0F] uppercase tracking-wider px-2 py-0.5 rounded bg-[#8B3A0F]/10 border border-[#8B3A0F]/20 w-fit">
                  <span>Constitutional Article 15</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#2A1A10] flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-[#8B3A0F]" />
                  <span>কার্যকর হওয়ার তারিখ ও প্রাতিষ্ঠানিক স্বাক্ষর (Enactment & Signatures)</span>
                </h2>
                <p className="text-xs text-[#7A6A58]">
                  অত্র গঠনতন্ত্রের ধারা ১৫ অনুযায়ী নর্থ সাউথ ইউনিভার্সিটির Office of Student Affairs (OSA)-এর আনুষ্ঠানিক অনুমোদন ও নিবন্ধনের তারিখ থেকে কার্যকর হবে।
                </p>
              </div>

              {/* Pure Vacant Roster - No Mock or Simulated Names */}
              <div className="p-4 rounded-2xl bg-[#FAF4EE] border border-[#E0D2C4] flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-[#8B3A0F] flex-shrink-0 mt-0.5" />
                <div className="text-xs text-[#5A4D41] space-y-1">
                  <span className="font-bold text-[#2A1A10]">
                    অফিসিয়াল শূন্যপদ ও অপেক্ষমাণ প্রোটোকল (Official Constitutional Vacancy State):
                  </span>
                  <p className="leading-relaxed">
                    সংগঠনের সকল পদ প্রাতিষ্ঠানিকভাবে শূন্য (VACANT)। OSA কর্তৃক আনুষ্ঠানিকভাবে অনুমোদন এবং ধারা ৮-এর নির্বাচন/মনোনয়ন প্রক্রিয়া ব্যতীত কোনো পদে শিক্ষার্থী নিয়োগ কার্যকর হবে না। কোনো অসত্য বা ফেক নাম সনদে অন্তর্ভুক্ত করা সম্পূর্ণ নিষিদ্ধ।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] space-y-2">
                  <div className="text-[11px] font-bold text-[#8B3A0F] uppercase tracking-wider">
                    ফ্যাকাল্টি অ্যাডভাইজর
                  </div>
                  <div className="text-sm font-bold text-[#2A1A10]">VACANT (পদ শূন্য)</div>
                  <div className="text-xs text-[#7A6A58] font-mono">আইডি: UNASSIGNED</div>
                  <div className="pt-2 border-t border-[#E8E2D8] text-[11px] text-[#8B3A0F] font-semibold">
                    <span>OSA অনুমোদন ও দায়িত্বগ্রহণের অপেক্ষায়</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] space-y-2">
                  <div className="text-[11px] font-bold text-[#8B3A0F] uppercase tracking-wider">
                    প্রতিষ্ঠাতা সভাপতি
                  </div>
                  <div className="text-sm font-bold text-[#2A1A10]">VACANT (পদ শূন্য)</div>
                  <div className="text-xs text-[#7A6A58] font-mono">শিক্ষার্থী আইডি: UNASSIGNED</div>
                  <div className="pt-2 border-t border-[#E8E2D8] text-[11px] text-[#8B3A0F] font-semibold">
                    <span>ধারা ৮ নির্বাচনী প্রক্রিয়া সাপেক্ষে পূরণযোগ্য</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] space-y-2">
                  <div className="text-[11px] font-bold text-[#8B3A0F] uppercase tracking-wider">
                    প্রতিষ্ঠাতা সহ-সভাপতি
                  </div>
                  <div className="text-sm font-bold text-[#2A1A10]">VACANT (পদ শূন্য)</div>
                  <div className="text-xs text-[#7A6A58] font-mono">শিক্ষার্থী আইডি: UNASSIGNED</div>
                  <div className="pt-2 border-t border-[#E8E2D8] text-[11px] text-[#8B3A0F] font-semibold">
                    <span>ধারা ৮ নির্বাচনী প্রক্রিয়া সাপেক্ষে পূরণযোগ্য</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] space-y-2">
                  <div className="text-[11px] font-bold text-[#8B3A0F] uppercase tracking-wider">
                    প্রতিষ্ঠাতা সাধারণ সম্পাদক
                  </div>
                  <div className="text-sm font-bold text-[#2A1A10]">VACANT (পদ শূন্য)</div>
                  <div className="text-xs text-[#7A6A58] font-mono">শিক্ষার্থী আইডি: UNASSIGNED</div>
                  <div className="pt-2 border-t border-[#E8E2D8] text-[11px] text-[#8B3A0F] font-semibold">
                    <span>ধারা ৮ নির্বাচনী প্রক্রিয়া সাপেক্ষে পূরণযোগ্য</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] space-y-2">
                  <div className="text-[11px] font-bold text-[#8B3A0F] uppercase tracking-wider">
                    প্রতিষ্ঠাতা কোষাধ্যক্ষ
                  </div>
                  <div className="text-sm font-bold text-[#2A1A10]">VACANT (পদ শূন্য)</div>
                  <div className="text-xs text-[#7A6A58] font-mono">শিক্ষার্থী আইডি: UNASSIGNED</div>
                  <div className="pt-2 border-t border-[#E8E2D8] text-[11px] text-[#8B3A0F] font-semibold">
                    <span>ধারা ৮ নির্বাচনী প্রক্রিয়া সাপেক্ষে পূরণযোগ্য</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex flex-col justify-center items-center text-center space-y-2">
                  <Landmark className="w-8 h-8 text-[#8B3A0F]" />
                  <div className="text-xs font-bold text-[#2A1A10]">Office of Student Affairs (OSA)</div>
                  <div className="text-[11px] text-[#7A6A58]">North South University Registry</div>
                  <div className="text-[10px] font-mono text-[#8B3A0F] font-bold">Registration: Pending Approval</div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Operational Annexures */}
        {activeMainTab === "ANNEXURES" && (
          <div className="space-y-8">
            <div className="p-6 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs space-y-2">
              <h2 className="text-lg font-bold text-[#2A1A10] flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-[#8B3A0F]" />
                <span>প্রাতিষ্ঠানিক প্রশাসনিক পরিশিষ্টসমূহ (Official Operational Annexures)</span>
              </h2>
              <p className="text-xs text-[#7A6A58] leading-relaxed">
                গঠনতন্ত্রের ধারা ৫.৩ ও ৯.৪ অনুযায়ী বাদ্যযন্ত্র স্থানান্তর, আর্থিক ব্যয় রিকুইজিশন এবং অ-নগদ স্পনসরশিপ ট্র্যাকিংয়ের জন্য নির্ধারিত ৩টি অপরিহার্য ফরম।
              </p>
            </div>

            <div className="space-y-6">
              {OFFICIAL_OPERATIONAL_ANNEXURES.map((annex) => (
                <div
                  key={annex.id}
                  className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs space-y-6"
                >
                  <div className="border-b border-[#E8E2D8] pb-4 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#8B3A0F]/10 text-[#8B3A0F] border border-[#8B3A0F]/20">
                      {annex.annexureCode}
                    </span>
                    <h3 className="text-lg font-bold text-[#2A1A10]">{annex.titleBn}</h3>
                    <p className="text-xs font-mono text-[#8B3A0F]">{annex.titleEn}</p>
                    <p className="text-xs text-[#7A6A58]">{annex.referenceClause}</p>
                  </div>

                  {/* Form Blueprint Representation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {annex.fields.map((f, fIdx) => (
                      <div key={fIdx} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] space-y-1">
                        <div className="text-xs font-semibold text-[#2A1A10] flex items-center justify-between">
                          <span>{f.labelBn}</span>
                          <span className="text-[10px] text-[#A89A88] font-mono">{f.labelEn}</span>
                        </div>
                        {f.description && (
                          <div className="text-[11px] text-[#7A6A58]">{f.description}</div>
                        )}
                        <div className="pt-1">
                          <input
                            type="text"
                            disabled
                            placeholder="অফিসিয়াল নথিবদ্ধকরণের জন্য সংরক্ষিত"
                            className="w-full bg-white border border-[#E0D7C9] rounded-lg px-2.5 py-1 text-xs text-[#8C7E72] cursor-not-allowed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Undertaking if any */}
                  {annex.undertakingBn && (
                    <div className="p-4 rounded-xl bg-[#FAF4EE] border border-[#E0D2C4] text-xs text-[#5A4D41] leading-relaxed">
                      <span className="font-bold text-[#8B3A0F]">আইনি বাধ্যবাধকতা: </span>
                      {annex.undertakingBn}
                    </div>
                  )}

                  {/* Operational Notes */}
                  {annex.notesBn && annex.notesBn.length > 0 && (
                    <div className="p-3 rounded-xl bg-[#F5F1E8] border border-[#E8E2D8] text-xs text-[#5A4D41] space-y-1">
                      <span className="font-bold text-[#2A1A10]">প্রশাসনিক নোট:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                        {annex.notesBn.map((note, nIdx) => (
                          <li key={nIdx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Official Cover Letter */}
        {activeMainTab === "COVER_LETTER" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-10 rounded-3xl bg-white border border-[#E8E2D8] shadow-2xs space-y-6 max-w-4xl mx-auto">
              <div className="text-right text-xs font-mono text-[#7A6A58] border-b border-[#E8E2D8] pb-3">
                তারিখ: {OFFICIAL_COVER_LETTER.date}
              </div>

              {/* Recipient */}
              <div className="space-y-1 text-xs text-[#2A1A10]">
                <div className="font-bold">বরাবর,</div>
                <div className="font-bold text-sm text-[#8B3A0F]">{OFFICIAL_COVER_LETTER.recipient.designation}</div>
                <div>{OFFICIAL_COVER_LETTER.recipient.department}</div>
                <div>{OFFICIAL_COVER_LETTER.recipient.institution}</div>
                <div className="text-[#7A6A58]">{OFFICIAL_COVER_LETTER.recipient.address}</div>
              </div>

              {/* Subject */}
              <div className="p-3.5 rounded-xl bg-[#FAF4EE] border border-[#E0D2C4] text-xs text-[#2A1A10] font-bold leading-relaxed">
                বিষয়: {OFFICIAL_COVER_LETTER.subject}
              </div>

              {/* Body */}
              <div className="space-y-3 text-xs sm:text-sm text-[#4A3E33] leading-relaxed">
                <div className="font-bold text-[#2A1A10]">{OFFICIAL_COVER_LETTER.salutation}</div>
                {OFFICIAL_COVER_LETTER.bodyParagraphs.map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>

              {/* Attachments */}
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] space-y-2 text-xs">
                <div className="font-bold text-[#2A1A10]">সংযুক্তি:</div>
                <ul className="space-y-1 text-[#5A4D41]">
                  {OFFICIAL_COVER_LETTER.attachments.map((att, aIdx) => (
                    <li key={aIdx} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8B3A0F]" />
                      <span>{att}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Signatures */}
              <div className="pt-6 border-t border-[#E8E2D8] grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
                <div className="space-y-2">
                  <div className="font-bold text-[#5A4D41]">বিনীত,</div>
                  <div className="h-12 border-b border-dashed border-[#A89A88]" />
                  <div className="font-bold text-[#2A1A10]">{OFFICIAL_COVER_LETTER.signatory.roleBn}, {OFFICIAL_COVER_LETTER.signatory.clubName}</div>
                  <div className="text-[#7A6A58] font-mono">{OFFICIAL_COVER_LETTER.signatory.studentIdPlaceholder}</div>
                  <div className="text-[#7A6A58]">{OFFICIAL_COVER_LETTER.signatory.institution}</div>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-[#5A4D41]">(কাউন্টার-স্বাক্ষর ও সুপারিশ)</div>
                  <div className="h-12 border-b border-dashed border-[#A89A88]" />
                  <div className="font-bold text-[#2A1A10]">{OFFICIAL_COVER_LETTER.countersignatory.roleBn}, {OFFICIAL_COVER_LETTER.countersignatory.clubName}</div>
                  <div className="text-[#7A6A58] font-mono">{OFFICIAL_COVER_LETTER.countersignatory.designationPlaceholder}</div>
                  <div className="text-[#7A6A58]">{OFFICIAL_COVER_LETTER.countersignatory.institution}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
