import { FCardData } from "@/src/utils/dummyData";
import React from "react";
import FCard from "./FCard";

const Features = () => {
  return (
    <div className=" w-full h-[max-content] flex flex-col items-start justify-start gap-14 backdrop-blur-md px-20 py-8 ">
      <h1 className=" text-[1.5rem] border-b border-b-blue-600 ">Features</h1>
      <div className=" w-full h-[max-content] gap-4 flex items-start justify-start overflow-hidden ">
        {FCardData.map((v, i) => {
          return <FCard key={i} {...v} />;
        })}
      </div>
    </div>
  );
};

export default Features;
