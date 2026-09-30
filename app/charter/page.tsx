"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  OFFICIAL_CHARTER_METADATA,
  OFFICIAL_CHARTER_ARTICLES,
  CharterArticle,
} from "@/lib/official-charter";
import {
  ScrollText,
  Shield,
  Search,
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Building,
  FileCheck,
  Scale,
  Users,
  Music,
  Wallet,
  Landmark,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function OfficialCharterPage() {
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors flex items-center space-x-1.5 text-xs font-semibold shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center space-x-2">
              <ScrollText className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                {OFFICIAL_CHARTER_METADATA.organizationNameBn} — {OFFICIAL_CHARTER_METADATA.documentTitleBn}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="hidden md:inline-flex text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700">
              NSU OSA Approved
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Institutional Charter Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50/40 border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-widest">
                <Landmark className="w-4 h-4" />
                <span>{OFFICIAL_CHARTER_METADATA.authority}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {OFFICIAL_CHARTER_METADATA.organizationNameBn}
              </h1>
              <p className="text-xl sm:text-2xl text-blue-700 font-semibold">
                {OFFICIAL_CHARTER_METADATA.documentTitleBn} (Official Charter)
              </p>
              <p className="text-xs sm:text-sm text-slate-600 font-mono">
                {OFFICIAL_CHARTER_METADATA.organizationNameEn} • {OFFICIAL_CHARTER_METADATA.documentTitleEn}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 max-w-md space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-800">
                <Shield className="w-4 h-4" />
                <span>প্রাতিষ্ঠানিক অগ্রাধিকার নীতি (Institutional Priority)</span>
              </div>
              <p className="text-xs text-amber-950/80 leading-relaxed">
                {OFFICIAL_CHARTER_METADATA.priorityPolicy}
              </p>
            </div>
          </div>
        </section>

        {/* Controls: Search, Language Switcher, and Article Quick Selector */}
        <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="ধারা বা বিষয় খুঁজুন (যেমন: কোরাম, অনাস্থা, অডিট)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              />
            </div>

            {/* Language Mode Toggle */}
            <div className="flex items-center space-x-1.5 bg-slate-100 border border-slate-200 p-1 rounded-xl text-xs">
              <button
                onClick={() => setLanguageMode("BOTH")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  languageMode === "BOTH"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                দ্বিভাষিক (Both)
              </button>
              <button
                onClick={() => setLanguageMode("BN")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  languageMode === "BN"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                বাংলা (Bengali)
              </button>
              <button
                onClick={() => setLanguageMode("EN")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  languageMode === "EN"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
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
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
              }`}
            >
              সকল ধারা (All 14)
            </button>
            {OFFICIAL_CHARTER_ARTICLES.map((art) => (
              <button
                key={art.number}
                onClick={() => setSelectedArticleNum(art.number)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedArticleNum === art.number
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                }`}
              >
                ধারা {art.number}
              </button>
            ))}
          </div>
        </section>

        {/* Article Cards */}
        <section className="space-y-6">
          {filteredArticles.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
              <Scale className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-sm font-semibold text-slate-700">কোনো ধারা মেলেনি</div>
              <p className="text-xs text-slate-500">আপনার অনুসন্ধানের সাথে কোনো ধারা খুঁজে পাওয়া যায়নি।</p>
            </div>
          ) : (
            filteredArticles.map((art) => (
              <article
                key={art.number}
                id={`article-${art.number}`}
                className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs hover:border-slate-300 transition-colors"
              >
                {/* Article Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Article {art.number}
                      </span>
                      {art.number === 1 && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Single Supervisor
                        </span>
                      )}
                      {art.number === 9 && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          Multi-Signature Banking
                        </span>
                      )}
                      {art.number === 12 && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                          Artistic Firewall
                        </span>
                      )}
                    </div>
                    {(languageMode === "BOTH" || languageMode === "BN") && (
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        {art.titleBn}
                      </h2>
                    )}
                    {(languageMode === "BOTH" || languageMode === "EN") && (
                      <h3 className="text-sm sm:text-base font-semibold text-blue-700 font-mono">
                        {art.titleEn}
                      </h3>
                    )}
                  </div>

                  {/* Cross-reference link to dashboard */}
                  <div className="flex-shrink-0">
                    {art.number === 1 && (
                      <Link
                        href="/dashboard"
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors shadow-xs"
                      >
                        <span>View Org Blueprint</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {art.number === 9 && (
                      <Link
                        href="/dashboard/president"
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors shadow-xs"
                      >
                        <span>Dual-Sig Console</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {art.number === 10 && (
                      <Link
                        href="/dashboard/advisor"
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-purple-800 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 transition-colors shadow-xs"
                      >
                        <span>Whistleblower Desk</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {art.number === 12 && (
                      <Link
                        href="/dashboard/departments"
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors shadow-xs"
                      >
                        <span>Section 12 Studio</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {(art.number === 2 || art.number === 7) && (
                      <Link
                        href="/dashboard/member"
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-cyan-800 hover:text-cyan-900 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-xl border border-cyan-200 transition-colors shadow-xs"
                      >
                        <span>Attendance & Quorum</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Article Specific Renderers (e.g. Table for धारा ১ & ধারা ১০) */}
                {art.number === 1 && (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                        <tr>
                          <th className="px-4 py-2.5">স্তর (Tier)</th>
                          <th className="px-4 py-2.5">পদবী / বিভাগ (Designation / Department)</th>
                          <th className="px-4 py-2.5">তদারককারী / কার নিকট রিপোর্ট করবেন (Direct Superior)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-mono font-bold text-purple-700">স্তর ১</td>
                          <td className="px-4 py-2 font-semibold text-slate-900">ফ্যাকাল্টি অ্যাডভাইজর</td>
                          <td className="px-4 py-2 text-slate-600">নর্থ সাউথ বিশ্ববিদ্যালয় প্রশাসন (OSA)</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-mono font-bold text-blue-700">স্তর ২</td>
                          <td className="px-4 py-2 font-semibold text-slate-900">সভাপতি (President)</td>
                          <td className="px-4 py-2 text-slate-600">ফ্যাকাল্টি অ্যাডভাইজর</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-mono font-bold text-cyan-700">স্তর ৩</td>
                          <td className="px-4 py-2 font-semibold text-slate-900">সহ-সভাপতি (Vice President)</td>
                          <td className="px-4 py-2 text-slate-600">সভাপতি</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-mono font-bold text-cyan-700">স্তর ৩</td>
                          <td className="px-4 py-2 font-semibold text-slate-900">সাধারণ সম্পাদক (General Secretary)</td>
                          <td className="px-4 py-2 text-slate-600">সভাপতি</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-mono font-bold text-cyan-700">স্তর ৩</td>
                          <td className="px-4 py-2 font-semibold text-slate-900">কোষাধ্যক্ষ (Treasurer)</td>
                          <td className="px-4 py-2 text-slate-600">সভাপতি</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-mono font-bold text-emerald-700">স্তর ৪</td>
                          <td className="px-4 py-2 font-semibold text-slate-900">সঙ্গীত ও পারফরম্যান্স বিভাগ</td>
                          <td className="px-4 py-2 text-slate-600">সহ-সভাপতি</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-mono font-bold text-emerald-700">স্তর ৪</td>
                          <td className="px-4 py-2 font-semibold text-slate-900">ইভেন্ট ও লজিস্টিক্স বিভাগ</td>
                          <td className="px-4 py-2 text-slate-600">সহ-সভাপতি</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-mono font-bold text-emerald-700">স্তর ৪</td>
                          <td className="px-4 py-2 font-semibold text-slate-900">মিডিয়া ও ডিজাইন বিভাগ</td>
                          <td className="px-4 py-2 text-slate-600">সাধারণ সম্পাদক</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-mono font-bold text-emerald-700">স্তর ৪</td>
                          <td className="px-4 py-2 font-semibold text-slate-900">সদস্য ব্যবস্থাপনা ও অভ্যন্তরীণ শৃঙ্খলা বিভাগ</td>
                          <td className="px-4 py-2 text-slate-600">সাধারণ সম্পাদক</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-mono font-bold text-emerald-700">স্তর ৪</td>
                          <td className="px-4 py-2 font-semibold text-slate-900">স্পনসরশিপ ও পার্টনারশিপ বিভাগ</td>
                          <td className="px-4 py-2 text-slate-600">কোষাধ্যক্ষ</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-mono font-bold text-slate-500">স্তর ৫</td>
                          <td className="px-4 py-2 font-semibold text-slate-900">কো-অর্ডিনেটর ও সাধারণ সদস্য/শিল্পী</td>
                          <td className="px-4 py-2 text-slate-600">সংশ্লিষ্ট বিভাগীয় প্রধান</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {art.number === 10 && (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                        <tr>
                          <th className="px-4 py-2.5">অভিযুক্ত পদ</th>
                          <th className="px-4 py-2.5">তদন্তকারী কর্তৃপক্ষ</th>
                          <th className="px-4 py-2.5">চূড়ান্ত সিদ্ধান্ত গ্রহণকারী</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-bold text-emerald-700">বিভাগীয় প্রধান</td>
                          <td className="px-4 py-2">সংশ্লিষ্ট তত্ত্বাবধায়ক কর্মকর্তা (তিনি স্বার্থসংশ্লিষ্ট হলে সহ-সভাপতি ও অন্য একজন নিরপেক্ষ কর্মকর্তা)</td>
                          <td className="px-4 py-2 font-medium">নির্বাহী পরিষদ (স্বার্থসংশ্লিষ্ট কর্মকর্তা বাদে)</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-bold text-cyan-700">সহ-সভাপতি / কোষাধ্যক্ষ</td>
                          <td className="px-4 py-2">সভাপতি ও সাধারণ সম্পাদক</td>
                          <td className="px-4 py-2 font-medium">ফ্যাকাল্টি অ্যাডভাইজরের পরামর্শক্রমে নির্বাহী পরিষদ</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-bold text-cyan-700">সাধারণ সম্পাদক</td>
                          <td className="px-4 py-2">সভাপতি ও সহ-সভাপতি</td>
                          <td className="px-4 py-2 font-medium">ফ্যাকাল্টি অ্যাডভাইজরের পরামর্শক্রমে নির্বাহী পরিষদ</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-bold text-blue-700">সভাপতি</td>
                          <td className="px-4 py-2">ফ্যাকাল্টি অ্যাডভাইজর কর্তৃক গঠিত ৩ সদস্যের নিরপেক্ষ প্যানেল (অ্যাডভাইজর নিজে থাকবেন না; ২ শিক্ষক/কর্মকর্তা ও ১ নিরপেক্ষ জ্যেষ্ঠ সদস্য বা অন্য ক্লাবের প্রতিনিধি)</td>
                          <td className="px-4 py-2 font-medium">প্যানেলের সুপারিশের ভিত্তিতে ফ্যাকাল্টি অ্যাডভাইজর কর্তৃক ব্যবস্থা (সতর্কীকরণ, সাময়িক স্থগিতাদেশ বা ধারা ৪ অনুযায়ী অপসারণের সুপারিশ)</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="px-4 py-2 font-bold text-purple-700">ফ্যাকাল্টি অ্যাডভাইজর</td>
                          <td className="px-4 py-2">NSU Office of Student Affairs / প্রক্টর অফিস (নির্বাহী পরিষদের ন্যূনতম ৩ কর্মকর্তার যৌথ লিখিত আবেদনে)</td>
                          <td className="px-4 py-2 font-medium">(OSA) / প্রক্টর অফিস কর্তৃক নির্ধারিত কর্তৃপক্ষ</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Article Sections & Clauses */}
                <div className="space-y-4">
                  {art.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-2">
                      {sec.heading && (
                        <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                          <span>{sec.heading}</span>
                        </h4>
                      )}
                      <div className="space-y-1.5 pl-3 border-l-2 border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {sec.content.map((clause, cIdx) => (
                          <p key={cIdx} className="hover:text-slate-900 transition-colors">
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

        {/* Institutional Signatures Block (Page 6 Reproduction) */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
          <div className="space-y-1 border-b border-slate-200 pb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <span>প্রাতিষ্ঠানিক অনুমোদন ও স্বাক্ষর (Institutional Approval & Signatures)</span>
            </h2>
            <p className="text-xs text-slate-500">
              অত্র গঠনতন্ত্রের ধারা ১৪ অনুযায়ী অনুমোদিত এবং স্থায়ী সনদে রক্ষিত মূল স্বাক্ষর তালিকা।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                ফ্যাকাল্টি অ্যাডভাইজর
              </div>
              <div className="text-sm font-bold text-slate-900">Dr. Sarah Mostafa</div>
              <div className="text-xs text-slate-500 font-mono">Faculty ID: FA-9001</div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved & Signed</span>
                </span>
                <span className="font-mono text-slate-400">2026-09-01</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                প্রতিষ্ঠাতা সভাপতি
              </div>
              <div className="text-sm font-bold text-slate-900">Tanzim Ahmed</div>
              <div className="text-xs text-slate-500 font-mono">Student ID: 2110001</div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved & Signed</span>
                </span>
                <span className="font-mono text-slate-400">2026-09-01</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider">
                প্রতিষ্ঠাতা সহ-সভাপতি
              </div>
              <div className="text-sm font-bold text-slate-900">Nafis Rahman</div>
              <div className="text-xs text-slate-500 font-mono">Student ID: 2110002</div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved & Signed</span>
                </span>
                <span className="font-mono text-slate-400">2026-09-01</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider">
                প্রতিষ্ঠাতা সাধারণ সম্পাদক
              </div>
              <div className="text-sm font-bold text-slate-900">Anika Tabassum</div>
              <div className="text-xs text-slate-500 font-mono">Student ID: 2110003</div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved & Signed</span>
                </span>
                <span className="font-mono text-slate-400">2026-09-01</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-[11px] font-bold text-cyan-700 uppercase tracking-wider">
                প্রতিষ্ঠাতা কোষাধ্যক্ষ
              </div>
              <div className="text-sm font-bold text-slate-900">Zubair Hassan</div>
              <div className="text-xs text-slate-500 font-mono">Student ID: 2110004</div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approved & Signed</span>
                </span>
                <span className="font-mono text-slate-400">2026-09-01</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center items-center text-center space-y-2">
              <Landmark className="w-8 h-8 text-blue-600" />
              <div className="text-xs font-bold text-slate-900">Office of Student Affairs (OSA)</div>
              <div className="text-[11px] text-slate-500">North South University Registry</div>
              <div className="text-[10px] font-mono text-emerald-700 font-bold">Registered: Fall 2026</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
