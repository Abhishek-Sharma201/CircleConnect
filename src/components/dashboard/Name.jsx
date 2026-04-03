import { useRouter } from "next/navigation";
import React from "react";

const Name = ({ className }) => {
  const router = useRouter();

  return (
    <div
      className={`flex items-center gap-2 cursor-pointer ${className}`}
      onClick={() => router.push("/")}
    >
      <img src="/assets/pg%20logo.svg" alt="PostGrid Logo" className="w-32 h-32 object-contain" />
    </div>
  );
};

export default Name;
