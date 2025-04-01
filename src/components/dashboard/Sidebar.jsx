"use client";

import React, { useState } from "react";
import Name from "./Name";
import { Logout, Moon, ToggleIcon } from "@/src/utils/SVG";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.success) {
        toast.success("Logout successful!");
        router.push("/login");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      id="dashboard"
      className={`${
        isOpen ? "w-[250px]" : "w-[70px]"
      } h-full flex flex-col items-start justify-start border-r border-zinc-700 px-2 py-5 gap-[18px]`}
    >
      <div className=" h-[max-content] w-full flex items-center justify-center gap-8 ">
        {isOpen ? <Name /> : ""}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className=" rounded-sm bg-gradient-to-r from-blue-900 via-blue-600 to-blue-700 
             bg-[length:200%_100%] 
             animate-gradient-shadow text-[.9rem] py-1 px-1 outline-none h-[max-content] "
        >
          <ToggleIcon />
        </button>
      </div>
      <hr className="w-full h-[1px] bg-zinc-800 border-none dark:bg-zinc-700" />

      <ul className=" w-full h-[max-content] p-2 flex flex-col items-center justify-center gap-3 text-[.95rem] ">
        <Link
          href={"/dashboard/badges"}
          className={`w-full ${
            isOpen ? "px-4" : "px-2"
          } py-2 flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-700`}
        >
          {isOpen ? (
            <>
              Badges
              <Moon />
            </>
          ) : (
            <Moon />
          )}
        </Link>
        <Link
          href={"/dashboard/applied"}
          className={`w-full ${
            isOpen ? "px-4" : "px-2"
          } py-2 flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-700`}
        >
          {isOpen ? (
            <>
              Applied
              <Moon />
            </>
          ) : (
            <Moon />
          )}
        </Link>
        <Link
          href={"/dashboard/posts"}
          className={`w-full ${
            isOpen ? "px-4" : "px-2"
          } py-2 flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-700`}
        >
          {isOpen ? (
            <>
              Posts
              <Moon />
            </>
          ) : (
            <Moon />
          )}
        </Link>
        <Link
          href={"/dashboard/applicants"}
          className={`w-full ${
            isOpen ? "px-4" : "px-2"
          } py-2 flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-700`}
        >
          {isOpen ? (
            <>
              Applicants
              <Moon />
            </>
          ) : (
            <Moon />
          )}
        </Link>
      </ul>

      <div className="flex-grow"></div>
      <hr className="w-full h-[1px] bg-zinc-800 border-none dark:bg-zinc-700 self-end" />

      <button
        className={`w-full ${isOpen ? "px-4" : "px-2"} py-2 flex items-center ${
          isOpen ? "justify-between" : "justify-center"
        } rounded-md border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-700`}
        onClick={handleLogout}
      >
        {isOpen ? (
          <>
            Logout
            <Logout />
          </>
        ) : (
          <Logout />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
