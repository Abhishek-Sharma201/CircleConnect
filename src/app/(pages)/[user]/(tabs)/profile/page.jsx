"use client";

import React, { useState, useEffect } from "react";
import Badge from "@/src/components/dashboard/Badge";
import PostCard from "@/src/components/dashboard/PostCard";
import { useAuth } from "@/src/hooks/useAuth";
import { DummyBadges, DummyPosts } from "@/src/utils/dummyData";
import Image from "next/image";

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

  useEffect(() => {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full flex items-start justify-start py-3 px-2 gap-2 overflow-y-scroll">
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
              className="bg-transparent text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-zinc-700"
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
              className="bg-transparent text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-zinc-700"
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
              className="bg-transparent text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-zinc-700"
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
              className="bg-transparent text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-zinc-700"
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
              className="bg-transparent text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-zinc-700"
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
              className="bg-transparent text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-zinc-700"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white text-[.8rem] rounded-md px-4 py-1"
        >
          Save
        </button>
      </form>
      <hr className="w-[1px] h-full bg-zinc-800 border-none dark:bg-zinc-700" />
      <div className="w-full h-full flex flex-col items-start gap-6 px-3 overflow-x-hidden overflow-y-scroll">
        <div className="w-[max-content] flex flex-col items-start gap-5 px-4">
          <h1>Your Skill Badges</h1>
          <div className="flex flex-wrap gap-4">
            {DummyBadges.map((v) => (
              <Badge key={v._id} {...v} />
            ))}
          </div>
        </div>
        <hr className="w-full h-[1px] bg-zinc-800 border-none dark:bg-zinc-700" />
        <div className="w-full flex flex-col items-start gap-6 px-3 overflow-y-scroll">
          <h1>Posts</h1>
          <div className="grid grid-cols-2 gap-8">
            {DummyPosts.map((v) => (
              <PostCard key={v._id} {...v} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
