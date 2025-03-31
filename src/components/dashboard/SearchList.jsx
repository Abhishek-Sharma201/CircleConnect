import Image from "next/image";
import React from "react";

const SearchList = ({ picture, userName, headLine, onClick }) => {
  return (
    <div
      className=" w-[315px] h-[7dvh] flex items-center justify-start p-1 border border-zinc-700 rounded-md gap-3 cursor-pointer hover:bg-zinc-950 "
      onClick={onClick}
    >
      <Image
        src={picture || ""}
        alt="pic"
        className=" h-[30px] w-[30px] rounded-full object-cover "
      />
      <div className=" w-full h-full flex flex-col items-start justify-center py-2 gap-1">
        <h3 className=" text-[.8rem] text-zinc-300 ">{userName}</h3>
        <p className=" text-[.6rem] text-zinc-400">{headLine}</p>
      </div>
    </div>
  );
};

export default SearchList;
