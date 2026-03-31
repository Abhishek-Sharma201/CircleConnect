"use client";

import React, { useState, useRef, useEffect, use } from "react";
import { Upload, Sparkles, Hash, ImageIcon, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { apiURL } from "@/src/constants";
import { useAuth } from "@/src/hooks/useAuth";
import Image from "next/image";

export default function EditPost({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const router = useRouter();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [currentHashtag, setCurrentHashtag] = useState("");
  const [postType, setPostType] = useState("regular");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [scheduledDate, setScheduledDate] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${apiURL}/api/posts/getSinglePost/${id}`);
        const data = await res.json();
        if (data.success) {
          const post = data.post;
          setTitle(post.head);
          setDescription(post.description);
          setHashtags(post.tags || []);
          setPostType(post.type || "regular");
          setImagePreview(post.image?.secure_url);
          setScheduledDate(post.scheduledDate ? new Date(post.scheduledDate).toISOString().slice(0, 16) : "");
          
          if (post.type === "poll" && post.poll) {
            setPollQuestion(post.poll.question);
            setPollOptions(post.poll.options.map(o => o.text));
          }
          
          if (post.type === "code" && post.codeSnippet) {
            setCodeSnippet(post.codeSnippet.code);
            setCodeLanguage(post.codeSnippet.language);
          }
        }
      } catch (error) {
        toast.error("Failed to fetch post data");
      } finally {
        setIsFetching(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

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

  const submitPost = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
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

      const res = await fetch(`${apiURL}/api/posts/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Post updated successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return (
    <div className="flex h-screen w-full items-center justify-center bg-[#050508]">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-[#050508] p-4 text-white">
      <div className="w-full max-w-4xl bg-[#0a0a10] border border-blue-500/20 shadow-xl shadow-blue-500/5 rounded-xl overflow-hidden">
        <div className="border-b border-[#1a1a2e] p-5">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Edit Post
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Title</label>
              <input
                className="w-full bg-[#131320] border border-[#1a1a2e] rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Description</label>
              <textarea
                className="w-full min-h-[150px] bg-[#131320] border border-[#1a1a2e] rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Media</label>
                {imagePreview ? (
                    <div className="relative rounded-lg overflow-hidden border border-[#1a1a2e]">
                    <img
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
                    <p className="text-sm text-gray-400">Click to upload image</p>
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

        <div className="flex justify-between border-t border-[#1a1a2e] p-5 items-center">
          <button onClick={() => router.back()} className="px-4 py-2 border border-[#1a1a2e] text-gray-400 rounded-md">Cancel</button>
          <button
            onClick={submitPost}
            disabled={isLoading}
            className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
