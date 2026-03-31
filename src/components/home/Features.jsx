"use client";
import { FCardData } from "@/src/utils/dummyData";
import React, { useEffect, useRef } from "react";
import FCard from "./FCard";
import gsap from "gsap";

const Features = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const cards = section.querySelectorAll(".feature-card");
          gsap.fromTo(
            cards,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative z-10 w-full flex flex-col items-start justify-start gap-10 px-10 md:px-20 py-16 border-t border-[var(--accents-2)]"
    >
      <div className="flex flex-col gap-2">
        <span className="text-[12px] text-blue-400 font-semibold uppercase tracking-widest">
          Platform Features
        </span>
        <h2 className="text-[1.8rem] font-bold text-[var(--geist-foreground)]">
          Everything you need
        </h2>
        <p className="text-[var(--accents-5)] text-[14px] max-w-md">
          PostGrid combines blogging, networking, learning, and personal branding in one unified platform.
        </p>
      </div>
      <div className="w-full flex flex-wrap items-stretch gap-4">
        {FCardData.map((v, i) => (
          <div key={i} className="feature-card opacity-0 flex-1 min-w-[200px]">
            <FCard {...v} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
