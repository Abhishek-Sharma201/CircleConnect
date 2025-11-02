"use client";

import React, { useState, useEffect, useRef } from "react";
import PostCard from "@/src/components/dashboard/PostCard";
import { useAuth } from "@/src/hooks/useAuth";
import { apiURL } from "@/src/constants";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "@/src/components/dashboard/Loader";
import Link from "next/link";

const Page = () => {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const errorToastShown = useRef(false);

  const fetchUserPosts = async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`${apiURL}/api/posts/get/${user._id}`);
      const data = await res.json();

      console.log("API Response:", data);

      if (!res.ok || !data.posts || !Array.isArray(data.posts)) {
        throw new Error(data.message || "Invalid response structure");
      }

      setPosts(data.posts);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      errorToastShown.current = false;
      fetchUserPosts();
    }
  }, [user]);

  const handlePostFormChange = (e) => {
    const { name, value } = e.target;
    setPostForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="h-full w-full flex flex-col items-start justify-start p-6 overflow-x-hidden overflow-y-scroll">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold">Your Posts</h1>
        <Link
          href={"/create"}
          className="rounded-md bg-gradient-to-r from-blue-900 via-blue-600 to-blue-700 
                   bg-[length:200%_100%] 
                   animate-gradient-shadow text-white px-4 py-2"
        >
          Create
        </Link>
      </div>

      <div
        className="mt-6 w-full gap-4
                columns-1 sm:columns-1 md:columns-2 lg:columns-3
                [&_>_div]:break-inside-avoid"
      >
        {posts?.length > 0 ? (
          posts.map((v) => (
            <PostCard
              key={v?._id}
              id={v._id}
              postedBy={v?.postedBy?.userName}
              createdAt={v?.createdAt}
              head={v?.head}
              description={v?.description}
              image={v?.image?.secure_url}
              postedByPic={v?.postedBy?.picture}
            />
          ))
        ) : (
          <p className="text-gray-400">No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
