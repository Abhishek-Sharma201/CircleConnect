"use client";

import { DummyUsers, MainUser } from "@/src/utils/dummyData";
import { Bell, Search } from "@/src/utils/SVG";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import SearchList from "./SearchList";

const Nav = () => {
  const path = usePathname();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [matchedUsers, setMatchedUsers] = useState([]);

  const handleChange = async (e) => {
    const newValue = e.target.value.toLowerCase();
    setValue(newValue);
    console.log(newValue);

    const users = DummyUsers.filter((user) =>
      user.name.toLowerCase().includes(newValue)
    );
    setMatchedUsers(users);
    console.log(users);
  };

  return (
    <div className="w-full h-[10dvh] flex items-center justify-between p-4 border-b border-b-zinc-700 relative">
      <div className="w-[max-content] h-full flex items-center justify-center gap-6">
        <h1 className="text-[.95rem] text-zinc-400 text-center">
          {path ? path : "/"}
        </h1>
        <span className="h-full w-[1px] bg-zinc-700" />
        <h1>Hi, {MainUser.name}</h1>
      </div>
      <div className="w-[max-content] h-full flex items-center justify-center gap-6 relative">
        {/* Search Input and Button Container */}
        <div className="w-[max-content] h-full flex flex-col items-center justify-center">
          <div className="w-[max-content] h-full flex items-center justify-center rounded-md border gap-2 p-1 border-zinc-800">
            <button className="h-full px-2 bg-blue-700 hover:bg-zinc-800 rounded-md">
              <Search />
            </button>
            <span className="h-full w-[1px] bg-zinc-700" />
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Search here..."
              className="h-full w-[300px] px-1 bg-transparent border-none outline-none placeholder:text-zinc-300 placeholder:text-[.8rem] text-zinc-300 text-[.8rem]"
              onChange={handleChange}
              value={value}
            />
          </div>
          {value && matchedUsers.length > 0 && (
            <div className="absolute left-[3rem] top-full mt-2 w-[315px] border border-zinc-700 rounded-md shadow-lg z-10 backdrop-blur-md gap-1">
              <ul>
                {matchedUsers.map((user) => (
                  <SearchList key={user._id} {...user} />
                ))}
              </ul>
            </div>
          )}
        </div>
        <ul className="w-[max-content] h-full flex items-center justify-center gap-3 rounded-md px-4">
          <li className="cursor-pointer p-2 border border-zinc-800 rounded-md hover:bg-zinc-800">
            <Bell />
          </li>
          <li
            className="cursor-pointer p-2 rounded-md hover:bg-zinc-800"
            onClick={() => router.push("/profile")}
          >
            <div className="h-[max-content] w-[max-content] flex flex-col items-center justify-center p-[1.5px] border-[1px] border-blue-800 rounded-full">
              <Image
                src={"/assets/pic1.jpg"}
                alt="proPic"
                height={40}
                width={40}
                className="rounded-full"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
