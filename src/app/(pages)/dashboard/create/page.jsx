"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Sparkles, Hash, ImageIcon, X, Loader2, Calendar, CheckSquare, Code2, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { apiURL } from "@/src/constants";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/src/hooks/useAuth";
import Image from "next/image";
import { apiFetch } from "@/src/lib/api";

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [currentHashtag, setCurrentHashtag] = useState("");
  const [postType, setPostType] = useState("regular"); // regular, poll, code
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [scheduledDate, setScheduledDate] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isImageAILoading, setIsImageAILoading] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(true);
  const scoreDebounce = useRef(null);

  const { user } = useAuth();

  // Debounced AI quality score — fires 2s after user stops typing
  useEffect(() => {
    if (!title || !description) return;
    if (scoreDebounce.current) clearTimeout(scoreDebounce.current);
    scoreDebounce.current = setTimeout(async () => {
      setScoreLoading(true);
      try {
        const data = await apiFetch("/api/ai/analyze-post", {
          method: "POST",
          body: JSON.stringify({ head: title, description, tags: hashtags }),
        });
        if (data.success) setScoreData({ score: data.score, tips: data.tips });
      } catch {
        // Non-critical
      } finally {
        setScoreLoading(false);
      }
    }, 2000);
    return () => clearTimeout(scoreDebounce.current);
  }, [title, description]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddHashtag = (e) => {
    if (e.key === "Enter" && currentHashtag.trim()) {
      e.preventDefault();
      const tag = currentHashtag.trim().replace(/^#/, "");
      if (!hashtags.includes(tag)) {
        setHashtags((prev) => [...prev, tag]);
      }
      setCurrentHashtag("");
    }
  };

  const removeHashtag = (tag) => setHashtags(hashtags.filter((t) => t !== tag));

  const genContext = async () => {
    if (!title.trim()) return toast.info("Enter a topic in the title field first.");
    setIsAILoading(true);
    try {
      const res = await fetch(`${apiURL}/api/posts/ai`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ content: title }),
      });
      const json = await res.json();
      if (json?.result?.head) setTitle(json.result.head);
      if (json?.result?.description) setDescription(json.result.description);
    } catch (error) {
      console.error("AI context generation failed", error);
      toast.error("Failed to generate content.");
    } finally {
      setIsAILoading(false);
    }
  };

  const genImage = async () => {
    if (!description.trim()) return toast.info("Describe your image in the description field first.");
    setIsImageAILoading(true);
    try {
      const res = await fetch(`${apiURL}/api/posts/imageai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) throw new Error("Failed to generate image");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setImagePreview(url);
    } catch (error) {
      console.error("genImage Err:", error);
      toast.error(error.message);
    } finally {
      setIsImageAILoading(false);
    }
  };

  const submitPost = async () => {
    if (!title.trim() || !description.trim()) {
      return toast.error("Please fill in both title and description.");
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("postedBy", user?._id);
      formData.append("head", title);
      formData.append("description", description);
      if (imageFile) formData.append("image", imageFile);
      formData.append("tags", JSON.stringify(hashtags));
      formData.append("type", postType);
      
      if (postType === "poll") {
        formData.append("poll", JSON.stringify({ 
          question: pollQuestion, 
          options: pollOptions.filter(o => o.trim()).map(text => ({ text })) 
        }));
      }
      
      if (postType === "code") {
        formData.append("codeSnippet", JSON.stringify({ code: codeSnippet, language: codeLanguage }));
      }
      
      if (scheduledDate) {
        formData.append("scheduledDate", scheduledDate);
        formData.append("status", "scheduled");
      } else {
        formData.append("status", "published");
      }

      const res = await fetch(`${apiURL}/api/posts/post`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to publish post.");

      toast.success("Post published successfully!");
      router.push("/dashboard/posts");
    } catch (error) {
      console.error("Publish failed:", error);
      toast.error(error.message || "Can't publish post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--accents-2)]">
        <div>
          <h1 className="geist-section-header">Create Post</h1>
          <p className="text-[14px] text-[var(--accents-5)] mt-1">Share something with your network.</p>
        </div>
        <div className="flex items-center gap-2 bg-[var(--accents-1)] p-1 rounded-md border border-[var(--accents-2)]">
          {[
            { id: "regular", label: "Standard", icon: ImageIcon },
            { id: "poll", label: "Poll", icon: CheckSquare },
            { id: "code", label: "Code", icon: Code2 }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setPostType(type.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium rounded-sm transition-colors ${
                postType === type.id 
                  ? "bg-[var(--geist-foreground)] text-[var(--geist-background)] shadow-sm" 
                  : "text-[var(--accents-5)] hover:text-[var(--geist-foreground)]"
              }`}
            >
              <type.icon size={14} />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        
        {/* Left: Main Content */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[var(--geist-foreground)]">Title</label>
              <button
                type="button"
                onClick={genContext}
                disabled={isAILoading}
                className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--pg-accent)] hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {isAILoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Generate with AI
              </button>
            </div>
            <input
              placeholder="What do you want to talk about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="geist-input"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[var(--geist-foreground)]">Description</label>
            <textarea
              placeholder="Expand on your thoughts..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="geist-input geist-textarea min-h-[160px] resize-y"
            />
          </div>

          {postType === "poll" && (
            <div className="geist-card p-5 mt-2 flex flex-col gap-4 bg-[var(--accents-1)] border-dashed">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[var(--geist-foreground)]">Poll Question</label>
                <input
                  placeholder="Ask a clear question..."
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="geist-input bg-[var(--geist-background)]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-medium text-[var(--geist-foreground)]">Options</label>
                {pollOptions.map((opt, idx) => (
                  <input
                    key={idx}
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...pollOptions];
                      newOpts[idx] = e.target.value;
                      setPollOptions(newOpts);
                    }}
                    className="geist-input bg-[var(--geist-background)]"
                  />
                ))}
                <button
                  onClick={() => setPollOptions([...pollOptions, ""])}
                  className="text-[13px] font-medium text-[var(--pg-accent)] w-fit mt-1 hover:underline"
                >
                  + Add another option
                </button>
              </div>
            </div>
          )}

          {postType === "code" && (
            <div className="geist-card p-5 mt-2 flex flex-col gap-4 bg-[var(--accents-1)] border-dashed">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-[var(--geist-foreground)]">Code Snippet</label>
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="geist-input max-w-[150px] py-1 text-[12px] bg-[var(--geist-background)]"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                  <option value="json">JSON</option>
                  <option value="bash">Bash</option>
                </select>
              </div>
              <textarea
                placeholder="Paste your formatted code here..."
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="geist-input font-mono text-[13px] min-h-[160px] bg-[#1a1a1a] text-[#e5e5e5] border-[#333] focus:border-[#555] resize-y"
              />
            </div>
          )}
        </div>

        {/* Right: Sidebar Attachments */}
        <div className="flex flex-col gap-8">
          {/* Media */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[var(--geist-foreground)] flex items-center gap-2">
                <ImageIcon size={14} className="text-[var(--accents-5)]" /> Media
              </h3>
              <button
                type="button"
                onClick={genImage}
                disabled={isImageAILoading}
                className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--pg-accent)] hover:opacity-80 transition-opacity disabled:opacity-50"
              >
                {isImageAILoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Generate UI
              </button>
            </div>
            
            {imagePreview ? (
              <div className="relative rounded-md border border-[var(--accents-2)] overflow-hidden group">
                <Image src={imagePreview} alt="Preview" width={400} height={300} className="w-full object-cover max-h-[220px]" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={handleRemoveImage}
                    className="p-1.5 rounded-md bg-[var(--geist-error)] text-white hover:bg-[var(--geist-error-dark)] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="border border-dashed border-[var(--accents-3)] rounded-md flex flex-col items-center justify-center h-[120px] bg-[var(--accents-1)] hover:bg-[var(--accents-2)] transition-colors cursor-pointer group">
                <Upload size={20} className="text-[var(--accents-5)] group-hover:text-[var(--geist-foreground)] transition-colors" />
                <p className="text-[12px] font-medium text-[var(--accents-5)] mt-2 group-hover:text-[var(--geist-foreground)] transition-colors">
                  Upload an image
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          <div className="geist-divider" />

          {/* Hashtags */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[14px] font-semibold text-[var(--geist-foreground)] flex items-center gap-2">
              <Hash size={14} className="text-[var(--accents-5)]" /> Hashtags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {hashtags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--accents-2)] text-[12px] font-medium text-[var(--geist-foreground)]">
                  #{tag}
                  <button onClick={() => removeHashtag(tag)} className="text-[var(--accents-5)] hover:text-[var(--geist-error)]">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <input
              placeholder="Tag names + Enter"
              value={currentHashtag}
              onChange={(e) => setCurrentHashtag(e.target.value)}
              onKeyDown={handleAddHashtag}
              className="geist-input bg-[var(--accents-1)] text-[13px]"
            />
          </div>

          <div className="geist-divider" />

          {/* Scheduling */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[14px] font-semibold text-[var(--geist-foreground)] flex items-center gap-2">
              <Calendar size={14} className="text-[var(--accents-5)]" /> Schedule Post
            </h3>
            <input 
              type="datetime-local" 
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="geist-input bg-[var(--accents-1)] text-[13px]"
            />
            <p className="text-[11px] text-[var(--accents-5)] leading-tight">
              Leaving this blank will immediately publish your post.
            </p>
          </div>
        </div>
      </div>

      {/* AI Quality Score */}
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
              <div className="text-[22px] font-bold shrink-0" style={{
                color: scoreData.score >= 80 ? "#22c55e" : scoreData.score >= 60 ? "#eab308" : "#ef4444"
              }}>
                {scoreData.score}
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                {scoreData.tips?.map((tip, i) => (
                  <p key={i} className="text-[12px] text-[var(--accents-5)] leading-snug">{tip}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-[var(--accents-2)]">
        <Link href="/dashboard" className="geist-btn geist-btn-sm geist-btn-secondary">
          Cancel
        </Link>
        <button
          onClick={submitPost}
          disabled={isLoading}
          className="geist-btn geist-btn-sm geist-btn-primary flex items-center gap-2 min-w-[120px] justify-center"
        >
          {isLoading && <Loader2 size={14} className="animate-spin" />}
          {scheduledDate ? "Schedule Post" : "Publish Now"}
        </button>
      </div>
    </div>
  );
}
