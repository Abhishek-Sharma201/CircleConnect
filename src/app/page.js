"use client";

import Link from "next/link";
import React from "react";
import Nav from "../components/home/Nav";
import Hero from "../components/home/Hero";
import Background from "../components/home/Background";
import Features from "../components/home/Features";
import Footer from "../components/home/Footer";

const page = () => {
  return (
    <main className=" relative w-full h-max-content flex flex-col items-start justify-start">
      <Background />
      <div className=" z-[4] w-full h-max-content flex flex-col items-start justify-start ">
        <Nav />
        <Hero />
        <Features />
        <Footer />
      </div>
    </main>
  );
};

export default page;
