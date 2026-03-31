"use client";
import React, { useState, useEffect } from "react";
import { X, Bookmark, Plus, Check, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { apiFetch } from "@/src/lib/api";
import { createCollectionSchema } from "@/src/lib/schemas";

const SaveToCollectionModal = ({ postId, onClose }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState({});
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    apiFetch("/api/collections/my")
      .then((data) => setCollections(data.collections || []))
      .catch(() => toast.error("Failed to load collections"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (collectionId) => {
    setSaving(collectionId);
    try {
      await apiFetch("/api/collections/add", {
        method: "POST",
        body: JSON.stringify({ collectionId, postId }),
      });
      setSaved((prev) => ({ ...prev, [collectionId]: true }));
      toast.success("Saved to collection!");
    } catch (err) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(null);
    }
  };

  const handleCreate = async () => {
    const result = createCollectionSchema.safeParse({ name: newName });
    if (!result.success) {
      setNameError(result.error.errors[0]?.message || "Invalid name");
      return;
    }
    setNameError("");
    setCreating(true);
    try {
      const data = await apiFetch("/api/collections/create", {
        method: "POST",
        body: JSON.stringify({ name: newName, isPublic: false }),
      });
      setCollections((prev) => [...prev, data.collection]);
      setNewName("");
      setShowCreate(false);
      toast.success("Collection created!");
    } catch (err) {
      toast.error(err.message || "Failed to create");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--geist-background)] border border-[var(--accents-2)] rounded-xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-[var(--accents-2)]">
          <div className="flex items-center gap-2">
            <Bookmark size={16} className="text-[var(--geist-foreground)]" />
            <h2 className="text-[15px] font-semibold text-[var(--geist-foreground)]">Save to Collection</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-[var(--accents-1)] text-[var(--accents-5)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto max-h-72 p-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={20} className="animate-spin text-[var(--accents-5)]" />
            </div>
          ) : collections.length === 0 ? (
            <p className="text-[13px] text-[var(--accents-5)] text-center py-6">
              No collections yet. Create one below.
            </p>
          ) : (
            collections.map((col) => (
              <button
                key={col._id}
                onClick={() => !saved[col._id] && handleSave(col._id)}
                disabled={saving === col._id || saved[col._id]}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-[var(--accents-1)] transition-colors group"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[14px] font-medium text-[var(--geist-foreground)]">{col.name}</span>
                  <span className="text-[12px] text-[var(--accents-5)]">
                    {col.posts?.length || 0} items
                  </span>
                </div>
                {saving === col._id ? (
                  <Loader2 size={16} className="animate-spin text-[var(--accents-5)]" />
                ) : saved[col._id] ? (
                  <Check size={16} className="text-[var(--geist-success)]" />
                ) : null}
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-[var(--accents-2)]">
          {showCreate ? (
            <div className="flex flex-col gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Collection name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="geist-input text-[13px]"
              />
              {nameError && <p className="text-[12px] text-[var(--geist-error)]">{nameError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="geist-btn geist-btn-primary geist-btn-sm flex-1"
                >
                  {creating ? <Loader2 size={14} className="animate-spin" /> : "Create"}
                </button>
                <button
                  onClick={() => { setShowCreate(false); setNameError(""); }}
                  className="geist-btn geist-btn-secondary geist-btn-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCreate(true)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-[var(--accents-3)] text-[13px] text-[var(--accents-5)] hover:border-[var(--accents-5)] hover:text-[var(--geist-foreground)] transition-colors"
            >
              <Plus size={14} />
              New Collection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaveToCollectionModal;
