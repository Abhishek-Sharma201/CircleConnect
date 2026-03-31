"use client";
import React, { useState } from "react";
import { X, Repeat2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/src/hooks/useAuth";
import { apiFetch } from "@/src/lib/api";
import { repostSchema } from "@/src/lib/schemas";

const MAX_CHARS = 280;

const RepostModal = ({ originalPostId, originalHead, onClose }) => {
  const { user } = useAuth();
  const [commentary, setCommentary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRepost = async () => {
    const result = repostSchema.safeParse({ commentary });
    if (!result.success) {
      setError(result.error.errors[0]?.message || "Invalid input");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await apiFetch("/api/posts/repost", {
        method: "POST",
        body: JSON.stringify({
          originalPostId,
          postedBy: user._id,
          head: commentary || undefined,
        }),
      });
      toast.success("Reposted successfully!");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to repost");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--geist-background)] border border-[var(--accents-2)] rounded-xl shadow-2xl w-full max-w-md flex flex-col gap-5 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Repeat2 size={18} className="text-[var(--geist-foreground)]" />
            <h2 className="text-[16px] font-semibold text-[var(--geist-foreground)]">Repost</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-[var(--accents-1)] text-[var(--accents-5)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Original post preview */}
        <div className="rounded-lg border border-[var(--accents-2)] p-4 bg-[var(--accents-1)]">
          <p className="text-[13px] font-medium text-[var(--geist-foreground)] line-clamp-2">
            {originalHead}
          </p>
        </div>

        {/* Commentary textarea */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-medium text-[var(--geist-foreground)]">
            Add commentary <span className="text-[var(--accents-5)] font-normal">(optional)</span>
          </label>
          <textarea
            value={commentary}
            onChange={(e) => setCommentary(e.target.value.slice(0, MAX_CHARS))}
            placeholder="What are your thoughts on this?"
            rows={3}
            className="geist-input geist-textarea text-[14px] resize-none"
          />
          <div className="flex items-center justify-between">
            {error && <p className="text-[12px] text-[var(--geist-error)]">{error}</p>}
            <span className={`text-[11px] ml-auto ${commentary.length >= MAX_CHARS ? "text-[var(--geist-error)]" : "text-[var(--accents-4)]"}`}>
              {commentary.length}/{MAX_CHARS}
            </span>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="geist-btn geist-btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleRepost}
            disabled={loading}
            className="geist-btn geist-btn-primary flex items-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Repeat2 size={14} />}
            Repost
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepostModal;
