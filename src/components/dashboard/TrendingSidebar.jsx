"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Hash, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/src/lib/api";

const TrendingSidebar = () => {
  const [topics, setTopics] = useState([]);
  const router = useRouter();

  useEffect(() => {
    apiFetch("/api/posts/trending")
      .then((data) => {
        if (data.trending) setTopics(data.trending);
      })
      .catch(() => {});
  }, []);

  const handleTopicClick = (topicName) => {
    router.push(`/dashboard/search?q=${encodeURIComponent(topicName)}`);
  };

  const displayTopics =
    topics.length > 0
      ? topics
      : ["Web Development", "React", "AI & Machine Learning", "Open Source", "Design Systems"].map(
          (name) => ({ name, count: 0 })
        );

  return (
    <div className="sticky top-0 p-4 space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} className="text-[var(--geist-foreground)]" />
        <h3 className="text-sm font-semibold text-[var(--geist-foreground)] tracking-tight">
          Trending
        </h3>
      </div>

      <div className="space-y-1">
        {displayTopics.map((topic, idx) => (
          <button
            key={idx}
            suppressHydrationWarning

            onClick={() => handleTopicClick(topic.name || topic)}
            className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg hover:bg-[var(--accents-1)] transition-all duration-150 group w-full text-left"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Hash size={14} className="text-[var(--accents-4)] shrink-0" />
              <span className="text-sm text-[var(--accents-6)] group-hover:text-[var(--geist-foreground)] transition-colors truncate">
                {topic.name || topic}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {topic.count > 0 && (
                <span className="text-[11px] text-[var(--accents-4)]">{topic.count}</span>
              )}
              <ArrowUpRight
                size={13}
                className="text-[var(--accents-4)] opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </button>
        ))}
      </div>

      <div className="pt-3 border-t border-[var(--accents-2)]">
        <p className="text-[0.7rem] text-[var(--accents-4)] leading-relaxed">
          PostGrid &copy; {new Date().getFullYear()}
          <br />
          <span className="opacity-60">Built for the community.</span>
        </p>
      </div>
    </div>
  );
};

export default TrendingSidebar;
