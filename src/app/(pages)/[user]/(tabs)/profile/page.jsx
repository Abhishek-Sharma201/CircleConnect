"use client";

import Badge from "@/src/components/dashboard/Badge";
import PostCard from "@/src/components/dashboard/PostCard";
import { useAuth } from "@/src/hooks/useAuth";
import { DummyBadges, DummyPosts } from "@/src/utils/dummyData";
import Image from "next/image";
import React from "react";

const page = () => {
  const { user } = useAuth();

  return (
    <div className=" w-full h-full flex items-start justify-start py-3 px-2 gap-2 overflow-y-scroll ">
      <form className="w-auto h-full flex flex-col items-center justify-start px-3 gap-8">
        <div className=" h-[max-content] w-[max-content] flex flex-col items-center justify-center p-1 border-[3px] border-blue-900 rounded-full ">
          <Image
            src={user?.picture || "/assets/pic1.jpg"}
            alt="proPic"
            height={140}
            width={140}
            className=" rounded-full"
          />
        </div>
        <div className=" h-[max-content] w-[max-content] grid grid-cols-2 gap-4 ">
          <div className=" h-[max-content] w-[max-content] flex flex-col items-start justify-center gap-2 ">
            <h6 className=" ml-2 text-[.8rem] text-zinc-300 ">First Name</h6>
            <input
              type="text"
              name="fName"
              id="fName"
              placeholder="first name"
              className=" bg-transparent text-zinc-300 placeholder:text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-zinc-700 "
              required
            />
          </div>
          <div className=" h-[max-content] w-[max-content] flex flex-col items-start justify-center gap-2 ">
            <h6 className=" ml-2 text-[.8rem] text-zinc-300 ">Last Name</h6>
            <input
              type="text"
              name="lName"
              id="lName"
              placeholder="last name"
              className=" bg-transparent text-zinc-300 placeholder:text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-zinc-700 "
              required
            />
          </div>
          <div className=" h-[max-content] w-[max-content] flex flex-col items-start justify-center gap-2 ">
            <h6 className=" ml-2 text-[.8rem] text-zinc-300 ">Email</h6>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="email"
              className=" bg-transparent text-zinc-300 placeholder:text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-zinc-700 "
              required
            />
          </div>
          <div className=" h-[max-content] w-[max-content] flex flex-col items-start justify-center gap-2 ">
            <h6 className=" ml-2 text-[.8rem] text-zinc-300 ">Username</h6>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="username"
              className=" bg-transparent text-zinc-300 placeholder:text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-zinc-700 "
              required
            />
          </div>
          <div className=" h-[max-content] w-[max-content] flex flex-col items-start justify-center gap-2 ">
            <h6 className=" ml-2 text-[.8rem] text-zinc-300 ">Head Line</h6>
            <input
              type="text"
              name="headline"
              id="headline"
              placeholder="head line"
              className=" bg-transparent text-zinc-300 placeholder:text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-zinc-700 "
              required
            />
          </div>
          <div className=" h-[max-content] w-[max-content] flex flex-col items-start justify-center gap-2 ">
            <h6 className=" ml-2 text-[.8rem] text-zinc-300 ">About</h6>
            <input
              type="text"
              name="about"
              id="about"
              placeholder="about"
              className=" bg-transparent text-zinc-300 placeholder:text-zinc-300 rounded-md px-4 py-2 text-[.9rem] border border-zinc-700 "
              required
            />
          </div>
        </div>
      </form>
      <hr className="w-[1px] h-full bg-zinc-800 border-none dark:bg-zinc-700" />
      <div className="  w-full h-full flex flex-col items-start justify-start gap-6 ">
        <div className=" w-[max-content] h-[max-content] flex flex-col items-start justify-start gap-5 px-4 ">
          <h1>Your Skill Badegs</h1>
          <div className="w-[max-content] h-[max-content] flex flex-wrap items-start justify-start gap-4">
            {DummyBadges.map((v) => {
              return <Badge {...v} key={v._id} />;
            })}
          </div>
        </div>
        <hr className="w-full h-[1px] bg-zinc-800 border-none dark:bg-zinc-700" />
        <div className="w-full h-full flex flex-col items-start justify-start gap-6 px-3 overflow-x-hidden overflow-y-scroll">
          <h1>Posts</h1>
          <div className="w-[max-content] h-[max-content] grid grid-cols-2 gap-8">
            {DummyPosts.map((v) => {
              return <PostCard {...v} key={v._id} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
