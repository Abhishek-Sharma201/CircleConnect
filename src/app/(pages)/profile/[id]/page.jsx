"use client";
import React, { useEffect, useState } from "react";
import { apiURL } from "@/src/constants";
import PostCard from "@/src/components/dashboard/PostCard";
import { Loader2, Twitter, Linkedin, Github, Globe, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/src/hooks/useAuth";

const SOCIAL_ICONS = {
  twitter: { icon: Twitter, label: "Twitter" },
  linkedin: { icon: Linkedin, label: "LinkedIn" },
  github: { icon: Github, label: "GitHub" },
  website: { icon: Globe, label: "Website" },
};

export default function ProfilePage({ params }) {
  const { id } = React.use(params);
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = id === "me" ? currentUser?._id : id;
        if (!userId) return;

        const [postsRes, badgesRes] = await Promise.all([
          fetch(`${apiURL}/api/posts/get/${userId}`),
          fetch(`${apiURL}/api/badge/get/${userId}`),
        ]);

        const postsData = await postsRes.json();
        const badgesData = await badgesRes.json();

        if (postsData.success) {
          const postList = postsData.data || postsData.posts || [];
          setPosts(postList);
          if (postList.length > 0) setProfileUser(postList[0].postedBy);
        }
        if (badgesData.success) setBadges(badgesData.badges || []);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-[var(--accents-5)]" />
      </div>
    );
  }

  const socialLinks = profileUser?.socialLinks
    ? Object.fromEntries(
        Object.entries(profileUser.socialLinks).filter(([, v]) => v && v.trim() !== "")
      )
    : {};

  return (
    <div className="h-full w-full flex flex-col items-center p-4 md:p-8 overflow-y-auto bg-[var(--geist-background)]">
      <div className="w-full max-w-3xl flex flex-col gap-8">

        {/* Profile Header */}
        <div className="geist-card p-6 flex items-start gap-6">
          <div className="shrink-0">
            <Image
              src={profileUser?.picture || "/assets/default-profile.jpg"}
              alt={profileUser?.userName || "User"}
              width={80}
              height={80}
              className="rounded-full object-cover border border-[var(--accents-2)] w-20 h-20"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <h1 className="text-[22px] font-bold text-[var(--geist-foreground)]">
              {profileUser?.firstName} {profileUser?.lastName}
            </h1>
            <p className="text-[14px] text-[var(--accents-5)]">@{profileUser?.userName}</p>
            {profileUser?.headLine && (
              <p className="text-[14px] text-[var(--accents-6)] mt-1">{profileUser.headLine}</p>
            )}
            {profileUser?.about && (
              <p className="text-[13px] text-[var(--accents-5)] mt-2 leading-relaxed">
                {profileUser.about}
              </p>
            )}

            {/* Social Links */}
            {Object.keys(socialLinks).length > 0 && (
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                {Object.entries(socialLinks).map(([key, url]) => {
                  const config = SOCIAL_ICONS[key];
                  if (!config) return null;
                  const Icon = config.icon;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={config.label}
                      className="flex items-center gap-1.5 text-[13px] text-[var(--accents-5)] hover:text-[var(--geist-foreground)] transition-colors"
                    >
                      <Icon size={14} />
                      <span className="hidden sm:inline">{config.label}</span>
                      <ExternalLink size={10} className="opacity-50" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-[15px] font-semibold text-[var(--geist-foreground)] border-b border-[var(--accents-2)] pb-3">
              Badges
            </h2>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <div
                  key={badge._id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accents-2)] bg-[var(--accents-1)] text-[13px] text-[var(--geist-foreground)]"
                >
                  <span className="font-medium">{badge.name}</span>
                  {badge.isVerifiable && badge.evidenceUrl && (
                    <a
                      href={badge.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accents-5)] hover:text-[var(--geist-foreground)]"
                    >
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[15px] font-semibold text-[var(--geist-foreground)] border-b border-[var(--accents-2)] pb-3">
            Posts
          </h2>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                postedBy={post.postedBy?.userName}
                postedByPic={post.postedBy?.picture}
                postedById={post.postedBy?._id}
                createdAt={post.createdAt}
                head={post.head}
                description={post.description}
                image={post.image?.secure_url}
                likes={post.likes || []}
                type={post.type}
                poll={post.poll}
                codeSnippet={post.codeSnippet}
                isRepost={post.isRepost}
              />
            ))
          ) : (
            <p className="text-[14px] text-[var(--accents-5)] py-8 text-center border border-dashed border-[var(--accents-2)] rounded-lg">
              No posts yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
