"use client";

import React from "react";
import TopNav from "@/src/components/dashboard/TopNav";
import Sidebar from "@/src/components/dashboard/Sidebar";
import TrendingSidebar from "@/src/components/dashboard/TrendingSidebar";
import SuggestedUsers from "@/src/components/dashboard/SuggestedUsers";
import { SocketProvider } from "@/src/context/SocketContext";

const DashboardLayout = ({ children }) => {
  return (
    <SocketProvider>
      <div className="h-[100dvh] w-full bg-[var(--geist-background)] flex flex-col overflow-hidden">
        {/* Global Header */}
        <div className="shrink-0">
          <TopNav />
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Nav Sidebar */}
          <div className="hidden md:block shrink-0 h-full">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-[var(--geist-background)]">
              <main className="w-full max-w-[1000px] mx-auto px-2 md:px-4 py-6">
                {children}
              </main>
            </div>

            {/* Right Panel — Trending + Suggested */}
            <div className="hidden xl:flex flex-col w-72 shrink-0 border-l border-[var(--accents-2)] overflow-y-auto">
              <TrendingSidebar />
              <div className="border-t border-[var(--accents-2)]">
                <SuggestedUsers />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SocketProvider>
  );
};

export default DashboardLayout;
