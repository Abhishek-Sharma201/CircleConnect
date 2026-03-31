"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { apiURL } from "@/src/constants";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/src/hooks/useAuth";
import NotificationBell from "./NotificationBell";
import { usePathname, useRouter } from "next/navigation";

const TopNav = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  const searchUsers = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`${apiURL}/api/search/users?query=${query}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.users || []);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => searchUsers(value), 300);
  };

  const clearSearch = () => {
    setSearch("");
    setSearchResults([]);
    setShowResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simple breadcrumb logic based on pathname
  const getBreadcrumb = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length <= 1) return "Overview";
    return parts[parts.length - 1].charAt(0).toUpperCase() + parts[parts.length - 1].slice(1);
  };

  return (
    <header className="w-full h-16 flex items-center justify-between px-6 border-b border-[var(--accents-2)] bg-[var(--geist-background)] z-50 sticky top-0">
      {/* Left: Logo and Breadcrumb */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          {/* Vercel-like simple logo - perhaps a triangle or PostGrid text */}
          <div className="w-8 h-8 bg-[var(--geist-foreground)] text-[var(--geist-background)] flex items-center justify-center rounded-md font-bold text-xl leading-none">
            &#x25B2;
          </div>
        </Link>
        <div className="h-6 w-px bg-[var(--accents-2)] rotate-[20deg]" />
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="text-[var(--geist-foreground)]">PostGrid</span>
          <span className="text-[var(--accents-4)]">/</span>
          <span className="text-[var(--accents-5)]">{getBreadcrumb()}</span>
        </div>
      </div>

      {/* Right: Search and Avatar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div ref={searchRef} className="relative hidden md:flex items-center w-64">
          <Search size={16} className="absolute left-3 text-[var(--accents-4)] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && search.trim()) {
                e.preventDefault();
                setShowResults(false);
                router.push(`/dashboard/search?query=${encodeURIComponent(search.trim())}`);
              }
            }}
            onFocus={() => search && setShowResults(true)}
            placeholder="Search..."
            className="w-full h-9 pl-10 pr-10 rounded-full bg-[var(--accents-1)] border border-[var(--accents-2)] focus:border-[var(--pg-accent)] focus:bg-[var(--geist-background)] outline-none text-sm transition-all focus:ring-2 focus:ring-[var(--pg-accent-subtle)] text-[var(--geist-foreground)] placeholder:text-[var(--accents-4)]"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 text-[var(--accents-4)] hover:text-[var(--geist-foreground)] transition-colors"
            >
              {isSearching ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
            </button>
          )}

          {/* Search Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--geist-background)] border border-[var(--accents-2)] rounded-md shadow-lg max-h-80 overflow-y-auto z-50">
              {searchResults.map((u) => (
                <Link
                  key={u._id}
                  href={`/profile/${u._id}`}
                  onClick={() => {
                    setShowResults(false);
                    clearSearch();
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--accents-1)] transition-colors border-b border-[var(--accents-1)] last:border-0"
                >
                  <Image
                    src={u.picture || "/assets/default-profile.jpg"}
                    alt={u.userName}
                    width={32}
                    height={32}
                    className="rounded-full object-cover w-8 h-8 shrink-0 border border-[var(--accents-2)]"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--geist-foreground)] truncate">{u.userName}</p>
                    {u.headLine && <p className="text-xs text-[var(--accents-5)] truncate">{u.headLine}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <NotificationBell />

        {/* User Avatar */}
        {user ? (
          <Link href="/dashboard/profile" className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--accents-2)] hover:border-[var(--accents-5)] overflow-hidden transition-all">
            <Image
              src={user.picture || "/assets/default-profile.jpg"}
              alt={user.userName || "User"}
              width={32}
              height={32}
              className="object-cover w-full h-full"
            />
          </Link>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[var(--accents-2)] animate-pulse" />
        )}
      </div>
    </header>
  );
};

export default TopNav;
