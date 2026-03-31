"use client";

import React, { useState, useEffect, useRef } from "react";
import PostCard from "@/src/components/dashboard/PostCard";
import { useAuth } from "@/src/hooks/useAuth";
import { apiURL } from "@/src/constants";
import { toast } from "react-toastify";
import { PostCardSkeleton } from "@/src/components/dashboard/Skeleton";
import Link from "next/link";
import { PenSquare, LayoutGrid, List } from "lucide-react";

const Page = () => {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState("grid"); // "grid" | "list"
  const errorToastShown = useRef(false);
  const isFetching = useRef(false);

  const fetchUserPosts = async () => {
    if (!user?._id || isFetching.current) return;
    isFetching.current = true;
    try {
      const res = await fetch(`${apiURL}/api/posts/get/${user._id}`);
      const data = await res.json();
      const postList = data.data || data.posts;
      if (!res.ok || !Array.isArray(postList)) {
        throw new Error(data.message || "Invalid response structure");
      }
      setPosts(postList);
    } catch (error) {
      if (!errorToastShown.current) {
        toast.error(error.message);
        errorToastShown.current = true;
      }
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    if (user) {
      errorToastShown.current = false;
      fetchUserPosts();
    }
  }, [user?._id]);

  if (loading) return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--accents-2)]">
        <div className="h-6 w-32 rounded-md bg-[var(--accents-2)] animate-pulse" />
        <div className="h-9 w-24 rounded-md bg-[var(--accents-2)] animate-pulse" />
      </div>
      <div className="columns-1 sm:columns-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => <PostCardSkeleton key={i} />)}
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--accents-2)]">
        <h1 className="geist-section-header">Your Posts</h1>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center border border-[var(--accents-2)] rounded-md overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={`p-2 transition-colors ${
                view === "list"
                  ? "bg-[var(--geist-foreground)] text-[var(--geist-background)]"
                  : "text-[var(--accents-5)] hover:text-[var(--geist-foreground)] hover:bg-[var(--accents-1)]"
              }`}
              title="List view"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`p-2 transition-colors border-l border-[var(--accents-2)] ${
                view === "grid"
                  ? "bg-[var(--geist-foreground)] text-[var(--geist-background)]"
                  : "text-[var(--accents-5)] hover:text-[var(--geist-foreground)] hover:bg-[var(--accents-1)]"
              }`}
              title="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
          <Link href="/dashboard/create" className="geist-btn geist-btn-primary h-9 px-4">
            <PenSquare size={15} className="mr-2" />
            Create
          </Link>
        </div>
      </div>

      {/* Posts */}
      {posts?.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[var(--accents-2)] rounded-lg">
          <p className="text-[15px] text-[var(--geist-foreground)] font-medium">No posts yet</p>
          <p className="text-[13px] text-[var(--accents-5)] mt-1">Create your first post to get started.</p>
          <Link href="/dashboard/create" className="geist-btn geist-btn-secondary mt-4 inline-flex">
            Create Post
          </Link>
        </div>
      ) : view === "list" ? (
        /* List view */
        <div className="flex flex-col gap-5">
          {posts.map((v) => (
            <PostCard
              key={v._id}
              id={v._id}
              postedBy={v.postedBy?.userName}
              postedById={v.postedBy?._id}
              createdAt={v.createdAt}
              head={v.head}
              description={v.description}
              image={v.image?.secure_url}
              postedByPic={v.postedBy?.picture}
              likes={v.likes || []}
              type={v.type}
              poll={v.poll}
              codeSnippet={v.codeSnippet}
              isRepost={v.isRepost}
              onDelete={(deletedId) => setPosts((p) => p.filter((post) => post._id !== deletedId))}
            />
          ))}
        </div>
      ) : (
        /* Grid view — masonry columns */
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [&>div]:break-inside-avoid [&>div]:mb-5">
          {posts.map((v) => (
            <div key={v._id}>
              <PostCard
                id={v._id}
                postedBy={v.postedBy?.userName}
                postedById={v.postedBy?._id}
                createdAt={v.createdAt}
                head={v.head}
                description={v.description}
                image={v.image?.secure_url}
                postedByPic={v.postedBy?.picture}
                likes={v.likes || []}
                type={v.type}
                poll={v.poll}
                codeSnippet={v.codeSnippet}
                isRepost={v.isRepost}
                onDelete={(deletedId) => setPosts((p) => p.filter((post) => post._id !== deletedId))}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
