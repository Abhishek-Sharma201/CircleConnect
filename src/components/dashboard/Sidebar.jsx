"use client";

import React, { useState } from "react";
import Name from "./Name";
import {
  Dashboard,
  Logout,
  Moon,
  Node,
  Notifications,
  Text,
  ToggleIcon,
} from "@/src/utils/SVG";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const { logout } = useAuth();
  const [path, setPath] = useState("board");

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
        isOpen ? "w-[250px]  " : "w-[70px]"
      } h-full flex flex-col items-start justify-start bg-transparent px-2 py-5 gap-[18px]`}
    >
      <div className=" h-[max-content] w-full flex items-center justify-center gap-8 ">
        {isOpen ? <Name /> : ""}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-md ${
            isOpen
              ? `bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-700 
             bg-[length:200%_100%] 
             animate-gradient-shadow`
              : "bg-gradient-to-r from-zinc-700 via-zinc-900 to-zinc-950/30"
          } text-[.9rem] py-2 px-2 outline-none h-[max-content]`}
        >
          <ToggleIcon />
        </button>
      </div>
      {/* <hr className="w-full h-[1px] bg-zinc-800 border-none dark:bg-zinc-700" /> */}

      <ul className=" w-full h-[max-content] p-2 flex flex-col items-center justify-center gap-3 text-[.95rem] ">
        <Link
          href={"/dashboard"}
          onClick={() => setPath("board")}
          className={`w-full ${
            isOpen ? "px-4" : "px-2"
          } py-2 flex items-center ${
            isOpen ? "justify-between" : "justify-center"
          } rounded-md  ${
            path == "board"
              ? " bg-gradient-to-r from-blue-700 via-blue-900 to-blue-950/30 "
              : "bg-gradient-to-r from-zinc-700 via-zinc-900 to-zinc-950/30"
          }`}
        >
          {isOpen ? (
            <>
              <Dashboard />
              Board
            </>
          ) : (
            <Dashboard />
          )}
        </Link>

        <Link
          href={"/dashboard/posts"}
          onClick={() => setPath("posts")}
          className={`w-full ${
            isOpen ? "px-4" : "px-2"
          } py-2 flex items-center ${
            isOpen ? "justify-between" : "justify-center"
          } rounded-md ${
            path == "posts"
              ? "bg-gradient-to-r from-blue-700 via-blue-900 to-blue-950/30"
              : "bg-gradient-to-r from-zinc-700 via-zinc-900 to-zinc-950/30"
          }`}
        >
          {isOpen ? (
            <>
              <Text h={"16px"} w={"16px"} />
              Posts
            </>
          ) : (
            <Text h={"16px"} w={"16px"} />
          )}
        </Link>

        <Link
          href={"/dashboard/notifications"}
          onClick={() => setPath("notifications")}
          className={`w-full ${
            isOpen ? "px-4" : "px-2"
          } py-2 flex items-center ${
            isOpen ? "justify-between" : "justify-center"
          } rounded-md  ${
            path == "notifications"
              ? "bg-gradient-to-r from-blue-700 via-blue-900 to-blue-950/30"
              : "bg-gradient-to-r from-zinc-700 via-zinc-900 to-zinc-950/30"
          }`}
        >
          {isOpen ? (
            <>
              <Notifications h={"16px"} w={"16px"} />
              Notifications
            </>
          ) : (
            <Notifications h={"16px"} w={"16px"} />
          )}
        </Link>

        <Link
          href={"/dashboard/connections"}
          onClick={() => setPath("connections")}
          className={`w-full ${
            isOpen ? "px-4" : "px-2"
          } py-2 flex items-center ${
            isOpen ? "justify-between" : "justify-center"
          } rounded-md  ${
            path == "connections"
              ? "bg-gradient-to-r from-blue-700 via-blue-900 to-blue-950/30"
              : "bg-gradient-to-r from-zinc-700 via-zinc-900 to-zinc-950/30"
          }`}
        >
          {isOpen ? (
            <>
              <Node h={"16px"} w={"16px"} />
              Connections
            </>
          ) : (
            <Node h={"16px"} w={"16px"} />
          )}
        </Link>
      </ul>

      <div className="flex-grow"></div>
      {/* <hr className="w-full h-[1px] bg-zinc-800 border-none dark:bg-zinc-700 self-end" /> */}

      <button
        className={`w-full ${
          isOpen ? "px-4" : "px-2"
        } py-2 flex items-center text-[.8rem] font-semibold ${
          isOpen ? "justify-between" : "justify-center"
        } rounded-md bg-zinc-950/30 hover:bg-zinc-900/30`}
        onClick={handleLogout}
      >
        {isOpen ? (
          <>
            <Logout />
            Logout
          </>
        ) : (
          <Logout />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
