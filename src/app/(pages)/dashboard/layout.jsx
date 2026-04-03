"use client";

import React from "react";
import TopNav from "@/src/components/dashboard/TopNav";
import Sidebar from "@/src/components/dashboard/Sidebar";
import TrendingSidebar from "@/src/components/dashboard/TrendingSidebar";
import SuggestedUsers from "@/src/components/dashboard/SuggestedUsers";
import DashboardBackground from "@/src/components/dashboard/DashboardBackground";
import { SocketProvider } from "@/src/context/SocketContext";

const DashboardLayout = ({ children }) => {
  return (
    <SocketProvider>
      <div className="h-[100dvh] w-full bg-transparent flex flex-col overflow-hidden relative">
        <DashboardBackground />
        
        {/* All content wrapped relative to sit above the fixed 3D background */}
        <div className="relative z-10 flex flex-col h-full w-full pointer-events-none bg-transparent backdrop-blur-md">
          {/* Global Header */}
          <div className="shrink-0 pointer-events-auto bg-transparent backdrop-blur-md border-b border-[var(--accents-2)]">
            <TopNav />
          </div>

          <div className="flex-1 flex overflow-hidden pointer-events-auto bg-transparent backdrop-blur-md">
            {/* Left Nav Sidebar */}
            <div className="hidden md:block shrink-0 h-full border-r border-[var(--accents-2)]">
              <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Note: Kept background transparent to let the subtle 3D Grid show through */}
              <div className="flex-1 overflow-y-auto bg-transparent backdrop-blur-md">
                <main className="w-full max-w-[1000px] mx-auto px-2 md:px-4 py-6">
                  {children}
                </main>
              </div>

              {/* Right Panel — Trending + Suggested */}
              <div className="hidden xl:flex flex-col w-72 shrink-0 border-l border-[var(--accents-2)] overflow-y-auto bg-[var(--geist-background)]/40 backdrop-blur-md">
                <TrendingSidebar />
                <div className="border-t border-[var(--accents-2)]">
                  <SuggestedUsers />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SocketProvider>
  );
};

export default DashboardLayout;
