import { useRouter } from "next/navigation";
import React from "react";

const Name = () => {
  const router = useRouter();

  return (
    <h1
      className=" whitespace-nowrap cursor-pointer "
      onClick={() => router.push("/")}
    >
      Circle Connect
    </h1>
  );
};

export default Name;
