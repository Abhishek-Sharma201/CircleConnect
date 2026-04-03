"use client";
import React, { useEffect, useRef } from "react";
import { usePosts } from "@/src/context/PostContext";
import PostCard from "./PostCard";
import { Sparkles, Users, Compass, RefreshCw } from "lucide-react";
import Link from "next/link";
import { FeedSkeleton, PostCardSkeleton } from "./Skeleton";

// Feed label metadata
const FEED_LABELS = {
  curated: {
    icon: Sparkles,
    label: "For You",
    desc: "Personalised based on your interests, likes and saved posts",
    color: "text-[var(--geist-foreground)]",
  },
  interest_based: {
    icon: Sparkles,
    label: "Based on Your Interests",
    desc: "Posts matching your declared interests and activity",
    color: "text-[var(--geist-foreground)]",
  },
  interest_declared: {
    icon: Sparkles,
    label: "Matched to Your Interests",
    desc: "Posts from people who share your interests",
    color: "text-[var(--geist-foreground)]",
  },
  connection: {
    icon: Users,
    label: "From Your Network",
    desc: "Recent posts from people you follow",
    color: "text-[var(--geist-foreground)]",
  },
  discover: {
    icon: Compass,
    label: "Discover",
    desc: "Explore what's happening on PostGrid",
    color: "text-[var(--accents-5)]",
  },
};

const Feed = () => {
  const { posts, loading, loadingMore, hasMore, loadMore, feedType, fetchPosts } = usePosts();
  const sentinelRef = useRef(null);

  const label = FEED_LABELS[feedType] || FEED_LABELS.discover;
  const LabelIcon = label.icon;

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  if (loading) {
    return <FeedSkeleton count={6} />;
  }

  if (!posts?.length) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="text-center max-w-sm flex flex-col items-center gap-4">
          <Compass size={36} className="text-[var(--accents-3)]" />
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--geist-foreground)] mb-1">
              Your Feed is Empty
            </h3>
            <p className="text-[13px] text-[var(--accents-5)] leading-relaxed">
              Connect with people or create your first post to see activity here.
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <Link href="/dashboard/connections" className="geist-btn geist-btn-secondary geist-btn-sm text-[13px]">
              Find People
            </Link>
            <Link href="/dashboard/create" className="geist-btn geist-btn-primary geist-btn-sm text-[13px]">
              Create Post
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-20 px-4">
      {/* Feed label header */}
      <div className="flex items-center justify-between py-4 mb-2">
        <div className="flex items-center gap-2">
          <LabelIcon size={15} className={label.color} />
          <span className={`text-[13px] font-semibold ${label.color}`}>{label.label}</span>
          <span className="text-[12px] text-[var(--accents-4)] hidden sm:inline">— {label.desc}</span>
        </div>
        <button
          onClick={() => fetchPosts(true)}
          title="Refresh feed"
          className="p-1.5 rounded-md text-[var(--accents-4)] hover:text-[var(--geist-foreground)] hover:bg-[var(--accents-1)] transition-colors"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Posts — single column on mobile, masonry on sm+ */}
      <div className="columns-1 sm:columns-2 gap-6">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            id={post._id}
            postedBy={post.postedBy?.userName}
            postedByPic={post.postedBy?.picture}
            postedById={post.postedBy?._id}
            createdAt={post.createdAt}
            head={post.head}
            description={post.description}
            image={post.image?.secure_url}
            likes={post.likes || []}
            type={post.type}
            poll={post.poll}
            codeSnippet={post.codeSnippet}
            isRepost={post.isRepost}
            originalPost={post.originalPost}
            tags={(post.tags || []).filter((t) => t !== "__seeded__")}
            commentsCount={post.commentsCount || 0}
          />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {loadingMore && (
        <div className="flex justify-center py-6">
          <div className="columns-1 sm:columns-2 gap-6 w-full">
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="flex flex-col items-center gap-2 py-8">
          <p className="text-[13px] text-[var(--accents-4)]">You&apos;re all caught up!</p>
          <button
            onClick={() => fetchPosts(true)}
            className="text-[12px] text-[var(--accents-5)] hover:text-[var(--geist-foreground)] flex items-center gap-1 transition-colors"
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;
