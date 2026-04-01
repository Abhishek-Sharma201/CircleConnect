"use client";
import React from "react";
import Name from "../dashboard/Name";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";

const Nav = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 z-[10] h-[60px] w-full flex items-center justify-between px-8 lg:px-20 backdrop-blur-md ">
      <Name />
      <ul className="flex items-center gap-3">
        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium rounded-lg transition-colors"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-1.5 border border-[var(--accents-3)] text-[var(--accents-6)] text-[13px] rounded-lg hover:border-[var(--accents-5)] hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium rounded-lg transition-colors"
            >
              Sign up
            </Link>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
