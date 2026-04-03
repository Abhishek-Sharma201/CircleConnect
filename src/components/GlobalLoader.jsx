"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const GlobalLoader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Short artificial delay to ensure smooth layout entry and logo presentation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1300);
    return () => clearTimeout(timer);
  }, []);

  // We keep it in the DOM momentarily while it fades out cleanly
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setHidden(true), 700);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (hidden) return null;

  return (
    <div className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[var(--geist-background)] transition-all duration-700 ease-in-out ${isLoading ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <Image
          src="/assets/pg%20logo.svg"
          alt="Loading PostGrid..."
          width={200}
          height={200}
          className="w-30 h-30 object-contain drop-shadow-md"
        />
      </div>
    </div>
  );
};

export default GlobalLoader;
