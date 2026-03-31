"use client";
import React, { useState } from "react";
import { apiURL } from "@/src/constants";
import PostCard from "@/src/components/dashboard/PostCard";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "react-toastify";
import { z } from "zod";
import { useSearchParams } from "next/navigation";

const searchSchema = z.object({
  query: z.string().min(1, "Search query cannot be empty").max(100, "Search query is too long")
});

export default function SearchPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("posts");
  const [results, setResults] = useState({ posts: [], users: [] });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (searchQuery, tab) => {
    if (!searchQuery.trim()) return;
    try {
      searchSchema.parse({ query: searchQuery.trim() });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
      }
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      if (tab === "posts") {
        const res = await fetch(`${apiURL}/api/search/posts?query=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setResults(prev => ({ ...prev, posts: data.posts || [] }));
      } else {
        const res = await fetch(`${apiURL}/api/search/users?query=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setResults(prev => ({ ...prev, users: data.users || [] }));
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      performSearch(initialQuery, activeTab);
    }
  }, [initialQuery, activeTab]);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(query, activeTab);
  };

  return (
    <div className="h-full w-full flex flex-col items-center p-4">
        <div className="w-full max-w-2xl space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
                <input 
                    className="flex-1 geist-input"
                    placeholder="Search PostGrid..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="geist-btn geist-btn-primary">Search</button>
            </form>

            <div className="flex gap-4 border-b border-[var(--accents-2)]">
                <button 
                    onClick={() => setActiveTab("posts")} 
                    className={`pb-2 transition-colors ${activeTab === "posts" ? "border-b-2 border-[var(--pg-accent)] text-[var(--pg-accent)] font-medium" : "text-[var(--accents-5)] hover:text-[var(--geist-foreground)]"}`}
                >
                    Posts
                </button>
                <button 
                    onClick={() => setActiveTab("users")} 
                    className={`pb-2 transition-colors ${activeTab === "users" ? "border-b-2 border-[var(--pg-accent)] text-[var(--pg-accent)] font-medium" : "text-[var(--accents-5)] hover:text-[var(--geist-foreground)]"}`}
                >
                    People
                </button>
            </div>

            {loading && <div className="flex justify-center mt-8"><Loader2 className="animate-spin text-[var(--pg-accent)]"/></div>}

            <div className={`h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide pb-20 ${activeTab === "posts" ? "columns-1 sm:columns-2 gap-6" : "flex flex-col gap-4"}`}>
                {activeTab === "posts" && results.posts.map(post => (
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
                        likes={post.likes}
                        type={post.type}
                        poll={post.poll}
                        codeSnippet={post.codeSnippet}
                    />
                ))}

                {activeTab === "users" && results.users.map(userItem => (
                    <div key={userItem._id} className="geist-card flex items-center justify-between p-4">
                        <Link href={`/profile/${userItem._id}`} className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[var(--accents-2)] overflow-hidden border border-[var(--accents-2)]">
                                {userItem.picture ? <img src={userItem.picture} alt="" className="h-full w-full object-cover"/> : null}
                            </div>
                            <div>
                                <h3 className="text-[var(--geist-foreground)] font-medium text-sm">{userItem.userName}</h3>
                                <p className="text-xs text-[var(--accents-5)]">{userItem.firstName} {userItem.lastName}</p>
                            </div>
                        </Link>
                        {user?._id !== userItem._id && (
                            <button 
                                onClick={async () => {
                                    try {
                                        const res = await fetch(`${apiURL}/api/connections/addConnection/${user._id}/${userItem._id}`, {
                                            method: "POST",
                                            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                                        });
                                        const data = await res.json();
                                        if (data.success) toast.success("Connection request sent");
                                        else toast.error(data.message);
                                    } catch (err) {
                                        toast.error("Failed to connect");
                                    }
                                }}
                                className="geist-btn geist-btn-sm geist-btn-secondary"
                            >
                                Connect
                            </button>
                        )}
                    </div>
                ))}
                
                {!loading && hasSearched && ((activeTab === "posts" && results.posts.length === 0) || (activeTab === "users" && results.users.length === 0)) && (
                    <p className="text-center text-[var(--accents-5)] mt-10 text-sm">No results found.</p>
                )}
                {!loading && !hasSearched && (
                    <p className="text-center text-[var(--accents-5)] mt-10 text-sm">Type a query above to start searching.</p>
                )}
            </div>
        </div>
    </div>
  );
} 
