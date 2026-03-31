"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { apiURL } from "@/src/constants";
import {
  Bell,
  UserPlus,
  UserCheck,
  FileText,
  Heart,
  MessageCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?._id) return;
      try {
        const res = await fetch(`${apiURL}/api/notifications/${user._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const getIcon = (type) => {
    const props = { size: 18, className: "shrink-0" };
    switch (type) {
      case "connection_request": return <UserPlus {...props} className="shrink-0 text-[var(--pg-accent)]" />;
      case "connection_accepted": return <UserCheck {...props} className="shrink-0 text-[var(--pg-success)]" />;
      case "new_post": return <FileText {...props} className="shrink-0 text-purple-400" />;
      case "like": return <Heart {...props} className="shrink-0 text-rose-400" />;
      case "comment": return <MessageCircle {...props} className="shrink-0 text-amber-400" />;
      default: return <Bell {...props} className="shrink-0 text-pg-text-muted" />;
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-[var(--pg-accent)]" />
      </div>
    );
  }

  return (
    <div className="h-full w-full p-6 overflow-y-auto">
      <h1 className="pg-section-header flex items-center gap-2.5 mb-6">
        <Bell size={20} className="text-[var(--pg-accent)]" />
        Notifications
      </h1>

      {notifications.length > 0 ? (
        <div className="space-y-1 max-w-2xl">
          {notifications.map((n) => (
            <Link
              key={n._id}
              href={n.link || "#"}
              className={`flex items-start gap-3 px-4 py-3.5 rounded-lg transition-all duration-150 group ${
                !n.read
                  ? "bg-[var(--pg-accent-subtle)] hover:bg-[var(--pg-accent-muted)]"
                  : "hover:bg-pg-hover"
              }`}
            >
              {getIcon(n.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  {n.sender?.picture && (
                    <Image
                      src={n.sender.picture}
                      alt={n.sender.userName || "User"}
                      width={22}
                      height={22}
                      className="rounded-full shrink-0 mt-0.5"
                    />
                  )}
                  <p className="text-sm text-pg-text-secondary leading-relaxed">
                    {n.message}
                  </p>
                </div>
                <span className="text-xs text-pg-text-ghost mt-1 block">
                  {timeAgo(n.createdAt)}
                </span>
              </div>
              {!n.read && (
                <div className="w-2 h-2 rounded-full bg-[var(--pg-accent)] shrink-0 mt-2" />
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <Bell size={48} className="text-pg-text-ghost mb-3" />
          <p className="text-sm text-pg-text-muted">No notifications yet</p>
          <p className="text-xs text-pg-text-ghost mt-1">
            You&apos;ll see notifications here when others interact with your content.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
