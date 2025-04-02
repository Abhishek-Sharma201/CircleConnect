import { useRouter } from "next/navigation";
import React from "react";

const Name = ({ className }) => {
  const router = useRouter();

  return (
    <h1
      className={` whitespace-nowrap cursor-pointer ${className} `}
      onClick={() => router.push("/")}
    >
      Circle Connect
    </h1>
  );
};

export default Name;
