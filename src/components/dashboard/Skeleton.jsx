"use client";
import React from "react";

// Base shimmer pulse element
export const SkeletonBox = ({ className = "" }) => (
  <div className={`animate-pulse rounded-md bg-[var(--accents-2)] ${className}`} />
);

// PostCard skeleton
export const PostCardSkeleton = () => (
  <div className="geist-card p-5 flex flex-col gap-4 break-inside-avoid mb-6">
    <div className="flex items-center gap-3">
      <SkeletonBox className="w-9 h-9 rounded-full shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <SkeletonBox className="h-3.5 w-28" />
        <SkeletonBox className="h-3 w-16" />
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <SkeletonBox className="h-4 w-3/4" />
      <SkeletonBox className="h-3 w-full" />
      <SkeletonBox className="h-3 w-5/6" />
      <SkeletonBox className="h-3 w-2/3" />
    </div>
    <SkeletonBox className="h-40 w-full rounded-md" />
    <div className="flex gap-5 pt-2 border-t border-[var(--accents-2)]">
      <SkeletonBox className="h-4 w-10" />
      <SkeletonBox className="h-4 w-6" />
      <SkeletonBox className="h-4 w-6" />
      <SkeletonBox className="h-4 w-6 ml-auto" />
    </div>
  </div>
);

// Feed skeleton — multiple post cards in masonry
export const FeedSkeleton = ({ count = 6 }) => (
  <div className="w-full max-w-4xl mx-auto pb-20 px-4">
    <div className="flex items-center gap-3 py-4 mb-2">
      <SkeletonBox className="h-4 w-32" />
    </div>
    <div className="columns-1 sm:columns-2 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Profile header skeleton
export const ProfileSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="flex items-center gap-6">
      <SkeletonBox className="w-20 h-20 rounded-full" />
      <div className="flex flex-col gap-2">
        <SkeletonBox className="h-5 w-40" />
        <SkeletonBox className="h-4 w-28" />
        <SkeletonBox className="h-3 w-52" />
      </div>
    </div>
  </div>
);

// Table row skeleton
export const RowSkeleton = ({ rows = 5 }) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 border border-[var(--accents-2)] rounded-md">
        <SkeletonBox className="w-9 h-9 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <SkeletonBox className="h-3.5 w-32" />
          <SkeletonBox className="h-3 w-48" />
        </div>
        <SkeletonBox className="h-8 w-20 rounded-md shrink-0" />
      </div>
    ))}
  </div>
);

// Notification skeleton
export const NotificationSkeleton = ({ count = 6 }) => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-[var(--accents-2)]">
        <SkeletonBox className="w-8 h-8 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-1.5">
          <SkeletonBox className="h-3.5 w-3/4" />
          <SkeletonBox className="h-3 w-1/2" />
        </div>
        <SkeletonBox className="h-3 w-12 shrink-0" />
      </div>
    ))}
  </div>
);

// Single section skeleton (generic card loading state)
export const CardSkeleton = ({ lines = 3 }) => (
  <div className="geist-card p-5 flex flex-col gap-3">
    <SkeletonBox className="h-5 w-40 mb-1" />
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBox
        key={i}
        className="h-3.5"
        style={{ width: `${80 - i * 10}%` }}
      />
    ))}
  </div>
);

export default PostCardSkeleton;
