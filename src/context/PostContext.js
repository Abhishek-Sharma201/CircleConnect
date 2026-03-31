"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiURL } from "../constants";

const PostContext = createContext();

const CACHE_KEY = "pg_feed_cache";
const CACHE_TS_KEY = "pg_feed_ts";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const PAGE_LIMIT = 20;

const getCachedData = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const ts = localStorage.getItem(CACHE_TS_KEY);
    if (cached && ts && Date.now() - parseInt(ts) < CACHE_DURATION) {
      return JSON.parse(cached);
    }
  } catch {}
  return null;
};

const setCachedData = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TS_KEY, Date.now().toString());
  } catch {}
};

export const PostProvider = ({ children, user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [feedType, setFeedType] = useState("discover"); // curated | interest_based | discover | connection

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchPage = useCallback(
    async (pageNum, reset = false) => {
      const isFirst = pageNum === 1;
      if (isFirst) setLoading(true);
      else setLoadingMore(true);

      try {
        // First page: try cache (skip on force-reset)
        if (isFirst && !reset) {
          const cached = getCachedData();
          if (cached?.posts?.length) {
            setPosts(cached.posts);
            setFeedType(cached.feedType || "discover");
            setLoading(false);
            return;
          }
        }

        // ── Try personalized feed (page 1 only) ───────────────────────────────
        if (isFirst && user?._id) {
          try {
            const res = await fetch(
              `${apiURL}/api/onboarding/personalized-feed/${user._id}`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
            const d = await res.json();
            const items = d.posts || d.data || [];
            if (d.success && items.length > 0) {
              setPosts(items);
              setHasMore(false); // personalized feed is a scored single page
              setFeedType(d.feedType || "curated");
              setCachedData({ posts: items, feedType: d.feedType || "curated" });
              return;
            }
          } catch {}
        }

        // ── Connection feed (paginated) ────────────────────────────────────────
        if (token) {
          try {
            const res = await fetch(
              `${apiURL}/api/posts/feed?page=${pageNum}&limit=${PAGE_LIMIT}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const d = await res.json();
            const items = d.data || d.posts || [];
            if (d.success && items.length > 0) {
              setPosts((prev) => (isFirst ? items : [...prev, ...items]));
              setHasMore(pageNum < (d.pages || 1));
              setFeedType("connection");
              if (isFirst) setCachedData({ posts: items, feedType: "connection" });
              setPage(pageNum);
              return;
            }
          } catch {}
        }

        // ── Fallback: all posts ────────────────────────────────────────────────
        const res = await fetch(
          `${apiURL}/api/posts/getAll?page=${pageNum}&limit=${PAGE_LIMIT}`
        );
        const d = await res.json();
        if (d.success) {
          const items = d.data || d.posts || [];
          setPosts((prev) => (isFirst ? items : [...prev, ...items]));
          setHasMore(pageNum < (d.pages || 1));
          setFeedType("discover");
          if (isFirst) setCachedData({ posts: items, feedType: "discover" });
          setPage(pageNum);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        if (isFirst) setLoading(false);
        else setLoadingMore(false);
      }
    },
    [user?._id, token]
  );

  const fetchPosts = useCallback(
    (forceRefresh = false) => {
      if (forceRefresh) {
        try {
          localStorage.removeItem(CACHE_KEY);
          localStorage.removeItem(CACHE_TS_KEY);
        } catch {}
      }
      setPage(1);
      setHasMore(true);
      fetchPage(1, forceRefresh);
    },
    [fetchPage]
  );

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    fetchPage(page + 1);
  }, [loadingMore, hasMore, page, fetchPage]);

  useEffect(() => {
    fetchPosts();
  }, [user?._id]);

  return (
    <PostContext.Provider
      value={{ posts, setPosts, loading, loadingMore, hasMore, loadMore, fetchPosts, feedType }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePosts must be used within a PostProvider");
  return context;
};
