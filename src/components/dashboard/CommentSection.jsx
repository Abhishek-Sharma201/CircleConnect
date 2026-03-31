"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { apiURL } from "@/src/constants";
import { toast } from "@/src/lib/toast";
import { Loader2, Send, Sparkles } from "lucide-react";
import Image from "next/image";
import { useSocket } from "@/src/context/SocketContext";
import { apiFetch } from "@/src/lib/api";

const CommentItem = ({ comment, onReply, user }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setSubmitting(true);
    await onReply(comment._id, replyContent);
    setSubmitting(false);
    setReplyContent("");
    setShowReply(false);
  };

  return (
    <div className="flex gap-3">
      <Image
        src={comment.postedBy?.picture || "/assets/default-profile.jpg"}
        alt={comment.postedBy?.userName || "User"}
        width={32}
        height={32}
        className="rounded-full object-cover w-8 h-8 mt-1"
      />
      <div className="flex-1">
        <div className="bg-zinc-900 rounded-lg p-3">
          <div className="flex justify-between items-start mb-1">
            <span className="text-sm font-medium text-zinc-300" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
              {comment.postedBy?.userName || "Unknown"}
            </span>
            <span className="text-xs text-zinc-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>{comment.content}</p>
        </div>
        
        {user && (
          <button 
            onClick={() => setShowReply(!showReply)}
            className="text-xs text-zinc-500 mt-2 ml-1 hover:text-blue-400 transition-colors"
          >
            Reply
          </button>
        )}

        {showReply && (
          <form onSubmit={handleReplySubmit} className="mt-2 flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={submitting || !replyContent.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {submitting ? "..." : "Reply"}
            </button>
          </form>
        )}

        {/* Render Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 pl-4 border-l-2 border-zinc-800">
            {comment.replies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} onReply={onReply} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentSection = ({ postId, postContent }) => {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  // Fetch AI comment suggestions once when post content is available
  useEffect(() => {
    if (!postContent || !user) return;
    const [postHead, ...rest] = postContent.split("\n");
    const postDescription = rest.join("\n") || postContent.slice(0, 300);
    setSuggestionsLoading(true);
    apiFetch("/api/ai/comment-suggestions", {
      method: "POST",
      body: JSON.stringify({ postHead: postHead || postContent.slice(0, 60), postDescription }),
    })
      .then((data) => { if (data.success) setSuggestions(data.suggestions || []); })
      .catch(() => {}) // Non-critical; silently ignore
      .finally(() => setSuggestionsLoading(false));
  }, [postContent, user?._id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`${apiURL}/api/posts/comments/${postId}`);
      const data = await response.json();
      if (data.success) {
        // Organize comments into a tree structure
        const commentMap = {};
        const rootComments = [];

        data.comments.forEach(comment => {
          comment.replies = [];
          commentMap[comment._id] = comment;
        });

        data.comments.forEach(comment => {
          if (comment.parentComment) {
            if (commentMap[comment.parentComment]) {
              commentMap[comment.parentComment].replies.push(comment);
            }
          } else {
            rootComments.push(comment);
          }
        });

        setComments(rootComments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    // Join post room when component mounts
    if (socket) {
      socket.emit("join:post", postId);

      // Listen for new comments
      const handleNewComment = (comment) => {
        console.log("[Comment] New comment received:", comment);
        // Refresh comments to rebuild tree
        fetchComments();
      };

      socket.on("comment:new", handleNewComment);

      return () => {
        socket.emit("leave:post", postId);
        socket.off("comment:new", handleNewComment);
      };
    }
  }, [postId, socket]);

  const handleAddComment = async (parentCommentId, content) => {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    if (!isConnected || !socket) {
      toast.error("Not connected. Please try again.");
      return;
    }

    try {
      // Emit via WebSocket
      socket.emit("comment:create", {
        postId,
        content,
        userId: user._id,
        parentCommentId,
      });

      if (!parentCommentId) {
        setNewComment("");
      }
      
      toast.success("Comment posted!");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    await handleAddComment(null, newComment);
    setSubmitting(false);
  };

  return (
    <div className="mt-6 bg-zinc-950 rounded-lg border border-zinc-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-zinc-300 text-lg font-semibold" style={{ fontFamily: "'Inter', 'system-ui', sans-serif" }}>
          Comments ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
        </h3>
        {isConnected && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-zinc-500">Live</span>
          </div>
        )}
      </div>

      {/* Comment Form */}
      {user ? (
        <div className="flex flex-col gap-3 mb-6">
          {/* AI Suggestion chips */}
          {(suggestionsLoading || suggestions.length > 0) && (
            <div className="flex flex-wrap gap-2 items-center">
              <Sparkles size={12} className="text-zinc-500 shrink-0" />
              {suggestionsLoading && <Loader2 size={12} className="animate-spin text-zinc-500" />}
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNewComment(s)}
                  className="text-[12px] px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors border border-zinc-700 truncate max-w-[220px]"
                  title={s}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Image
              src={user.picture || "/assets/default-profile.jpg"}
              alt={user.userName}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim() || !isConnected}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-zinc-900 rounded-lg border border-zinc-800 text-center">
          <p className="text-sm text-zinc-400">Please login to comment</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-zinc-500" size={24} />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem 
              key={comment._id} 
              comment={comment} 
              onReply={handleAddComment} 
              user={user} 
            />
          ))
        ) : (
          <p className="text-center text-zinc-600 text-sm py-8">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
