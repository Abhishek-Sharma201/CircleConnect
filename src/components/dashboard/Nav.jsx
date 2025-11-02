"use client";

import { apiURL } from "@/src/constants";
import { Bell, Search } from "@/src/utils/SVG";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import SearchList from "./SearchList";
import { useAuth } from "@/src/hooks/useAuth";
import Link from "next/link";

const Nav = () => {
  const path = usePathname();
  const router = useRouter();
  const [value, setValue] = useState("");
  const [matchedUsers, setMatchedUsers] = useState([]);
  const { user } = useAuth();

  const handleChange = async (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (newValue.trim().length > 0) {
      try {
        const response = await fetch(`${apiURL}/api/search/get/${newValue}`);
        const data = await response.json();
        if (data.success) {
          setMatchedUsers(data.users);
          console.log(matchedUsers);
        } else {
          setMatchedUsers([]);
        }
      } catch (error) {
        console.error("Search API error:", error);
        setMatchedUsers([]);
      }
    } else {
      setMatchedUsers([]);
    }
  };

  return (
    <div className="w-full h-[9.8dvh] flex items-center justify-between p-3 relative bg-transparent">
      <div className="w-[450px] h-full flex items-center justify-start gap-6">
        <h1 className="text-[.95rem] text-zinc-300 text-center min-w-[60px] max-w-[200px] truncate">
          {path ? path : "/"}
        </h1>
        <span className="h-[70%] w-[1px] bg-zinc-600" />
        <h1>
          <span className="text-[.9rem] text-zinc-300"> Welcome, </span>
          {user?.firstName + " " + user?.lastName}
        </h1>
      </div>

      <div className="w-[max-content] h-full flex items-center justify-center gap-6 relative">
        <div className="w-[max-content] h-full flex flex-col items-center justify-center">
          <div className="w-[max-content] h-[90%] flex items-center justify-center rounded-md gap-2 p-1">
            <button
              className="h-full rounded-md bg-gradient-to-r from-blue-900 via-blue-600 to-blue-700 
             bg-[length:200%_100%] 
             animate-gradient-shadow text-[.9rem] py-1 px-2 outline-none"
            >
              <Search />
            </button>
            <span className="h-full w-[1px] bg-zinc-700" />
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Search peoples..."
              className="h-full w-[300px] px-1 bg-transparent border-none outline-none placeholder:text-zinc-300 placeholder:text-[.8rem] text-zinc-300 text-[.8rem]"
              onChange={handleChange}
              value={value}
              autoComplete="false"
            />
          </div>
          {value && matchedUsers.length > 0 && (
            <div className="absolute left-[3rem] top-full mt-2 w-[315px] border border-zinc-700 rounded-md shadow-lg z-10 backdrop-blur-md gap-1">
              <ul>
                {matchedUsers.map((user) => (
                  <SearchList
                    key={user._id}
                    {...user}
                    onClick={() => router.push(`/dashboard/${user.userName}`)}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
        <ul className="w-[max-content] h-full flex items-center justify-center gap-3 rounded-md px-4">
          <li className="cursor-pointer p-2 border border-zinc-800 rounded-md hover:bg-zinc-800">
            <Bell />
          </li>
          <Link
            className="cursor-pointer p-2 rounded-md hover:bg-zinc-800"
            href={`/dashboard/profile`}
          >
            <div className="h-[max-content] w-[max-content] flex flex-col items-center justify-center p-[1.5px] border-[1px] border-blue-600 rounded-full">
              <Image
                src={user?.picture || "/assets/pic1.jpg"}
                alt="proPic"
                height={40}
                width={40}
                className="rounded-full"
              />
            </div>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
