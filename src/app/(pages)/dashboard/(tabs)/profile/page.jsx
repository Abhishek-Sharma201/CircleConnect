"use client";

import React, { useState, useEffect, useRef } from "react";
import Badge from "@/src/components/dashboard/Badge";
import PostCard from "@/src/components/dashboard/PostCard";
import { useAuth } from "@/src/hooks/useAuth";
import Image from "next/image";
import { toast } from "react-toastify";
import { apiFetch } from "@/src/lib/api";
import { apiURL } from "@/src/constants";
import Loader from "@/src/components/dashboard/Loader";
import { Twitter, Linkedin, Github, Globe, Plus, X, Camera, ChevronDown, ChevronUp, Loader2, Sparkles } from "lucide-react";
import { changePasswordSchema } from "@/src/lib/schemas";

const Page = () => {
  const { user, loading, refetchUser } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    headLine: "",
    about: "",
    socialLinks: { twitter: "", linkedin: "", github: "", website: "" },
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [openInp, setOpenInp] = useState(false);
  const [badges, setBadges] = useState([]);
  const [posts, setPosts] = useState([]);
  const errorToastShown = useRef(false);

  // AI Bio Generator
  const [bioLoading, setBioLoading] = useState(false);

  const handleGenerateBio = async () => {
    if (!form.firstName) return toast.error("Please fill in your first name first");
    setBioLoading(true);
    try {
      const data = await apiFetch("/api/ai/generate-bio", {
        method: "POST",
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          headLine: form.headLine,
          interests: user?.interests || [],
        }),
      });
      if (data.success) {
        setForm((prev) => ({ ...prev, about: data.bio }));
        toast.success("Bio generated! Feel free to edit it.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to generate bio");
    } finally {
      setBioLoading(false);
    }
  };

  // Password change state
  const [showPassword, setShowPassword] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        headLine: user.headLine || "",
        about: user.about || "",
        socialLinks: {
          twitter: user.socialLinks?.twitter || "",
          linkedin: user.socialLinks?.linkedin || "",
          github: user.socialLinks?.github || "",
          website: user.socialLinks?.website || "",
        },
      });
    }
  }, [user]);

  const fetchUserPosts = async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`${apiURL}/api/posts/get/${user._id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data || data.posts)) {
        setPosts(data.data || data.posts);
      }
    } catch (error) {
      if (!errorToastShown.current) {
        errorToastShown.current = true;
      }
    }
  };

  useEffect(() => {
    if (user) {
      errorToastShown.current = false;
      fetchUserPosts();
    }
  }, [user]);

  const change = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("social-")) {
      const socialKey = name.replace("social-", "");
      setForm((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [socialKey]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!ALLOWED.includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP, or GIF images are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("headLine", form.headLine);
      formData.append("about", form.about);
      formData.append("socialLinks", JSON.stringify(form.socialLinks));
      if (avatarFile) formData.append("picture", avatarFile);

      const res = await fetch(`${apiURL}/api/user/update`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Profile updated successfully!");
      setAvatarFile(null);
      if (refetchUser) refetchUser();
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const result = changePasswordSchema.safeParse(pwForm);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setPwErrors(fieldErrors);
      return;
    }
    setPwErrors({});
    setPwSaving(true);
    try {
      await apiFetch("/api/user/password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      toast.success("Password changed successfully!");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPassword(false);
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setPwSaving(false);
    }
  };

  const [badgeForm, setBadgeForm] = useState({
    name: "",
    isVerifiable: false,
    verificationSource: "",
    evidenceUrl: "",
  });

  const handleBadgeFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBadgeForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const addBadge = async () => {
    if (!badgeForm.name.trim()) return toast.error("Badge name cannot be empty");
    try {
      const res = await fetch(`${apiURL}/api/badge/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postedBy: user?._id, ...badgeForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
      setBadges((prev) => [...prev, data.badge]);
      setBadgeForm({ name: "", isVerifiable: false, verificationSource: "", evidenceUrl: "" });
      setOpenInp(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchBadges = async () => {
    try {
      const f = await fetch(`${apiURL}/api/badge/get/${user?._id}`);
      const j = await f.json();
      if (f.ok) setBadges(j.badges || []);
    } catch {}
  };

  useEffect(() => {
    if (user) fetchBadges();
  }, [user]);

  if (loading) return <Loader />;

  const avatarSrc = avatarPreview || user?.picture || "/assets/pic1.jpg";

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left: Profile Settings Form */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <h1 className="geist-section-header">Profile Settings</h1>

            <form onSubmit={submit} className="geist-card p-6 flex flex-col gap-8">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Image
                    src={avatarSrc}
                    alt="Profile"
                    height={80}
                    width={80}
                    className="rounded-full object-cover border border-[var(--accents-2)] w-20 h-20"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-[var(--geist-background)] border border-[var(--accents-2)] rounded-full p-1.5 cursor-pointer hover:bg-[var(--accents-1)] transition-colors"
                    title="Change photo"
                  >
                    <Camera size={12} className="text-[var(--geist-foreground)]" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-[14px] font-medium text-[var(--geist-foreground)]">Avatar</h3>
                  <p className="text-[13px] text-[var(--accents-5)]">
                    {avatarFile ? avatarFile.name : "Click the camera icon to upload a new photo."}
                  </p>
                  {avatarFile && (
                    <button
                      type="button"
                      onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                      className="text-[12px] text-[var(--geist-error)] text-left"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="geist-divider" />

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "First Name", name: "firstName", type: "text", required: true },
                  { label: "Last Name", name: "lastName", type: "text", required: true },
                  { label: "Email", name: "email", type: "email", required: true, readOnly: true },
                  { label: "Username", name: "userName", type: "text", readOnly: true },
                ].map((field) => (
                  <div key={field.name} className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-[var(--geist-foreground)]">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={field.name === "userName" ? (user?.userName || "") : form[field.name] || ""}
                      onChange={change}
                      placeholder={field.label}
                      readOnly={field.readOnly}
                      required={field.required && !field.readOnly}
                      className={`geist-input ${field.readOnly ? "bg-[var(--accents-1)] text-[var(--accents-5)] cursor-not-allowed" : ""}`}
                    />
                  </div>
                ))}
              </div>

              {/* Headline & About */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[var(--geist-foreground)]">Headline</label>
                  <input
                    type="text"
                    name="headLine"
                    value={form.headLine}
                    onChange={change}
                    placeholder="e.g. Senior Frontend Engineer"
                    required
                    className="geist-input"
                  />
                  <span className="text-[12px] text-[var(--accents-5)]">
                    Displayed under your name everywhere on PostGrid.
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-medium text-[var(--geist-foreground)]">About</label>
                    <button
                      type="button"
                      onClick={handleGenerateBio}
                      disabled={bioLoading}
                      className="flex items-center gap-1 text-[12px] text-[var(--accents-5)] hover:text-[var(--geist-foreground)] transition-colors disabled:opacity-50"
                    >
                      {bioLoading ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Sparkles size={11} />
                      )}
                      {bioLoading ? "Generating…" : "Generate with AI"}
                    </button>
                  </div>
                  <textarea
                    name="about"
                    value={form.about}
                    onChange={change}
                    placeholder="Tell us about your professional background..."
                    className="geist-input geist-textarea"
                    rows={4}
                  />
                </div>
              </div>

              <div className="geist-divider" />

              {/* Social Links */}
              <div className="flex flex-col gap-6">
                <h3 className="text-[14px] font-semibold text-[var(--geist-foreground)]">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Twitter", name: "social-twitter", icon: Twitter, value: form.socialLinks.twitter },
                    { label: "LinkedIn", name: "social-linkedin", icon: Linkedin, value: form.socialLinks.linkedin },
                    { label: "GitHub", name: "social-github", icon: Github, value: form.socialLinks.github },
                    { label: "Website", name: "social-website", icon: Globe, value: form.socialLinks.website },
                  ].map(({ label, name, icon: Icon, value }) => (
                    <div key={name} className="flex flex-col gap-2">
                      <label className="text-[13px] font-medium flex items-center gap-2 text-[var(--geist-foreground)]">
                        <Icon size={14} className="text-[var(--accents-5)]" />
                        {label}
                      </label>
                      <input
                        type="text"
                        name={name}
                        value={value}
                        onChange={change}
                        placeholder="https://..."
                        className="geist-input"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--accents-2)] flex justify-end">
                <button type="submit" disabled={saving} className="geist-btn geist-btn-primary flex items-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>

            {/* Password Change */}
            {!user?.googleAccount && (
              <div className="geist-card p-6 flex flex-col gap-4">
                <button
                  onClick={() => setShowPassword((v) => !v)}
                  className="flex items-center justify-between w-full"
                >
                  <h3 className="text-[14px] font-semibold text-[var(--geist-foreground)]">Change Password</h3>
                  {showPassword ? <ChevronUp size={16} className="text-[var(--accents-5)]" /> : <ChevronDown size={16} className="text-[var(--accents-5)]" />}
                </button>
                {showPassword && (
                  <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 pt-2 border-t border-[var(--accents-2)]">
                    {[
                      { label: "Current Password", name: "currentPassword" },
                      { label: "New Password", name: "newPassword" },
                      { label: "Confirm New Password", name: "confirmPassword" },
                    ].map(({ label, name }) => (
                      <div key={name} className="flex flex-col gap-2">
                        <label className="text-[13px] font-medium text-[var(--geist-foreground)]">{label}</label>
                        <input
                          type="password"
                          value={pwForm[name]}
                          onChange={(e) => setPwForm((p) => ({ ...p, [name]: e.target.value }))}
                          className="geist-input"
                          placeholder="••••••••"
                        />
                        {pwErrors[name] && (
                          <p className="text-[12px] text-[var(--geist-error)]">{pwErrors[name]}</p>
                        )}
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <button type="submit" disabled={pwSaving} className="geist-btn geist-btn-primary flex items-center gap-2">
                        {pwSaving && <Loader2 size={14} className="animate-spin" />}
                        Update Password
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Badges & Posts */}
        <div className="lg:col-span-5 flex flex-col gap-10">
          {/* Badges */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--accents-2)]">
              <h2 className="text-[16px] font-semibold text-[var(--geist-foreground)]">Badges</h2>
              <button
                type="button"
                onClick={() => setOpenInp(!openInp)}
                className="geist-btn geist-btn-sm geist-btn-secondary"
              >
                {openInp ? <><X size={14} className="mr-1" /> Close</> : <><Plus size={14} className="mr-1" /> Add Badge</>}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {badges?.length > 0 ? (
                badges.map((v, i) => <Badge key={v._id || i} {...v} />)
              ) : (
                <p className="text-[13px] text-[var(--accents-5)] py-2">No badges yet.</p>
              )}
            </div>
            {openInp && (
              <div className="geist-card p-5 flex flex-col gap-4 animate-fade-in mt-2 bg-[var(--accents-1)] border-transparent shadow-none">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-[var(--geist-foreground)]">Badge Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. AWS Certified Developer"
                    value={badgeForm.name}
                    onChange={handleBadgeFormChange}
                    className="geist-input"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isVerifiable"
                    id="isVerifiable"
                    checked={badgeForm.isVerifiable}
                    onChange={handleBadgeFormChange}
                    className="accent-[var(--geist-foreground)] w-4 h-4"
                  />
                  <label htmlFor="isVerifiable" className="text-[13px] text-[var(--geist-foreground)] cursor-pointer">
                    This badge is verifiable online
                  </label>
                </div>
                {badgeForm.isVerifiable && (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-medium text-[var(--geist-foreground)]">Issuer / Source</label>
                      <input
                        type="text"
                        name="verificationSource"
                        placeholder="e.g. Credly, AWS"
                        value={badgeForm.verificationSource}
                        onChange={handleBadgeFormChange}
                        className="geist-input"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-medium text-[var(--geist-foreground)]">Evidence URL</label>
                      <input
                        type="url"
                        name="evidenceUrl"
                        placeholder="https://..."
                        value={badgeForm.evidenceUrl}
                        onChange={handleBadgeFormChange}
                        className="geist-input"
                      />
                    </div>
                  </>
                )}
                <button type="button" onClick={addBadge} className="geist-btn geist-btn-primary mt-2">
                  Save Badge
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="geist-divider my-10 border-b border-[var(--accents-2)] w-full" />

      {/* SECTION 2: User Posts */}
      <section className="flex flex-col gap-6">
        <div className="pb-4">
          <h2 className="text-[20px] font-semibold text-[var(--geist-foreground)]">Your Posts</h2>
          <p className="text-[14px] text-[var(--accents-5)] mt-1">Manage and view all your published content.</p>
        </div>
        <div className="w-full">
          {posts?.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
              {posts.map((v) => (
                <PostCard
                  key={v?._id}
                  id={v?._id}
                  postedBy={v?.postedBy?.userName}
                  postedById={v?.postedBy?._id}
                  createdAt={v?.createdAt}
                  head={v?.head}
                  description={v?.description}
                  image={v?.image?.secure_url}
                  postedByPic={v?.postedBy?.picture}
                  likes={v?.likes || []}
                  type={v?.type}
                  poll={v?.poll}
                  codeSnippet={v?.codeSnippet}
                  isRepost={v?.isRepost}
                  onDelete={(deletedId) => setPosts((p) => p.filter((post) => post._id !== deletedId))}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-12 border border-dashed border-[var(--accents-2)] rounded-lg">
              <p className="text-[14px] text-[var(--accents-5)] text-center">
                You haven&apos;t posted anything yet. Make your first post on the Feed!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default React.memo(Page);
