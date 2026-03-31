"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "react-toastify";
import {
  Heart,
  Bookmark,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Trash2,
  Flag,
  ExternalLink,
  Repeat2,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { apiFetch } from "@/src/lib/api";
import SaveToCollectionModal from "./SaveToCollectionModal";
import RepostModal from "./RepostModal";

const PostCard = ({
  id,
  postedBy,
  postedByPic,
  postedById,
  createdAt,
  head,
  description,
  image,
  likes = [],
  type,
  poll: initialPoll,
  codeSnippet,
  isRepost,
  originalPost,
  onDelete,
  tags = [],
  commentsCount = 0,
}) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(likes.includes(user?._id));
  const [likeCount, setLikeCount] = useState(likes.length);
  const [showOptions, setShowOptions] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [poll, setPoll] = useState(initialPoll);
  const [hasVoted, setHasVoted] = useState(() => {
    if (!initialPoll || !user?._id) return false;
    return initialPoll.options?.some((o) => o.votes?.includes(user._id));
  });
  const [expanded, setExpanded] = useState(false);
  const [tldr, setTldr] = useState(null);
  const [tldrLoading, setTldrLoading] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const DESCRIPTION_CLAMP_THRESHOLD = 300;
  const isLongDescription = description && description.length > DESCRIPTION_CLAMP_THRESHOLD;

  const handleLike = async () => {
    if (!user) return toast.error("Please log in");
    try {
      const endpoint = liked ? `/api/posts/unlike/${id}` : `/api/posts/like/${id}`;
      await apiFetch(endpoint, {
        method: "PUT",
        body: JSON.stringify({ userId: user._id }),
      });
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      toast.error(err.message || "Failed to update like");
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      await apiFetch(`/api/posts/del/${id}`, { method: "DELETE" });
      toast.success("Post deleted");
      onDelete?.(id);
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const handleVote = async (optionIndex) => {
    if (!user) return toast.error("Please log in");
    if (hasVoted) return toast.info("You have already voted");
    try {
      const data = await apiFetch(`/api/posts/${id}/poll/vote`, {
        method: "POST",
        body: JSON.stringify({ optionIndex, userId: user._id }),
      });
      setPoll(data.post.poll);
      setHasVoted(true);
      toast.success("Vote recorded!");
    } catch (err) {
      toast.error(err.message || "Failed to vote");
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/dashboard/posts/${id}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Link copied!"));
    setShowOptions(false);
  };

  const handleTldr = async () => {
    if (tldr) return; // already loaded
    setTldrLoading(true);
    try {
      const data = await apiFetch(`/api/posts/summary/${id}`);
      setTldr(data.summary || data.result || "No summary available.");
    } catch {
      toast.error("Could not generate summary");
    } finally {
      setTldrLoading(false);
    }
  };

  const handleCopyCode = () => {
    const code = codeSnippet?.code || codeSnippet;
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    });
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      <article className="geist-card p-5 flex flex-col gap-4 group hover:border-[var(--accents-4)] transition-colors relative bg-[var(--geist-background)] w-full overflow-hidden break-inside-avoid mb-6">
        {/* Repost badge */}
        {isRepost && (
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--accents-5)] -mb-1">
            <Repeat2 size={13} />
            <span>Reposted</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href={postedById ? `/profile/${postedById}` : "#"} className="flex items-center gap-3">
            <Image
              src={postedByPic || "/assets/default-profile.jpg"}
              alt={postedBy || "User"}
              width={36}
              height={36}
              className="rounded-full object-cover w-9 h-9 border border-[var(--accents-2)]"
            />
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-[var(--geist-foreground)] leading-tight hover:underline">
                {postedBy}
              </span>
              <span className="text-[12px] text-[var(--accents-5)] mt-0.5">
                {timeAgo(createdAt)}
              </span>
            </div>
          </Link>

          {/* Options Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-1.5 rounded-md text-[var(--accents-5)] hover:text-[var(--geist-foreground)] hover:bg-[var(--accents-1)] transition-colors"
            >
              <MoreHorizontal size={18} />
            </button>
            {showOptions && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-[var(--geist-background)] border border-[var(--accents-2)] rounded-md shadow-lg z-20 py-1 flex flex-col">
                  <Link
                    href={`/dashboard/posts/${id}`}
                    className="flex items-center gap-3 px-4 py-2 text-[13px] text-[var(--accents-6)] hover:bg-[var(--accents-1)] hover:text-[var(--geist-foreground)] transition-colors"
                  >
                    <ExternalLink size={14} /> View Post
                  </Link>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-3 px-4 py-2 text-[13px] text-[var(--accents-6)] hover:bg-[var(--accents-1)] hover:text-[var(--geist-foreground)] transition-colors w-full text-left"
                  >
                    <Share2 size={14} /> Copy Link
                  </button>
                  <button className="flex items-center gap-3 px-4 py-2 text-[13px] text-[var(--accents-6)] hover:bg-[var(--accents-1)] hover:text-[var(--geist-foreground)] transition-colors w-full text-left">
                    <Flag size={14} /> Report
                  </button>
                  {user?._id === postedById && (
                    <>
                      <div className="mx-3 my-1 h-px bg-[var(--accents-2)]" />
                      <button
                        onClick={handleDelete}
                        className="flex items-center gap-3 px-4 py-2 text-[13px] text-[var(--geist-error)] hover:bg-[var(--geist-error-light)] transition-colors w-full text-left"
                      >
                        <Trash2 size={14} /> Delete Post
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2">
          {head && (
            <Link href={`/dashboard/posts/${id}`}>
              <h3 className="text-[16px] font-semibold text-[var(--geist-foreground)] leading-snug break-words hover:underline">
                {head}
              </h3>
            </Link>
          )}
          {description && (
            <>
              <p
                className={`text-[14px] text-[var(--accents-6)] leading-relaxed whitespace-pre-wrap break-words ${
                  !expanded && isLongDescription ? "line-clamp-4" : ""
                }`}
              >
                {description}
              </p>
              {isLongDescription && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExpanded((v) => !v)}
                    className="text-[12px] text-[var(--accents-5)] hover:text-[var(--geist-foreground)] transition-colors"
                  >
                    {expanded ? "Show less" : "Read more →"}
                  </button>
                  {!tldr && (
                    <button
                      onClick={handleTldr}
                      disabled={tldrLoading}
                      className="flex items-center gap-1 text-[12px] text-[var(--accents-5)] hover:text-[var(--geist-foreground)] transition-colors disabled:opacity-50"
                    >
                      <Sparkles size={11} />
                      {tldrLoading ? "Summarizing…" : "TL;DR"}
                    </button>
                  )}
                </div>
              )}
              {/* AI Summary */}
              {tldr && (
                <div className="flex gap-2 items-start rounded-md bg-[var(--accents-1)] border border-[var(--accents-2)] px-3 py-2 mt-1">
                  <Sparkles size={13} className="text-[var(--geist-foreground)] mt-0.5 shrink-0" />
                  <p className="text-[13px] text-[var(--accents-6)] italic leading-relaxed">{tldr}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Tags */}
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 -mt-1">
            {tags.map((tag, i) => (
              <Link
                key={i}
                href={`/dashboard/search?q=${encodeURIComponent(tag)}`}
                className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--accents-1)] text-[var(--accents-5)] hover:text-[var(--geist-foreground)] hover:bg-[var(--accents-2)] transition-colors border border-[var(--accents-2)]"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Image Attachment */}
        {image && (
          <Link
            href={`/dashboard/posts/${id}`}
            className="block relative overflow-hidden rounded-md border border-[var(--accents-2)] group/img"
          >
            <img
              src={image}
              alt="Attachment"
              className="w-full object-cover max-h-64 transition-transform duration-300 group-hover/img:scale-[1.02]"
            />
          </Link>
        )}

        {/* Code Snippet */}
        {type === "code" && codeSnippet && (
          <div className="relative rounded-md bg-[var(--geist-foreground)] border border-[var(--accents-2)] overflow-hidden">
            {/* Language label + copy button */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[rgba(255,255,255,0.1)]">
              <span className="text-[11px] font-mono text-[rgba(255,255,255,0.4)] uppercase tracking-wide">
                {codeSnippet.language || "code"}
              </span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[11px] text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.8)] transition-colors"
              >
                {codeCopied ? <Check size={12} /> : <Copy size={12} />}
                {codeCopied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="text-[13px] font-mono text-[var(--geist-background)] leading-relaxed p-4 overflow-x-auto">
              <code>{codeSnippet.code || codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Poll */}
        {type === "poll" && poll && (
          <div className="flex flex-col gap-2 mt-2">
            {poll.question && (
              <p className="text-[13px] font-medium text-[var(--geist-foreground)]">{poll.question}</p>
            )}
            {poll.options?.map((option, idx) => {
              const totalVotes = poll.options.reduce((a, o) => a + (o.votes?.length || 0), 0);
              const votePercent =
                totalVotes > 0 ? Math.round(((option.votes?.length || 0) / totalVotes) * 100) : 0;
              const userVotedThis = user?._id && option.votes?.includes(user._id);
              return (
                <button
                  key={idx}
                  onClick={() => handleVote(idx)}
                  disabled={hasVoted}
                  className={`relative rounded-md border overflow-hidden h-10 flex items-center w-full text-left transition-colors ${
                    userVotedThis
                      ? "border-[var(--geist-foreground)]"
                      : hasVoted
                      ? "border-[var(--accents-2)] cursor-default"
                      : "border-[var(--accents-2)] hover:border-[var(--accents-5)] cursor-pointer"
                  } bg-[var(--accents-1)]`}
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-[var(--accents-3)] opacity-30 transition-all duration-500"
                    style={{ width: `${votePercent}%` }}
                  />
                  <div className="relative w-full flex items-center justify-between px-3 text-[13px]">
                    <span className="font-medium text-[var(--geist-foreground)]">{option.text}</span>
                    {hasVoted && (
                      <span className="font-medium text-[var(--accents-5)]">{votePercent}%</span>
                    )}
                  </div>
                </button>
              );
            })}
            <div className="text-[11px] text-[var(--accents-4)] mt-1">
              {poll.options.reduce((a, o) => a + (o.votes?.length || 0), 0)} votes
              {!hasVoted && <span className="ml-2">· Click to vote</span>}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-5 pt-2 border-t border-[var(--accents-2)]">
          <button
            onClick={handleLike}
            className={`group flex items-center gap-2 text-[13px] font-medium transition-colors ${
              liked
                ? "text-[var(--geist-error)]"
                : "text-[var(--accents-5)] hover:text-[var(--geist-foreground)]"
            }`}
          >
            <Heart
              size={16}
              fill={liked ? "currentColor" : "none"}
              className="transition-transform group-active:scale-95"
            />
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>

          <Link
            href={`/dashboard/posts/${id}`}
            className="flex items-center gap-2 text-[13px] font-medium text-[var(--accents-5)] hover:text-[var(--geist-foreground)] transition-colors group"
          >
            <MessageCircle size={16} className="transition-transform group-active:scale-95" />
            {commentsCount > 0 && <span>{commentsCount}</span>}
          </Link>

          <button
            onClick={() => setShowRepostModal(true)}
            className="flex items-center gap-2 text-[13px] font-medium text-[var(--accents-5)] hover:text-[var(--geist-foreground)] transition-colors group"
            title="Repost"
          >
            <Repeat2 size={16} className="transition-transform group-active:scale-95" />
          </button>

          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-2 text-[13px] font-medium text-[var(--accents-5)] hover:text-[var(--geist-foreground)] transition-colors ml-auto group"
            title="Save to collection"
          >
            <Bookmark size={16} className="transition-transform group-active:scale-95" />
          </button>
        </div>
      </article>

      {showSaveModal && (
        <SaveToCollectionModal postId={id} onClose={() => setShowSaveModal(false)} />
      )}
      {showRepostModal && (
        <RepostModal
          originalPostId={id}
          originalHead={head}
          onClose={() => setShowRepostModal(false)}
        />
      )}
    </>
  );
};

export default PostCard;
