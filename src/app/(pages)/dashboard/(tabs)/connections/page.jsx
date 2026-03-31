"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { apiURL } from "@/src/constants";
import { toast } from "react-toastify";
import { Loader2, UserPlus, Users, Clock, X } from "lucide-react";
import Image from "next/image";

const ConnectionsPage = () => {
  const { user, setUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]); // { notificationId, user }
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const fetchData = useCallback(async () => {
    if (!user?._id) return;

    try {
      const token = localStorage.getItem("token");
      const [usersRes, notificationsRes, sentRes] = await Promise.all([
        fetch(`${apiURL}/api/user/getAll`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiURL}/api/notifications/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiURL}/api/connections/sent/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const usersData = await usersRes.json();
      const notificationsData = await notificationsRes.json();
      const sentData = await sentRes.json();

      if (usersData.success) setUsers(usersData.users);

      if (notificationsData.success) {
        const pending = (notificationsData.notifications || []).filter(
          (n) => n.type === "connection_request" && n.status === "pending"
        );
        setIncomingRequests(pending);
      }

      if (sentData.success) {
        setSentRequests(sentData.sentRequests || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSendRequest = async (targetUserId) => {
    if (!user) return;
    setProcessing(targetUserId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${apiURL}/api/connections/addConnection/${user._id}/${targetUserId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Connection request sent!");
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to send request");
    } finally {
      setProcessing(null);
    }
  };

  const handleCancelRequest = async (notificationId) => {
    setProcessing(notificationId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${apiURL}/api/connections/cancel/${notificationId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Request cancelled");
        setSentRequests((prev) => prev.filter((r) => r.notificationId !== notificationId));
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to cancel request");
    } finally {
      setProcessing(null);
    }
  };

  const handleAcceptRequest = async (notificationId) => {
    setProcessing(notificationId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${apiURL}/api/connections/accept/${notificationId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Connection accepted!");
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to accept");
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectRequest = async (notificationId) => {
    setProcessing(notificationId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${apiURL}/api/connections/reject/${notificationId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Request declined");
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to reject");
    } finally {
      setProcessing(null);
    }
  };

  const handleDisconnect = async (targetUserId) => {
    if (!user) return;
    setProcessing(targetUserId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${apiURL}/api/connections/removeConnection/${user._id}/${targetUserId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Disconnected!");
        setUser((prev) => ({
          ...prev,
          connections: prev.connections.filter((id) => id !== targetUserId),
        }));
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to disconnect");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--accents-5)]" />
      </div>
    );
  }

  const isConnected = (targetUserId) =>
    user?.connections?.some((id) => id.toString() === targetUserId.toString());

  const hasSentRequest = (targetUserId) =>
    sentRequests.some((r) => r.user?._id?.toString() === targetUserId.toString());

  const connectedUsers = users.filter((u) => isConnected(u._id));
  const suggestedUsers = users.filter(
    (u) =>
      !isConnected(u._id) &&
      u._id !== user?._id &&
      !hasSentRequest(u._id) &&
      !incomingRequests.some((n) => n.sender?._id?.toString() === u._id.toString())
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="geist-section-header flex items-center gap-3">
          <Users size={24} className="text-[var(--geist-foreground)]" />
          Network
        </h1>
      </div>

      {/* Incoming Requests */}
      {incomingRequests.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-[14px] font-semibold text-[var(--accents-6)] uppercase tracking-wider">
            Incoming Requests ({incomingRequests.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incomingRequests.map((notification) => (
              <div
                key={notification._id}
                className="geist-card p-5 border-[var(--accents-3)] flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={notification.sender?.picture || "/assets/default-profile.jpg"}
                    alt={notification.sender?.userName || "User"}
                    width={48}
                    height={48}
                    className="rounded-full object-cover w-12 h-12 border border-[var(--accents-2)]"
                  />
                  <div>
                    <h3 className="text-[14px] font-medium text-[var(--geist-foreground)]">
                      {notification.sender?.userName || "Unknown"}
                    </h3>
                    <p className="text-[12px] text-[var(--accents-5)] mt-0.5">
                      Wants to connect
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={() => handleAcceptRequest(notification._id)}
                    disabled={processing === notification._id}
                    className="flex-1 geist-btn geist-btn-primary"
                  >
                    {processing === notification._id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Accept"
                    )}
                  </button>
                  <button
                    onClick={() => handleRejectRequest(notification._id)}
                    disabled={processing === notification._id}
                    className="flex-1 geist-btn geist-btn-secondary"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sent Requests */}
      {sentRequests.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-[14px] font-semibold text-[var(--accents-6)] uppercase tracking-wider">
            Pending Sent ({sentRequests.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sentRequests.map(({ notificationId, user: u }) => (
              <div
                key={notificationId}
                className="geist-card p-5 flex flex-col items-center gap-4 text-center"
              >
                <Image
                  src={u?.picture || "/assets/default-profile.jpg"}
                  alt={u?.userName || "User"}
                  width={64}
                  height={64}
                  className="rounded-full object-cover w-16 h-16 border border-[var(--accents-2)] mb-2"
                />
                <div className="flex flex-col">
                  <h3 className="text-[15px] font-medium text-[var(--geist-foreground)]">
                    {u?.userName}
                  </h3>
                  <p className="text-[13px] text-[var(--accents-5)] line-clamp-2 mt-1 px-2">
                    {u?.headLine || "PostGrid Member"}
                  </p>
                </div>
                <button
                  onClick={() => handleCancelRequest(notificationId)}
                  disabled={processing === notificationId}
                  className="w-full geist-btn geist-btn-secondary mt-2 flex items-center justify-center gap-2"
                >
                  {processing === notificationId ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Clock size={14} />
                      Pending · Cancel
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* My Connections */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-[var(--accents-6)] uppercase tracking-wider">
            My Connections ({connectedUsers.length})
          </h2>
        </div>
        {connectedUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectedUsers.map((u) => (
              <div
                key={u._id}
                className="geist-card p-5 flex flex-col items-center gap-4 text-center"
              >
                <Image
                  src={u.picture || "/assets/default-profile.jpg"}
                  alt={u.userName}
                  width={64}
                  height={64}
                  className="rounded-full object-cover w-16 h-16 border border-[var(--accents-2)] mb-2"
                />
                <div className="flex flex-col">
                  <h3 className="text-[15px] font-medium text-[var(--geist-foreground)]">
                    {u.userName}
                  </h3>
                  <p className="text-[13px] text-[var(--accents-5)] line-clamp-2 mt-1 px-2">
                    {u.headLine || "Software Developer"}
                  </p>
                </div>
                <button
                  onClick={() => handleDisconnect(u._id)}
                  disabled={processing === u._id}
                  className="w-full geist-btn geist-btn-secondary mt-2 text-[var(--geist-error)] hover:border-[var(--geist-error)]"
                >
                  {processing === u._id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Disconnect"
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full geist-card p-10 flex flex-col items-center justify-center text-center">
            <Users size={32} className="text-[var(--accents-3)] mb-4" />
            <p className="text-[14px] text-[var(--geist-foreground)] font-medium">
              No connections yet
            </p>
            <p className="text-[13px] text-[var(--accents-5)] mt-1">
              Grow your network by connecting with others below.
            </p>
          </div>
        )}
      </section>

      {/* Suggested Users */}
      {suggestedUsers.length > 0 && (
        <section className="flex flex-col gap-4 border-t border-[var(--accents-2)] pt-10">
          <h2 className="text-[14px] font-semibold text-[var(--accents-6)] uppercase tracking-wider">
            Suggested for you
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedUsers.map((u) => (
              <div
                key={u._id}
                className="geist-card p-5 flex flex-col items-center gap-4 text-center"
              >
                <Image
                  src={u.picture || "/assets/default-profile.jpg"}
                  alt={u.userName}
                  width={64}
                  height={64}
                  className="rounded-full object-cover w-16 h-16 border border-[var(--accents-2)] mb-2"
                />
                <div className="flex flex-col">
                  <h3 className="text-[15px] font-medium text-[var(--geist-foreground)]">
                    {u.userName}
                  </h3>
                  <p className="text-[13px] text-[var(--accents-5)] line-clamp-2 mt-1 px-2">
                    {u.headLine || "Software Developer"}
                  </p>
                </div>
                <button
                  onClick={() => handleSendRequest(u._id)}
                  disabled={processing === u._id}
                  className="w-full geist-btn geist-btn-primary mt-2 flex items-center justify-center gap-2"
                >
                  {processing === u._id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <UserPlus size={14} />
                      Connect
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ConnectionsPage;
