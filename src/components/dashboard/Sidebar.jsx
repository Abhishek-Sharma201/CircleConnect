"use client";

import React, { useState } from "react";
import Name from "./Name";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Bell,
  Users,
  Search,
  User,
  GraduationCap,
  Bookmark,
  PenSquare,
  Shield,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

const navItems = [
  { id: "board", label: "Board", href: "/dashboard", icon: LayoutDashboard },
  { id: "posts", label: "Posts", href: "/dashboard/posts", icon: FileText },
  { id: "notifications", label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { id: "connections", label: "Connections", href: "/dashboard/connections", icon: Users },
  { id: "search", label: "Search", href: "/dashboard/search", icon: Search },
  { id: "profile", label: "Profile", href: "/dashboard/profile", icon: User },

  { id: "collections", label: "Collections", href: "/dashboard/collections", icon: Bookmark },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.success) {
        toast.success("Logout successful!");
        router.push("/login");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      id="dashboard"
      className={`${isOpen ? "w-[200px]" : "w-[64px]"
        } h-full flex flex-col bg-pg-raised border-r border-pg shrink-0 transition-all duration-300 ease-in-out`}
    >
      {/* Header */}
      <div className={`flex items-center ${isOpen ? "justify-between px-4" : "justify-center px-2"} py-5 shrink-0`}>
        {isOpen && "Dashboard"}
        <button
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md text-pg-text-secondary hover:text-pg-text-primary hover:bg-pg-hover transition-all duration-150"
        >
          {isOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
        </button>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-[var(--pg-border)]" />

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  title={item.label}
                  className={`relative flex items-center gap-3 ${isOpen ? "px-3" : "justify-center px-2"
                    } py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${active
                      ? "bg-[var(--pg-accent-subtle)] text-[var(--pg-accent-hover)]"
                      : "text-pg-text-secondary hover:text-pg-text-primary hover:bg-pg-hover"
                    }`}
                >
                  {/* Left-edge active indicator */}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[var(--pg-accent)]" />
                  )}
                  <Icon size={18} strokeWidth={active ? 2 : 1.5} className="shrink-0" />
                  {isOpen && (
                    <span className="truncate transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="mx-1 my-3 h-px bg-[var(--pg-border)]" />

        {/* Create Post */}
        <Link
          href="/dashboard/create"
          title="Create Post"
          className={`flex items-center gap-3 ${isOpen ? "px-3" : "justify-center px-2"
            } py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${pathname.startsWith("/dashboard/create")
              ? "bg-[var(--pg-accent-subtle)] text-[var(--pg-accent-hover)]"
              : "text-[var(--pg-accent)] hover:bg-[var(--pg-accent-subtle)]"
            }`}
        >
          <PenSquare size={18} strokeWidth={1.5} className="shrink-0" />
          {isOpen && <span>Create Post</span>}
        </Link>


      </nav>

      {/* Bottom: Logout */}
      <div className="shrink-0 px-2 pb-4">
        <div className="mx-1 mb-3 h-px bg-[var(--pg-border)]" />
        <button
          title="Logout"
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 ${isOpen ? "px-3" : "justify-center px-2"
            } py-2.5 rounded-lg text-sm font-medium text-pg-text-secondary hover:text-[var(--pg-danger)] hover:bg-[var(--pg-danger-subtle)] transition-all duration-150`}
        >
          <LogOut size={18} strokeWidth={1.5} className="shrink-0" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
