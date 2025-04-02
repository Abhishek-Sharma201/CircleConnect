import React from "react";

const Badge = ({ name }) => {
  return (
    <div
      id="badge"
      className=" cursor-pointer rounded-md w-[max-content] h-[5dvh] flex flex-col items-center justify-center border border-zinc-800 border-l-blue-700 border-l-4 px-3 "
    >
      <h4 className=" text-[.8rem] text-zinc-300 ">{name}</h4>
    </div>
  );
};

export default Badge;
