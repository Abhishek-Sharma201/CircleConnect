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
    const handleLoad = () => {
      setIsLoading(false);
    };

    if (document.readyState === "complete") {
      setIsLoading(false);
    } else {
      window.addEventListener("load", handleLoad);

      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (isLoading)
    return (
      <main className="h-[100dvh] w-full flex flex-col items-center justify-center">
        <Loader />
      </main>
    );

  return (
    <main className="relative w-full h-max-content flex flex-col items-start justify-start">
      <Background />
      <div className="z-[4] w-full h-max-content flex flex-col items-start justify-start">
        <Nav />
        <Hero />
        <Features />
        <Footer />
      </div>
    </main>
  );
};

export default Page;
