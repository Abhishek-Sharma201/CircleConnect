"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UserPlus, Check, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/src/hooks/useAuth";
import { apiFetch } from "@/src/lib/api";

const SuggestedUsers = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState({});

  useEffect(() => {
    if (!user?._id) return;
    apiFetch(`/api/onboarding/suggested/${user._id}`)
      .then((data) => setSuggestions(data.suggestedUsers || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?._id]);

  const handleConnect = async (targetId) => {
    if (pending[targetId]) return;
    setPending((prev) => ({ ...prev, [targetId]: "loading" }));
    try {
      await apiFetch(`/api/connections/${user._id}/${targetId}`, { method: "POST" });
      setPending((prev) => ({ ...prev, [targetId]: "sent" }));
      toast.success("Connection request sent!");
    } catch (err) {
      setPending((prev) => ({ ...prev, [targetId]: null }));
      toast.error(err.message || "Failed to send request");
    }
  };

  if (loading || suggestions.length === 0) return null;

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-sm font-semibold text-[var(--geist-foreground)] tracking-tight">
        Suggested for you
      </h3>
      <div className="space-y-3">
        {suggestions.slice(0, 5).map((s) => (
          <div key={s._id} className="flex items-center gap-3">
            <Image
              src={s.picture || "/assets/default-profile.jpg"}
              alt={s.userName}
              width={36}
              height={36}
              className="rounded-full object-cover w-9 h-9 border border-[var(--accents-2)] shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[var(--geist-foreground)] truncate">
                {s.firstName} {s.lastName}
              </p>
              <p className="text-[11px] text-[var(--accents-5)] truncate">{s.headLine}</p>
            </div>
            <button
              onClick={() => handleConnect(s._id)}
              disabled={!!pending[s._id]}
              className={`shrink-0 flex items-center gap-1 text-[12px] font-medium rounded-md px-2.5 py-1.5 border transition-colors ${
                pending[s._id] === "sent"
                  ? "border-[var(--geist-success)] text-[var(--geist-success)] bg-[var(--geist-success-light)]"
                  : "border-[var(--accents-3)] text-[var(--accents-6)] hover:border-[var(--geist-foreground)] hover:text-[var(--geist-foreground)]"
              }`}
            >
              {pending[s._id] === "loading" ? (
                <Loader2 size={12} className="animate-spin" />
              ) : pending[s._id] === "sent" ? (
                <Check size={12} />
              ) : (
                <UserPlus size={12} />
              )}
              {pending[s._id] === "sent" ? "Sent" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
