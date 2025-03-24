"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "./hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Page = () => {
  const router = useRouter();
  const { logout, isAuthenticated, user, loading } = useAuth();

  const handleLogout = async () => {
    const response = await logout();
    if (response.success) {
      toast.success("Logout successful!");
      router.push("/login");
    } else {
      toast.error(response.message);
    }
  };

  if (loading) {
    return (
      <main className="h-screen w-full flex flex-col items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center gap-8">
      {isAuthenticated ? (
        <Image
          src={user?.picture}
          height={100}
          width={100}
          alt="proPic"
          className=" rounded-full "
        />
      ) : (
        ""
      )}

      <h1>
        {isAuthenticated ? `Welcome, ${user?.email}` : "You must log in first."}
      </h1>

      {isAuthenticated ? (
        <button
          className="rounded-md border border-zinc-700 hover:bg-zinc-800 text-[.8rem] px-4 py-2 bg-zinc-900"
          onClick={handleLogout}
        >
          Logout
        </button>
      ) : (
        <Link
          className="rounded-md border border-zinc-700 hover:bg-zinc-800 text-[.8rem] px-4 py-2 bg-zinc-900"
          href={"/login"}
        >
          Login
        </Link>
      )}
    </main>
  );
};

export default Page;
