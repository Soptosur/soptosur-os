"use client";

import React from "react";
import { GlobalNavbar } from "@/components/GlobalNavbar";
import { SidebarDrawer } from "@/components/SidebarDrawer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <GlobalNavbar />
      <div className="flex-1 flex overflow-hidden">
        <SidebarDrawer />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
