"use client";

import React, { useState, useEffect } from "react";
import PostCard from "@/src/components/dashboard/PostCard";
import Loader from "@/src/components/dashboard/Loader";
import { apiURL } from "@/src/constants";
import { toast } from "react-toastify";
import ShaderAnimation from "@/src/components/21devs/ShaderAnimation";

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
    <div className=" h-full w-full flex flex-col items-center justify-center relative overflow-hidden ">
      
      <div
        className=" mt-3 z-10 overflow-y-scroll h-[max-content] w-full gap-3 p-3
                columns-1 sm:columns-1 md:columns-2 lg:columns-3
                [&_>_div]:break-inside-avoid bg-transparent"
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
