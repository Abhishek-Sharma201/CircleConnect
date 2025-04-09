"use client";

import React, { useState, useEffect } from "react";
import PostCard from "@/src/components/dashboard/PostCard";
import Loader from "@/src/components/dashboard/Loader";
import { apiURL } from "@/src/constants";
import { toast } from "react-toastify";

const Page = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllPosts = async () => {
    try {
      const res = await fetch(`${apiURL}/api/posts/getAll`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.posts)) {
        throw new Error(data.message || "Invalid response structure");
      }
      setPosts(data.posts);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full h-full grid grid-cols-3 gap-4 p-4 overflow-x-hidden overflow-y-scroll">
      {posts.length > 0 ? (
        posts.map((v, index) => (
          <PostCard
            key={v._id || index}
            id={v._id}
            postedBy={v.postedBy?.userName}
            createdAt={v.createdAt}
            head={v.head}
            description={v.description}
            image={v.image?.secure_url}
            postedByPic={v.postedBy?.picture}
          />
        ))
      ) : (
        <p className="text-gray-400">No posts found.</p>
      )}
    </div>
  );
};

export default Page;
