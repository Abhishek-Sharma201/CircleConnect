"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { id: "overview", label: "Overview", href: "/dashboard" },
  { id: "posts", label: "Posts", href: "/dashboard/posts" },
  { id: "connections", label: "Network", href: "/dashboard/connections" },
  { id: "collections", label: "Collections", href: "/dashboard/collections" },

];

const SecondaryNav = () => {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <nav className="w-full border-b border-[var(--accents-2)] bg-[var(--geist-background)] px-6 z-40 sticky top-16 scrollbar-hide overflow-x-auto">
      <ul className="flex items-center gap-6 h-12">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.id} className="h-full flex-shrink-0">
              <Link
                href={item.href}
                className={`relative flex items-center h-full text-sm font-medium transition-colors ${
                  active
                    ? "text-[var(--geist-foreground)]"
                    : "text-[var(--accents-5)] hover:text-[var(--geist-foreground)]"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--geist-foreground)] rounded-t-sm" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SecondaryNav;
