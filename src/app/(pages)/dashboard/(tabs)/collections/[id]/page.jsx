"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Lock, Globe, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { apiFetch } from "@/src/lib/api";
import PostCard from "@/src/components/dashboard/PostCard";

export default function CollectionDetailPage({ params }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/api/collections/${id}`)
      .then((data) => setCollection(data.collection))
      .catch((err) => {
        toast.error(err.message || "Failed to load collection");
        router.push("/dashboard/collections");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleRemovePost = async (postId) => {
    try {
      await apiFetch(`/api/collections/${id}/post/${postId}`, { method: "DELETE" });
      setCollection((prev) => ({
        ...prev,
        posts: prev.posts.filter((p) => p._id !== postId),
      }));
      toast.success("Post removed from collection");
    } catch (err) {
      toast.error(err.message || "Failed to remove post");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--accents-5)]" />
      </div>
    );
  }

  if (!collection) return null;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => router.push("/dashboard/collections")}
          className="flex items-center gap-2 text-[13px] text-[var(--accents-5)] hover:text-[var(--geist-foreground)] transition-colors w-fit"
        >
          <ArrowLeft size={14} />
          Back to Collections
        </button>

        <div className="flex items-start justify-between pb-4 border-b border-[var(--accents-2)]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold text-[var(--geist-foreground)]">
                {collection.name}
              </h1>
              {collection.isPublic ? (
                <span className="flex items-center gap-1 text-[11px] text-[var(--geist-success)] border border-[var(--geist-success)] rounded-full px-2 py-0.5">
                  <Globe size={10} /> Public
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-[var(--accents-5)] border border-[var(--accents-3)] rounded-full px-2 py-0.5">
                  <Lock size={10} /> Private
                </span>
              )}
            </div>
            {collection.description && (
              <p className="text-[14px] text-[var(--accents-5)]">{collection.description}</p>
            )}
            <p className="text-[13px] text-[var(--accents-4)]">
              {collection.posts?.length || 0} {collection.posts?.length === 1 ? "post" : "posts"}
            </p>
          </div>
        </div>
      </div>

      {/* Posts */}
      {collection.posts?.length === 0 ? (
        <div className="geist-card py-20 flex flex-col items-center justify-center text-center">
          <p className="text-[15px] text-[var(--geist-foreground)] font-medium">No posts yet</p>
          <p className="text-[14px] text-[var(--accents-5)] mt-2">
            Save posts to this collection from your feed.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {collection.posts.map((post) => (
            <div key={post._id} className="relative group">
              <PostCard
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
              />
              <button
                onClick={() => handleRemovePost(post._id)}
                title="Remove from collection"
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1.5 rounded-md bg-[var(--geist-background)] border border-[var(--accents-2)] text-[var(--geist-error)] hover:bg-[var(--geist-error-light)]"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
