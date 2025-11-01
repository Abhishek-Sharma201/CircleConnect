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
  // const [openForm, setOpenForm] = useState(false);
  // const [postForm, setPostForm] = useState({
  //   head: "",
  //   description: "",
  // });
  // const [imageFile, setImageFile] = useState(null);
  const router = useRouter();
  const errorToastShown = useRef(false);

  const fetchUserPosts = async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`${apiURL}/api/posts/get/${user._id}`);
      const data = await res.json();

      console.log("API Response:", data); // Debugging line

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

  // const handleFileChange = (e) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setImageFile(e.target.files[0]);
  //   }
  // };

  // const submitPost = async (e) => {
  //   e.preventDefault();
  //   if (!postForm.head.trim() || !postForm.description.trim()) {
  //     toast.error("Please fill in all required fields");
  //     return;
  //   }
  //   let imageData = "";
  //   if (imageFile) {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(imageFile);
  //     imageData = await new Promise((resolve, reject) => {
  //       reader.onload = () => resolve(reader.result);
  //       reader.onerror = (error) => reject(error);
  //     });
  //   } else {
  //     imageData = "https://via.placeholder.com/150";
  //   }
  //   try {
  //     const postData = {
  //       postedBy: user._id,
  //       head: postForm.head,
  //       description: postForm.description,
  //       image: imageData,
  //     };
  //     const res = await fetch(`${apiURL}/api/posts/post`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(postData),
  //     });
  //     const data = await res.json();
  //     if (!res.ok) {
  //       throw new Error(data.message);
  //     }
  //     toast.success(data.message);
  //     console.log(data.post);
  //     setPosts((prev) => [data.post, ...prev]);
  //     setPostForm({ head: "", description: "" });
  //     setImageFile(null);
  //     setOpenForm(false);
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="h-full w-full flex flex-col items-start justify-start p-6 overflow-x-hidden overflow-y-scroll">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold">Your Posts</h1>
        <Link
          href={"/create"}
          className="rounded-md bg-blue-600 text-white px-4 py-2"
        >
          Create
        </Link>
      </div>
      {/* {openForm && (
        <div className="w-full h-[100dvh] fixed top-0 left-0 z-10 bg-black bg-opacity-70 flex flex-col items-center justify-center gap-4">
          <form
            onSubmit={submitPost}
            className="w-[max-content] h-[max-content] bg-zinc-950 flex flex-col items-start justify-center rounded-[8px] gap-4 shadow-xl p-6"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="head" className="font-medium text-sm text-white">
                Head (Title)
              </label>
              <input
                type="text"
                name="head"
                id="head"
                value={postForm.head}
                onChange={handlePostFormChange}
                placeholder="Enter post title"
                className="w-[320px] h-[5dvh] rounded px-2 py-1 text-[.9rem] font-medium text-white border bg-zinc-800 border-zinc-800 focus:outline focus:outline-zinc-500"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="font-medium text-sm text-white"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={postForm.description}
                onChange={handlePostFormChange}
                placeholder="Enter post description"
                className="w-[320px] h-[10dvh] rounded px-2 py-1 text-[.9rem] font-medium text-white border bg-zinc-800 border-zinc-800 focus:outline focus:outline-zinc-500"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="image" className="font-medium text-sm text-white">
                Upload Image (optional)
              </label>
              <div className="relative w-[320px]">
                <label
                  htmlFor="image"
                  className="flex w-full h-[6dvh] rounded px-4 py-2 text-[.9rem] font-medium bg-zinc-200 border border-zinc-800 text-zinc-600 cursor-pointer items-center justify-center"
                >
                  {imageFile ? imageFile.name : "Browse"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="image"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="w-full flex items-center justify-between">
              <button
                type="submit"
                className="w-[150px] h-[6dvh] p-2 bg-blue-500 text-white font-medium rounded"
              >
                Add Post
              </button>
              <button
                onClick={() => setOpenForm(false)}
                type="button"
                className="w-[150px] h-[6dvh] p-2 bg-red-500 text-white font-medium rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )} */}
      <div className="mt-6 grid grid-cols-3 w-full gap-4">
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
