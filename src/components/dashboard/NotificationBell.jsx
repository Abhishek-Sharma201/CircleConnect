"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  UserPlus,
  UserCheck,
  FileText,
  Heart,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { useSocket } from "@/src/context/SocketContext";
import { apiURL } from "@/src/constants";
import Image from "next/image";
import Link from "next/link";

const NotificationBell = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && socket) {
      socket.emit("user:join", user._id);
      socket.on("notification:new", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
      fetchNotifications();
      return () => {
        socket.off("notification:new");
      };
    }
  }, [user, socket]);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch(`${apiURL}/api/notifications/${user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`${apiURL}/api/notifications/read/${notificationId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${apiURL}/api/notifications/readAll/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    const iconProps = { size: 16, className: "shrink-0" };
    switch (type) {
      case "connection_request":
        return <UserPlus {...iconProps} className="shrink-0 text-[var(--pg-accent)]" />;
      case "connection_accepted":
        return <UserCheck {...iconProps} className="shrink-0 text-[var(--pg-success)]" />;
      case "new_post":
        return <FileText {...iconProps} className="shrink-0 text-purple-400" />;
      case "like":
        return <Heart {...iconProps} className="shrink-0 text-rose-400" />;
      case "comment":
        return <MessageCircle {...iconProps} className="shrink-0 text-amber-400" />;
      default:
        return <Bell {...iconProps} className="shrink-0 text-pg-text-muted" />;
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg text-pg-text-secondary hover:text-pg-text-primary hover:bg-pg-hover transition-all duration-150"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 bg-[var(--pg-accent)] text-white text-[10px] font-bold rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-[380px] pg-overlay z-20 max-h-[480px] overflow-hidden flex flex-col animate-slide-down">
            {/* Header */}
            <div className="px-4 py-3 border-b border-pg flex items-center justify-between shrink-0">
              <h3 className="text-sm font-semibold text-pg-text-primary">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-[var(--pg-accent)] hover:text-[var(--pg-accent-hover)] transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[var(--pg-border)]">
              {loading ? (
                <div className="p-8 text-center text-pg-text-ghost text-sm">
                  Loading...
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Link
                    key={notification._id}
                    href={notification.link || "#"}
                    onClick={() => {
                      markAsRead(notification._id);
                      setShowDropdown(false);
                    }}
                    className={`flex gap-3 px-4 py-3 hover:bg-pg-hover transition-colors ${
                      !notification.read ? "bg-[var(--pg-accent-subtle)]" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <Image
                          src={notification.sender?.picture || "/assets/default-profile.jpg"}
                          alt={notification.sender?.userName || "User"}
                          width={20}
                          height={20}
                          className="rounded-full shrink-0 mt-0.5"
                        />
                        <p className="text-xs text-pg-text-secondary leading-relaxed flex-1">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-[10px] text-pg-text-ghost mt-1 block">
                        {timeAgo(notification.createdAt)}
                      </span>
                    </div>

                    {/* Unread dot */}
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-[var(--pg-accent)] shrink-0 mt-2" />
                    )}
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Bell size={36} className="mx-auto text-pg-text-ghost mb-2" />
                  <p className="text-sm text-pg-text-ghost">No notifications yet</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
