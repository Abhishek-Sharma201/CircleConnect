"use client";
import React, { useEffect, useRef } from "react";
import RotatingText from "../bits/RotatingText";
import Link from "next/link";
import gsap from "gsap";

const Hero = () => {
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(badgeRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
      .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
      .fromTo(ctaRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
  }, []);

  return (
    <div className="relative w-full min-h-[100dvh] flex items-center justify-between gap-4 px-10 md:px-20">
      {/* Left: main content */}
      <div className="flex flex-col items-start justify-center gap-6 max-w-lg z-10">
        {/* Badge */}
        {/* <div ref={badgeRef} className="opacity-0 flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-[12px] text-blue-300 font-medium tracking-wide">Professional Social Platform</span>
        </div> */}

        {/* Headline */}
        <h1 ref={headlineRef} className="opacity-0 text-[3.2rem] md:text-[4rem] font-bold leading-[1.1] tracking-tight text-white">
          PostGrid
        </h1>

        {/* Rotating text pill */}
        <RotatingText
          texts={[
            "Create Posts",
            "Connect with Others",
            "Earn Badges",
            "Build Your Profile",
            "Learn & Grow",
          ]}
          mainClassName="px-4 py-2 transparent backdrop-blur-lg text-blue-100 font-[500] text-[.8rem] overflow-hidden rounded-lg"
          staggerFrom="last"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-0.5"
          transition={{ type: "spring", damping: 50, stiffness: 600 }}
          rotationInterval={3400}
        />

        {/* Subtext */}
        <p ref={subRef} className="opacity-0 text-[var(--accents-5)] text-[0.95rem] leading-relaxed max-w-sm">
          Share ideas, connect with professionals, build your brand — all in one place built for creators.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="opacity-0 flex items-center gap-4 mt-2">
          <Link
            href="/signup"
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[14px] font-semibold transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-lg border border-[var(--accents-3)] text-[var(--accents-6)] text-[14px] font-medium hover:border-[var(--accents-5)] hover:text-[var(--geist-foreground)] transition-all duration-200 hover:-translate-y-0.5"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Right: sign-up nudge */}
      <div className="hidden lg:flex flex-col items-start justify-center gap-3 z-10">
        <p className="text-[var(--accents-5)] text-[14px]">New to PostGrid?</p>
        <Link href="/signup" className="text-blue-400 hover:text-blue-300 text-[14px] font-medium transition-colors">
          Create your account →
        </Link>
      </div>
    </div>
  );
};

export default Hero;
