"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, Plus, X, Loader2, MoreHorizontal, Trash2, Globe, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/src/hooks/useAuth";
import { apiFetch } from "@/src/lib/api";
import { createCollectionSchema } from "@/src/lib/schemas";

export default function CollectionsPage() {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", isPublic: false });
  const [errors, setErrors] = useState({});
  const [creating, setCreating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user) return;
    apiFetch("/api/collections/my")
      .then((data) => setCollections(data.collections || []))
      .catch(() => toast.error("Failed to load collections"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = createCollectionSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((e) => {
        fieldErrors[e.path[0]] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setCreating(true);
    try {
      const data = await apiFetch("/api/collections/create", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setCollections((prev) => [data.collection, ...prev]);
      setForm({ name: "", description: "", isPublic: false });
      setShowCreate(false);
      toast.success("Collection created!");
    } catch (err) {
      toast.error(err.message || "Failed to create collection");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    setMenuOpen(null);
    try {
      await apiFetch(`/api/collections/${id}`, { method: "DELETE" });
      setCollections((prev) => prev.filter((c) => c._id !== id));
      toast.success("Collection deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--accents-5)]" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-[var(--accents-2)]">
        <h1 className="geist-section-header">Collections</h1>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="geist-btn geist-btn-primary h-9 px-4"
        >
          {showCreate ? <X size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
          {showCreate ? "Cancel" : "New Collection"}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="geist-card p-6 flex flex-col gap-4 animate-fade-in"
        >
          <h2 className="text-[15px] font-semibold text-[var(--geist-foreground)]">
            New Collection
          </h2>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[var(--geist-foreground)]">
              Name <span className="text-[var(--geist-error)]">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. React Resources"
              className="geist-input"
            />
            {errors.name && <p className="text-[12px] text-[var(--geist-error)]">{errors.name}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[var(--geist-foreground)]">
              Description <span className="text-[var(--accents-5)]">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="What is this collection about?"
              rows={2}
              className="geist-input geist-textarea"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isPublic}
              onChange={(e) => setForm((p) => ({ ...p, isPublic: e.target.checked }))}
              className="accent-[var(--geist-foreground)] w-4 h-4 rounded"
            />
            <span className="text-[13px] text-[var(--geist-foreground)]">Make this collection public</span>
          </label>
          <div className="flex justify-end">
            <button type="submit" disabled={creating} className="geist-btn geist-btn-primary">
              {creating ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
              Create Collection
            </button>
          </div>
        </form>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div key={col._id} className="relative group">
            <Link
              href={`/dashboard/collections/${col._id}`}
              className="geist-card p-6 cursor-pointer flex flex-col justify-between h-48 hover:border-[var(--accents-4)] transition-colors block"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[16px] font-semibold text-[var(--geist-foreground)] truncate">
                    {col.name}
                  </h3>
                  {col.isPublic ? (
                    <Globe size={12} className="text-[var(--accents-4)] shrink-0" />
                  ) : (
                    <Lock size={12} className="text-[var(--accents-4)] shrink-0" />
                  )}
                </div>
                {col.description && (
                  <p className="text-[13px] text-[var(--accents-5)] line-clamp-2">{col.description}</p>
                )}
                <p className="text-[12px] text-[var(--accents-4)] mt-1">
                  {col.posts?.length || 0} {col.posts?.length === 1 ? "item" : "items"}
                </p>
              </div>
              {col.posts?.length > 0 && (
                <div className="flex -space-x-3 overflow-hidden mt-4">
                  {col.posts.slice(0, 4).map((post, i) => (
                    <div
                      key={i}
                      className="inline-block h-10 w-10 rounded-full ring-2 ring-[var(--geist-background)] bg-[var(--accents-2)]"
                    >
                      {post.image?.secure_url && (
                        <img
                          src={post.image.secure_url}
                          className="h-full w-full object-cover rounded-full"
                          alt=""
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Link>

            {/* 3-dot menu */}
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setMenuOpen(menuOpen === col._id ? null : col._id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-[var(--geist-background)] border border-[var(--accents-2)] text-[var(--accents-5)] hover:text-[var(--geist-foreground)]"
              >
                <MoreHorizontal size={14} />
              </button>
              {menuOpen === col._id && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                  <div className="absolute right-0 mt-1 w-36 bg-[var(--geist-background)] border border-[var(--accents-2)] rounded-md shadow-lg z-20 py-1">
                    <button
                      onClick={() => handleDelete(col._id)}
                      disabled={deleting === col._id}
                      className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-[var(--geist-error)] hover:bg-[var(--geist-error-light)] transition-colors"
                    >
                      {deleting === col._id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {collections.length === 0 && !showCreate && (
          <div className="col-span-full geist-card py-20 flex flex-col items-center justify-center text-center">
            <Bookmark size={32} className="text-[var(--accents-3)] mb-4" />
            <p className="text-[15px] text-[var(--geist-foreground)] font-medium">No collections yet</p>
            <p className="text-[14px] text-[var(--accents-5)] mt-2 max-w-sm">
              Save posts and organize them into collections to easily find them later.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="geist-btn geist-btn-secondary mt-6"
            >
              Create Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
