"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "react-toastify";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { signup } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    headLine: "",
    about: "",
    password: "",
  });

  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log(form);
    const response = await signup(form);
    if (response.success) {
      toast.success("Signup successful!");
      router.push("/login");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
      <form
        onSubmit={handleSignup}
        className="h-[max-content] w-[max-content] flex flex-col items-center justify-center gap-3"
      >
        <input
          type="text"
          name="userName" // changed to match state key
          placeholder="Username"
          value={form.userName}
          onChange={change}
          className="h-[6dvh] w-[250px] px-3 text-zinc-300 placeholder:text-zinc-300 text-[.85rem] outline-none border border-zinc-700 rounded-md bg-zinc-900"
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={change}
          className="h-[6dvh] w-[250px] px-3 text-zinc-300 placeholder:text-zinc-300 text-[.85rem] outline-none border border-zinc-700 rounded-md bg-zinc-900"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={change}
          className="h-[6dvh] w-[250px] px-3 text-zinc-300 placeholder:text-zinc-300 text-[.85rem] outline-none border border-zinc-700 rounded-md bg-zinc-900"
        />
        <input
          type="text"
          name="headLine"
          placeholder="Headline"
          value={form.headLine}
          onChange={change}
          className="h-[6dvh] w-[250px] px-3 text-zinc-300 placeholder:text-zinc-300 text-[.85rem] outline-none border border-zinc-700 rounded-md bg-zinc-900"
        />
        <input
          type="text"
          name="about"
          placeholder="About"
          value={form.about}
          onChange={change}
          className="h-[6dvh] w-[250px] px-3 text-zinc-300 placeholder:text-zinc-300 text-[.85rem] outline-none border border-zinc-700 rounded-md bg-zinc-900"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={change}
          className="h-[6dvh] w-[250px] px-3 text-zinc-300 placeholder:text-zinc-300 text-[.85rem] outline-none border border-zinc-700 rounded-md bg-zinc-900"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={change}
          className="h-[6dvh] w-[250px] px-3 text-zinc-300 placeholder:text-zinc-300 text-[.85rem] outline-none border border-zinc-700 rounded-md bg-zinc-900"
        />
        <button
          className="rounded-md border border-zinc-700 hover:bg-zinc-800 text-[.8rem] px-4 py-2 bg-zinc-900"
          type="submit"
        >
          Signup
        </button>
      </form>

      <h3 className="gap-3">
        Already have an Account &nbsp;
        <Link href={"/login"} className="text-blue-600">
          Login
        </Link>
      </h3>
    </div>
  );
};

export default Page;
