"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { apiURL } from "@/src/constants";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/src/hooks/useAuth";
import NotificationBell from "./NotificationBell";

const Nav = () => {
  const { user } = useAuth();
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
      const res = await fetch(`${apiURL}/api/user/search?q=${query}`);
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

  return (
    <header className="w-full h-14 shrink-0 flex items-center justify-between px-5 border-b border-pg bg-pg-raised/50 backdrop-blur-sm z-10">
      {/* Left: Search */}
      <div ref={searchRef} className="relative w-full max-w-md">
        <div className="relative flex items-center">
          <Search
            size={16}
            className="absolute left-3 text-pg-text-ghost pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            onFocus={() => search && setShowResults(true)}
            placeholder="Search users..."
            className="w-full pl-9 pr-9 py-2 bg-pg-input border border-pg rounded-lg text-sm text-pg-text-primary placeholder:text-pg-text-ghost focus:border-[var(--pg-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--pg-accent-subtle)] transition-all duration-150"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 text-pg-text-ghost hover:text-pg-text-secondary transition-colors"
            >
              {isSearching ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <X size={14} />
              )}
            </button>
          )}
        </div>

        {/* Search Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 pg-overlay max-h-80 overflow-y-auto animate-slide-down z-50">
            {searchResults.map((u) => (
              <Link
                key={u._id}
                href={`/profile/${u._id}`}
                onClick={() => {
                  setShowResults(false);
                  clearSearch();
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-pg-hover transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <Image
                  src={u.picture || "/assets/default-profile.jpg"}
                  alt={u.userName}
                  width={32}
                  height={32}
                  className="rounded-full object-cover w-8 h-8 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-pg-text-primary truncate">
                    {u.userName}
                  </p>
                  {u.headLine && (
                    <p className="text-xs text-pg-text-muted truncate">
                      {u.headLine}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0 ml-4">
        <NotificationBell />

        {/* User Avatar */}
        {user && (
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-pg-hover transition-all duration-150 group"
          >
            <Image
              src={user.picture || "/assets/default-profile.jpg"}
              alt={user.userName || "User"}
              width={28}
              height={28}
              className="rounded-full object-cover w-7 h-7 ring-1 ring-[var(--pg-border)] group-hover:ring-[var(--pg-border-hover)] transition-all"
            />
            <span className="text-sm font-medium text-pg-text-secondary group-hover:text-pg-text-primary transition-colors hidden md:inline">
              {user.userName}
            </span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Nav;
