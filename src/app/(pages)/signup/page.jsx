"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "react-toastify";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const { signup } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async () => {
    const response = await signup(name, email, password);
    if (response.success) {
      toast.success("Signup successful!");
      router.push("/login");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
      <div className="h-[max-content] w-[max-content] flex flex-col items-center justify-center gap-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-[6dvh] w-[250px] px-3 text-zinc-300 placeholder:text-zinc-300 text-[.85rem] outline-none border border-zinc-700 rounded-md bg-zinc-900"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-[6dvh] w-[250px] px-3 text-zinc-300 placeholder:text-zinc-300 text-[.85rem] outline-none border border-zinc-700 rounded-md bg-zinc-900"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-[6dvh] w-[250px] px-3 text-zinc-300 placeholder:text-zinc-300 text-[.85rem] outline-none border border-zinc-700 rounded-md bg-zinc-900"
        />
      </div>

      <button
        className="rounded-md border border-zinc-700 hover:bg-zinc-800 text-[.8rem] px-4 py-2 bg-zinc-900"
        onClick={handleSignup}
      >
        Signup
      </button>

      <h3 className="gap-3">
        Already have an Account &nbsp;
        <Link href={"/login"} className="text-blue-600">
          Login
        </Link>
      </h3>
    </div>
  );
};

export default page;
