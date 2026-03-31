"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Nav from "../components/home/Nav";
import Hero from "../components/home/Hero";
import Background from "../components/home/Background";
import Features from "../components/home/Features";
import Footer from "../components/home/Footer";
import Loader from "../components/dashboard/Loader";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading)
    return (
      <main className="h-[100dvh] w-full flex flex-col items-center justify-center">
        <Loader />
      </main>
    );

  return (
    <main className="relative w-full min-h-screen flex flex-col items-start justify-start">
      <Background />
      <div className="z-[4] w-full flex flex-col items-start justify-start">
        <Nav />
        <div className="pt-[60px] w-full">
          <Hero />
          <Features />
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Page;
