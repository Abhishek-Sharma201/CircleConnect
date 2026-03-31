"use client";

import React, { useState, useEffect } from "react";
import { apiURL } from "@/src/constants";
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";

const AutoSummary = ({ postId, postDescription }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchSummary = async () => {
    if (summary) {
        setExpanded(!expanded);
        return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiURL}/api/posts/summary/${postId}`);
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setExpanded(true);
      }
    } catch (error) {
      console.error("Failed to fetch summary", error);
    } finally {
      setLoading(false);
    }
  };

  if (postDescription?.length < 300) return null;

  return (
    <div className="w-full bg-blue-600/10 border border-blue-500/20 rounded-lg overflow-hidden mb-4">
      <button 
        onClick={fetchSummary}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-blue-600/20 transition-colors"
      >
        <div className="flex items-center gap-2 text-blue-400">
          <Sparkles size={16} />
          <span className="text-sm font-semibold">AI Summary Available</span>
        </div>
        {loading ? <Loader2 size={16} className="animate-spin text-blue-400" /> : (expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
      </button>
      
      {expanded && summary && (
        <div className="px-4 pb-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="text-sm text-zinc-300 leading-relaxed italic border-l-2 border-blue-500/50 pl-3">
            "{summary}"
          </p>
        </div>
      )}
    </div>
  );
};

export default AutoSummary;
