import React from "react";
import Name from "../dashboard/Name";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";

const Nav = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className=" z-[10] h-[10dvh] w-full flex items-center justify-between px-8 lg:px-20 bg-transparent backdrop-blur-md fixed top-0 left-0 ">
      <Name />
      <ul className=" h-full w-[max-content] flex items-center justify-between gap-4 ">
        {isAuthenticated ? (
          <Link
            href={"/dashboard"}
            className=" px-4 py-2 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-700 
                   bg-[length:200%_100%] 
                   animate-gradient-shadow text-white overflow-hidden rounded-md text-[.9rem] "
          >
            Dashboard
          </Link>
        ) : (
          ""
        )}
        <Link
          href={"/login"}
          className=" cursor-pointer bg-zinc-900 text-zinc-300 text-[.9rem] border border-zinc-700 px-4 py-2 rounded-md "
        >
          Login
        </Link>
      </ul>
    </nav>
  );
};

export default Nav;
