import React from "react";

const FCard = ({ svg, head, description }) => {
  return (
    <div className=" w-[300px] h-[max-content] flex flex-col items-start justify-start p-4 gap-2 border-r-[2px] border-r-blue-600 ">
      {svg}
      <h1 className=" text-[1.2rem] ">{head}</h1>
      <p className=" text-[.8rem] text-zinc-400 pr-12 ">{description}</p>
    </div>
  );
};

export default FCard;
