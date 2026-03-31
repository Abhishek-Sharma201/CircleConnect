"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Sparkles, Hash, ImageIcon, X } from "lucide-react";
import Link from "next/link";
import { apiURL } from "@/src/constants";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/src/hooks/useAuth";
import Image from "next/image";

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
  const { user } = useAuth();
  const [post, setPost] = useState({ head: "", description: "" });

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
      const tag = currentHashtag.trim();
      if (!hashtags.includes(tag)) {
        setHashtags((prev) => [...prev, tag]);
      }
      setCurrentHashtag("");
    }
  };

  const removeHashtag = (tag) => setHashtags(hashtags.filter((t) => t !== tag));

  const genContext = async () => {
    try {
      if (title.length == 0) {
        toast.info("enter your prompt in title field");
        return;
      }

      setIsLoading(true);

      const res = await fetch(`${apiURL}/api/posts/ai`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ content: title }),
      });

      const json = await res.json();

      if (json?.result.head) setTitle(json.result.head);
      if (json?.result.description) setDescription(json.result.description);
    } catch (error) {
      console.error("AI context generation failed", error);
      alert("Failed to generate content.");
    } finally {
      setIsLoading(false);
    }
  };

  const genImage = async () => {
    try {
      if (description.length == 0) {
        toast.info("describe your image in description");
        return;
      }

      const res = await fetch(`${apiURL}/api/posts/imageai`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: { description: description },
      });
      if (!res.ok) toast.error("Failed to generate image");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setImagePreview(url);
    } catch (error) {
      toast.error(error.message);
      console.log(`genImage Err: ${error}`);
    }
  };

  const submitPost = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in all required fields (title & description).");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("postedBy", user?._id);
      formData.append("head", title);
      formData.append("description", description);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      formData.append("tags", JSON.stringify(hashtags));
      formData.append("type", postType);
      
      if (postType === "poll") {
        formData.append("poll", JSON.stringify({ 
          question: pollQuestion, 
          options: pollOptions.filter(o => o).map(text => ({ text })) 
        }));
      }
      
      if (postType === "code") {
        formData.append("codeSnippet", JSON.stringify({ 
          code: codeSnippet, 
          language: codeLanguage 
        }));
      }
      
      if (scheduledDate) {
        formData.append("scheduledDate", scheduledDate);
        formData.append("status", "scheduled");
      } else {
        formData.append("status", "published");
      }

      const res = await fetch(`${apiURL}/api/posts/post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        // backend sent an error message
        const message = data?.message || "Failed to publish post.";
        throw new Error(message);
      }

      // success
      toast.success("Post published.");
      // reset form
      setTitle("");
      setDescription("");
      setHashtags([]);
      setCurrentHashtag("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      router.push("/dashboard/posts");
    } catch (error) {
      console.error("Publish failed:", error);
      toast.error("Can't publish post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-[#050508] p-4">
      <div className="w-full max-w-4xl bg-[#0a0a10] border border-blue-500/20 shadow-xl shadow-blue-500/5 rounded-xl overflow-hidden max-h-[100dvh]">
        {/* Header */}
        <div className="border-b border-[#1a1a2e] p-5">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-900 via-blue-600 to-blue-700 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            Create Your Post
          </h1>
        </div>

        {/* Type Selector */}
        <div className="flex gap-4 p-5 pb-0">
            <button onClick={() => setPostType("regular")} className={`px-3 py-1 rounded ${postType === "regular" ? "bg-blue-600 text-white" : "bg-[#131320] text-gray-400"}`}>Post</button>
            <button onClick={() => setPostType("poll")} className={`px-3 py-1 rounded ${postType === "poll" ? "bg-blue-600 text-white" : "bg-[#131320] text-gray-400"}`}>Poll</button>
            <button onClick={() => setPostType("code")} className={`px-3 py-1 rounded ${postType === "code" ? "bg-blue-600 text-white" : "bg-[#131320] text-gray-400"}`}>Code</button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5 overflow-y-auto">
          {/* Left Column: Title & Description */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-300"
                >
                  Title
                </label>
                <button
                  title="Auto generate"
                  type="button"
                  disabled={isLoading}
                  className="h-7 px-3 text-xs text-white rounded-md bg-gradient-to-r from-blue-900 via-blue-600 to-blue-700 animate-gradient-shadow flex items-center"
                  onClick={genContext}
                >
                  <Sparkles className="h-3 w-3 mr-1" />{" "}
                  {isLoading ? "thinking..." : "Generate"}
                </button>
              </div>
              <input
                id="title"
                placeholder="Enter an engaging title..."
                className="w-full bg-[#131320] border border-[#1a1a2e] rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-300"
                >
                  Description
                </label>
                {/* <button
                  type="button"
                  className="h-7 px-3 text-xs text-white rounded-md bg-gradient-to-r from-blue-900 via-blue-600 to-blue-700 animate-gradient-shadow flex items-center"
                >
                  <Sparkles className="h-3 w-3 mr-1" /> Generate
                </button> */}
              </div>
              <textarea
                id="description"
                placeholder="Share your thoughts..."
                className="w-full min-h-[150px] bg-[#131320] border border-[#1a1a2e] rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          
          {postType === "poll" && (
             <div className="space-y-4">
                <input 
                    placeholder="Ask a question..." 
                    className="w-full bg-[#131320] border border-[#1a1a2e] rounded-md p-2 text-white"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                />
                {pollOptions.map((opt, idx) => (
                    <input 
                        key={idx}
                        placeholder={`Option ${idx + 1}`}
                        className="w-full bg-[#131320] border border-[#1a1a2e] rounded-md p-2 text-white"
                        value={opt}
                        onChange={(e) => {
                            const newOpts = [...pollOptions];
                            newOpts[idx] = e.target.value;
                            setPollOptions(newOpts);
                        }}
                    />
                ))}
                <button onClick={() => setPollOptions([...pollOptions, ""])} className="text-blue-400 text-sm">+ Add Option</button>
             </div>
          )}

          {postType === "code" && (
             <div className="space-y-4">
                <select 
                    value={codeLanguage} 
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    className="w-full bg-[#131320] border border-[#1a1a2e] rounded-md p-2 text-white"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                </select>
                <textarea
                    placeholder="Paste code here..."
                    className="w-full min-h-[150px] bg-[#131320] border border-[#1a1a2e] rounded-md p-2 text-white font-mono"
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                />
             </div>
          )}

          {/* Right Column: Hashtags & Media */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="hashtags"
                className="text-sm font-medium text-gray-300 flex items-center"
              >
                <Hash className="h-4 w-4 mr-1 text-blue-400" /> Hashtags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {hashtags.map((tag) => (
                  <div
                    key={tag}
                    className="bg-blue-600/30 text-blue-200 px-2 py-1 rounded-md flex items-center"
                  >
                    #{tag}
                    <button
                      onClick={() => removeHashtag(tag)}
                      className="ml-1 text-blue-300 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <input
                id="hashtags"
                placeholder="Type hashtag and press Enter..."
                className="w-full bg-[#131320] border border-[#1a1a2e] rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={currentHashtag}
                onChange={(e) => setCurrentHashtag(e.target.value)}
                onKeyDown={handleAddHashtag}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300 flex items-center">
                  <ImageIcon className="h-4 w-4 mr-1 text-blue-400" /> Media
                </label>
                <button
                  title="Auto generate"
                  type="button"
                  disabled={isLoading}
                  className="h-7 px-3 text-xs text-white rounded-md bg-gradient-to-r from-blue-900 via-blue-600 to-blue-700 animate-gradient-shadow flex items-center"
                  onClick={genImage}
                >
                  <Sparkles className="h-3 w-3 mr-1" />{" "}
                  {isLoading ? "thinking..." : "Generate"}
                </button>
              </div>
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-[#1a1a2e]">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-500/90 flex items-center justify-center text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#1a1a2e] rounded-lg p-8 text-center cursor-pointer hover:border-blue-500/50 transition-colors"
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                  <p className="text-sm text-gray-400">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between border-t border-[#1a1a2e] p-5 items-center">
          <input 
            type="datetime-local" 
            className="bg-[#131320] text-white p-2 rounded border border-[#1a1a2e]"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
          />
          <Link
            href={"/dashboard"}
            className="px-4 py-2 border border-[#1a1a2e] text-gray-300 rounded-md bg-red-500  hover:bg-red-700 transition-colors "
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={submitPost}
            disabled={isLoading}
            className="px-4 py-2 rounded-md hover:bg-gradient-to-r from-blue-900 via-blue-600 to-blue-700 
                   bg-[length:200%_100%] 
                   animate-gradient-shadow text-white hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isLoading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
