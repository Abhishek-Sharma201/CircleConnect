"use client";

import React, { useState, useEffect, useRef } from "react";
import Badge from "@/src/components/dashboard/Badge";
import PostCard from "@/src/components/dashboard/PostCard";
import { useAuth } from "@/src/hooks/useAuth";
import Image from "next/image";
import { toast } from "react-toastify";
import { apiURL } from "@/src/constants";
import Loader from "@/src/components/dashboard/Loader";

const Page = () => {
  const { user, loading } = useAuth();
  const [form, setForm] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    headLine: "",
    about: "",
  });
  const [openInp, setOpenInp] = useState(false);
  const [newBadge, setNewBadge] = useState("");
  const [badges, setBadges] = useState([]);
  const [posts, setPosts] = useState([]);
  const errorToastShown = useRef(false);

  useEffect(() => {
    console.log(`user: ${user}`);
    if (user) {
      setForm({
        userName: user.userName || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        headLine: user.headLine || "",
        about: user.about || "",
      });
    }
  }, [user]);

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

  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", form);
  };

  const handleNewBadgeChange = (e) => {
    setNewBadge(e.target.value);
  };

  const addBadge = async () => {
    if (!newBadge.trim()) {
      toast.error("Badge name cannot be empty");
      return;
    }
    try {
      const res = await fetch(`${apiURL}/api/badge/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user?._id,
          name: newBadge,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      toast.success(data.message);
      setBadges((prev) => [...prev, data.badge]);
      setNewBadge("");
      setOpenInp(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchBadges = async () => {
    try {
      const f = await fetch(`${apiURL}/api/badge/get/${user?._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const j = await f.json();
      if (!f.ok) toast.error(j.message);
      setBadges(j.badges);
      console.log(badges);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBadges();
    }
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full h-full flex items-start justify-start py-3 px-2 gap-2 overflow-x-hidden overflow-y-scroll">
      <form
        onSubmit={submit}
        className="w-[680px] h-full flex flex-col items-center justify-start px-3 gap-8"
      >
        <div className="h-[max-content] w-[max-content] flex flex-col items-center justify-center p-1 border-[3px] border-blue-900 rounded-full">
          <Image
            src={user?.picture || "/assets/pic1.jpg"}
            alt="Profile Picture"
            height={140}
            width={140}
            className="rounded-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-start gap-2">
            <h6 className="ml-2 text-[.8rem] text-zinc-300">First Name</h6>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={change}
              placeholder="first name"
              className=" text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-gray-800/40 bg-zinc-950/10 "
              required
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <h6 className="ml-2 text-[.8rem] text-zinc-300">Last Name</h6>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={change}
              placeholder="last name"
              className=" text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-gray-800/40 bg-zinc-950/10"
              required
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <h6 className="ml-2 text-[.8rem] text-zinc-300">Email</h6>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={change}
              placeholder="email"
              className=" text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-gray-800/40 bg-zinc-950/10"
              required
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <h6 className="ml-2 text-[.8rem] text-zinc-300">Username</h6>
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={change}
              placeholder="username"
              readOnly
              className=" text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-gray-800/40 bg-zinc-950/10"
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <h6 className="ml-2 text-[.8rem] text-zinc-300">Head Line</h6>
            <input
              type="text"
              name="headLine"
              value={form.headLine}
              onChange={change}
              placeholder="head line"
              className=" text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-gray-800/40 bg-zinc-950/10"
              required
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <h6 className="ml-2 text-[.8rem] text-zinc-300">About</h6>
            <input
              type="text"
              name="about"
              value={form.about}
              onChange={change}
              placeholder="about"
              className=" text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-gray-800/40 bg-zinc-950/10"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="rounded-md bg-gradient-to-r from-blue-900 via-blue-600 to-blue-700 
             bg-[length:200%_100%] 
             animate-gradient-shadow text-[.9rem] py-[7px] px-3 outline-none h-[max-content]"
        >
          Save
        </button>
      </form>
      {/* <hr className="w-[1px] h-full bg-zinc-800 border-none dark:bg-zinc-700" /> */}
      <div className="w-full h-full flex flex-col items-start gap-6 px-3 overflow-x-hidden overflow-y-scroll">
        <div className="w-full flex flex-col items-start gap-3 px-4">
          <h1>Your Badges</h1>
          <div className="flex flex-wrap gap-4">
            {badges?.map((v, i) => (
              <Badge key={v._id || i} {...v} />
            ))}
            {openInp && (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  name="newBadge"
                  id="newBadge"
                  placeholder="name?"
                  value={newBadge}
                  onChange={handleNewBadgeChange}
                  className="h-full w-[100px] px-3 rounded-md  bg-zinc-950/30 text-zinc-400 text-[.9rem]"
                />
                <button
                  type="button"
                  className="rounded-md text-center  bg-gradient-to-r from-blue-900 via-blue-600 to-blue-700 
                   bg-[length:200%_100%] 
                   animate-gradient-shadow text-[.9rem] py-[6px] px-3 outline-none h-[max-content]"
                  onClick={addBadge}
                >
                  Add
                </button>
              </div>
            )}
            <button
              type="button"
              className={`rounded-md text-center bg-gradient-to-r ${
                openInp
                  ? "from-red-900 via-red-600 to-red-700 "
                  : "from-blue-900 via-blue-600 to-blue-700 "
              }
             bg-[length:200%_100%] 
             animate-gradient-shadow text-[.9rem] py-[7px] px-3 outline-none h-[max-content]`}
              onClick={() => setOpenInp(!openInp)}
            >
              {openInp ? "cancel" : "+ Create"}
            </button>
          </div>
          <h6 className="text-[10px] text-zinc-400">
            <span className="text-orange-400">NOTE</span> : Your Badges describe
            you more
          </h6>
        </div>
        {/* <hr className="w-full h-[1px] bg-zinc-800 border-none dark:bg-zinc-700" /> */}
        <div className="w-full flex flex-col items-start gap-6 px-3 overflow-y-scroll">
          <h1>Posts</h1>
          <div className="grid grid-cols-2 gap-4">
            {posts?.length > 0 ? (
              posts.map((v) => (
                <PostCard
                  key={v?._id}
                  id={v?._id}
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
      </div>
    </div>
  );
};

const page = React.memo(Page);

export default page;
