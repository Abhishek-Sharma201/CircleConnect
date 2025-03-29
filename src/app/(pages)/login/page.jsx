"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";

const page = () => {
  const { login, googleLogin } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await login(email, password);
    if (response.success) {
      toast.success("Login successful!");
      router.push("/");
    } else {
      toast.error(response.message);
    }
  };

  const handleGoogleLogin = async (creds) => {
    const response = await googleLogin(creds.credential);
    if (response.success) {
      toast.success("Google Login successful!");
      router.push("/");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
      <div className="h-[max-content] w-[max-content] flex flex-col items-center justify-center gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className=" h-[6dvh] w-[250px] px-3 text-zinc-300 placeholder:text-zinc-300 text-[.85rem] outline-none border border-zinc-700 rounded-md bg-zinc-900 "
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className=" h-[6dvh] w-[250px] px-3 text-zinc-300 placeholder:text-zinc-300 text-[.85rem] outline-none border border-zinc-700 rounded-md bg-zinc-900 "
        />
      </div>

      <button
        className=" h-[7dvh] w-[250px] rounded-md border border-blue-500 hover:bg-zinc-800 text-[.95rem] px-4 py-2 bg-blue-700"
        onClick={handleLogin}
      >
        Login
      </button>

      <hr className=" w-[250px] h-[1px]  " />

      <GoogleLogin
        ux_mode="popup"
        onSuccess={handleGoogleLogin}
        onError={() => {
          toast.error(`Google auth Error`);
        }}
      />

      <h3 className="gap-3 text-[.9rem] ">
        Don't have an Account &nbsp;
        <Link href={"/signup"} className="text-blue-600">
          Signup
        </Link>
      </h3>
    </div>
  );
};

export default page;
