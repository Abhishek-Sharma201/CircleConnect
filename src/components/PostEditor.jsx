"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { apiURL } from "../constants";
import { Loader2, Upload, X, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../lib/api";

// ── Score ring helper ─────────────────────────────────────────────────────────
const ScoreRing = ({ score }) => {
  const radius = 20;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
  return (
    <svg width={52} height={52} className="rotate-[-90deg]">
      <circle cx={26} cy={26} r={radius} fill="none" stroke="var(--accents-2)" strokeWidth={4} />
      <circle
        cx={26}
        cy={26}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text
        x={26}
        y={26}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={700}
        fill={color}
        style={{ transform: "rotate(90deg)", transformOrigin: "26px 26px" }}
      >
        {score}
      </text>
    </svg>
  );
};

// ── PostEditor ────────────────────────────────────────────────────────────────
const PostEditor = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [imageAiLoading, setImageAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    head: "",
    description: "",
    status: "published",
    tags: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // AI Quality Score
  const [scoreData, setScoreData] = useState(null); // { score, tips }
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(true);
  const debounceRef = useRef(null);

  // Debounced quality analysis — fires 2s after user stops typing title+desc
  useEffect(() => {
    if (!formData.head || !formData.description) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setScoreLoading(true);
      try {
        const tags = formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        const data = await apiFetch("/api/ai/analyze-post", {
          method: "POST",
          body: JSON.stringify({ head: formData.head, description: formData.description, tags }),
        });
        if (data.success) setScoreData({ score: data.score, tips: data.tips });
      } catch {
        // Silently ignore — quality score is non-critical
      } finally {
        setScoreLoading(false);
      }
    }, 2000);
    return () => clearTimeout(debounceRef.current);
  }, [formData.head, formData.description]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const generateAIContent = async () => {
    if (!formData.head && !formData.description) {
      toast.error("Please enter a title or description for context");
      return;
    }
    setAiLoading(true);
    try {
      const response = await fetch(`${apiURL}/api/posts/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: formData.head + " " + formData.description }),
      });
      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          head: data.result.head || data.result.title || prev.head,
          description: data.result.description || prev.description,
          tags: data.result.tags ? data.result.tags.join(", ") : prev.tags,
        }));
        toast.success("AI content generated!");
      } else {
        toast.error("Failed to generate content");
      }
    } catch {
      toast.error("AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const generateAIImage = async () => {
    if (!formData.description) {
      toast.error("Please enter a description for image generation");
      return;
    }
    setImageAiLoading(true);
    try {
      const response = await fetch(`${apiURL}/api/posts/imageai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: formData.description }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const file = new File([blob], "ai-generated-image.png", { type: "image/png" });
        setImage(file);
        setPreview(URL.createObjectURL(file));
        toast.success("AI Image generated!");
      } else {
        toast.error("Failed to generate image");
      }
    } catch {
      toast.error("AI image generation failed");
    } finally {
      setImageAiLoading(false);
    }
  };

  const handleRefine = async (task) => {
    if (!formData.description) {
      toast.error("Please enter some description to refine");
      return;
    }
    setAiLoading(true);
    try {
      const response = await fetch(`${apiURL}/api/posts/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: formData.description, task }),
      });
      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, description: data.result }));
        toast.success(`Content updated (${task.replace("_", " ")})`);
      } else {
        toast.error("Refinement failed");
      }
    } catch {
      toast.error("AI refinement failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token || !user) {
        toast.error("You must be logged in to create a post");
        router.push("/login");
        return;
      }
      const data = new FormData();
      data.append("postedBy", user._id);
      data.append("head", formData.head);
      data.append("description", formData.description);
      data.append("status", formData.status);
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      data.append("tags", JSON.stringify(tagsArray));
      if (image) data.append("image", image);

      const response = await fetch(`${apiURL}/api/posts/post`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Post created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Failed to create post");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="pg-card p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="pg-section-header">Create New Post</h2>
          <div className="flex gap-2">
            {/* AI Polish Dropdown */}
            <div className="relative group">
              <button type="button" className="pg-btn pg-btn-secondary text-xs">
                <Sparkles size={14} />
                AI Polish
              </button>
              <div className="absolute right-0 mt-1 w-48 pg-overlay z-50 hidden group-hover:block py-1">
                {[
                  { label: "Professional Tone", task: "tone_professional" },
                  { label: "Casual Tone", task: "tone_casual" },
                  { label: "Funny Tone", task: "tone_humorous" },
                  { divider: true },
                  { label: "Expand Content", task: "expand" },
                  { label: "Summarize / Concise", task: "contract" },
                ].map((item, idx) =>
                  item.divider ? (
                    <div key={idx} className="mx-2 my-1 h-px bg-[var(--pg-border)]" />
                  ) : (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleRefine(item.task)}
                      className="w-full text-left px-3 py-2 text-xs text-pg-text-secondary hover:text-pg-text-primary hover:bg-pg-hover transition-colors"
                    >
                      {item.label}
                    </button>
                  )
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={generateAIContent}
              disabled={aiLoading}
              className="pg-btn pg-btn-primary text-xs"
            >
              {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              AI Assist
            </button>
          </div>
        </div>

        {/* AI Quality Score Panel */}
        {(scoreData || scoreLoading) && (
          <div className="rounded-lg border border-[var(--accents-2)] bg-[var(--accents-1)] overflow-hidden">
            <button
              type="button"
              onClick={() => setScoreOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-medium text-[var(--accents-6)] hover:text-[var(--geist-foreground)] transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={13} />
                AI Review
                {scoreLoading && <Loader2 size={12} className="animate-spin text-[var(--accents-4)]" />}
              </span>
              {scoreOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {scoreOpen && scoreData && (
              <div className="px-4 pb-4 flex items-start gap-4 border-t border-[var(--accents-2)] pt-3">
                <ScoreRing score={scoreData.score} />
                <div className="flex flex-col gap-1.5 flex-1">
                  <p className="text-[12px] font-semibold text-[var(--geist-foreground)]">
                    {scoreData.score >= 80
                      ? "Great post!"
                      : scoreData.score >= 60
                      ? "Good — a few tweaks will help"
                      : "Needs improvement"}
                  </p>
                  {scoreData.tips?.map((tip, i) => (
                    <p key={i} className="text-[12px] text-[var(--accents-5)] leading-snug">
                      {tip}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="pg-label">Title</label>
            <input
              type="text"
              name="head"
              value={formData.head}
              onChange={handleChange}
              required
              className="pg-input"
              placeholder="Enter post title"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="pg-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="pg-input pg-textarea"
              placeholder="Write your post content..."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="pg-label mb-0">Cover Image</label>
              <button
                type="button"
                onClick={generateAIImage}
                disabled={imageAiLoading}
                className="flex items-center gap-1 text-xs text-[var(--pg-accent)] hover:text-[var(--pg-accent-hover)] transition-colors"
              >
                {imageAiLoading ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Sparkles size={12} />
                )}
                Generate Image
              </button>
            </div>
            <div className="border-2 border-dashed border-[var(--pg-border)] rounded-lg p-4 text-center hover:border-[var(--pg-border-hover)] transition-colors">
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-[var(--pg-danger)] text-white hover:bg-[var(--pg-danger)]/80 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center py-8">
                  <Upload className="w-8 h-8 text-pg-text-ghost mb-2" />
                  <span className="text-sm text-pg-text-muted">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="pg-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="pg-input"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="pg-label">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="pg-input"
                placeholder="tech, news, ai"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="pg-btn pg-btn-primary w-full py-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Post"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostEditor;
