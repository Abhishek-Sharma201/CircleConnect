"use client";

import Loader from "@/src/components/dashboard/Loader";
import CommentSection from "@/src/components/dashboard/CommentSection";
import { apiURL } from "@/src/constants";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import AutoSummary from "@/src/components/dashboard/AutoSummary";
import AskAIPanel from "@/src/components/dashboard/AskAIPanel";

const page = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const id = params?.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const fetchSinglePost = async () => {
    setLoading(true);
    try {
      // Check cache first
      const cacheKey = `post_${id}`;
      const timestampKey = `post_${id}_timestamp`;
      const cached = localStorage.getItem(cacheKey);
      const timestamp = localStorage.getItem(timestampKey);
      
      if (cached && timestamp) {
        const age = Date.now() - parseInt(timestamp);
        // Cache for 10 minutes
        if (age < 10 * 60 * 1000) {
          const cachedPost = JSON.parse(cached);
          setPost(cachedPost);
          if (user) {
            setIsLiked(cachedPost.likes?.includes(user._id) || false);
            setLikeCount(cachedPost.likes?.length || 0);
          }
          setLoading(false);
          return;
        }
      }

      const f = await fetch(`${apiURL}/api/posts/getSinglePost/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const j = await f.json();
      setPost(j.post);
      
      // Initialize like state
      if (j.post && user) {
        setIsLiked(j.post.likes?.includes(user._id) || false);
        setLikeCount(j.post.likes?.length || 0);
      }
      
      // Cache the post data
      localStorage.setItem(cacheKey, JSON.stringify(j.post));
      localStorage.setItem(timestampKey, Date.now().toString());
      
      setLoading(false);
      console.log(`post : ${JSON.stringify(j.post)}`);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSinglePost();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    try {
      const endpoint = isLiked ? "unlike" : "like";
      const response = await fetch(`${apiURL}/api/posts/${endpoint}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: user._id }),
      });

      const data = await response.json();
      if (data.success) {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto transparent">
      {/* Top Bar with Back Button */}
      <div className="sticky top-0 z-10 px-6 py-4 backdrop-blur-md ">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft size={20} className="text-zinc-400" />
          </button>
          <h2 className="text-lg font-semibold text-zinc-100" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', sans-serif" }}>
            Post Details
          </h2>
        </div>
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Author Info */}
          <div className="w-full flex items-center justify-between p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <Image
                src={post?.postedBy?.picture || "/assets/pic1.jpg"}
                alt="user pic"
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-zinc-100" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', sans-serif" }}>
                  {post?.postedBy?.userName}
                </h1>
                <h4 className="text-sm text-zinc-400" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', sans-serif" }}>
                  {post?.postedBy?.headLine}
                </h4>
                <span className="text-xs text-zinc-500 mt-1">
                  {new Date(post?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="w-full flex flex-col gap-4 p-6 bg-zinc-900 rounded-lg border border-zinc-800">
            {post?.image?.secure_url && (
              <div className="w-full rounded-lg overflow-hidden -mx-6 -mt-6 mb-2">
                <Image
                  src={post.image.secure_url}
                  alt="post image"
                  width={1200}
                  height={600}
                  className="w-full object-cover"
                />
              </div>
            )}
            
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight leading-tight" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', sans-serif" }}>
              {post?.head}
            </h1>
            
            <AutoSummary postId={id} postDescription={post?.description} />
            <p className="text-base text-zinc-300 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "'Inter', 'system-ui', '-apple-system', sans-serif" }}>
              {post?.description}
            </p>

            {/* Post Actions */}
            <div className="w-full h-[1px] bg-zinc-800 my-2" />
            <div className="flex items-center gap-6">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-all duration-200"
              >
                <Heart 
                  size={20} 
                  className={`transition-all duration-200 ${isLiked ? "fill-red-500 text-red-500" : ""}`} 
                />
                <span className="text-sm font-medium">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
              </button>
              <button className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors">
                <Share2 size={18} />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection
            postId={id}
            postContent={post ? `${post.head}\n${post.description}` : undefined}
          />
        </div>
      </div>

      {/* Floating Ask AI panel — only when post is loaded */}
      {post && (
        <AskAIPanel postContent={`${post.head}\n${post.description}`} />
      )}
    </div>
  );
};

export default page;
