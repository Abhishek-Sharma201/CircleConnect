import Image from "next/image";
import React from "react";
import Badge from "./Badge";

const ConnectionCard = ({ image, name, headLine, badges, connections }) => {
  return (
    <div className=" w-full h-[15dvh] flex flex-col items-start justify-start gap-1 py-2 px-4 rounded-md overflow-hidden border border-zinc-700 ">
      <div className=" w-full h-full flex items-center justify-start gap-4 ">
        <Image
          src={image || ""}
          alt="pic"
          height={30}
          width={40}
          className=" rounded-full object-contain "
        />
        <div className=" w-full h-full flex flex-col items-start justify-center ">
          <h2 className=" text-zinc-200 text-[1rem] ">{name}</h2>
          <h4 className=" text-zinc-300 text-[.75rem] max-w-[250px] truncate ">
            {headLine}
          </h4>
        </div>
        <div className="flex-grow"></div>
        <div className=" h-full min-w-[max-content] flex items-center justify-center ">
          {/* <h3 className=" text-zinc-300 text-[1rem] ">{badges[0].name}</h3> */}
          <Badge name={badges[0].name} />
          <h5 className=" text-zinc-300 text-[.8rem] ">
            &nbsp; {"+" + (badges.length - 1) + " more badges"}
          </h5>
        </div>
      </div>
      <hr className="w-full h-[1px] bg-zinc-900 border-none dark:bg-zinc-800" />
      <div className=" w-full h-[max-content] flex items-center justify-between gap-2 ">
        Bottom
        <h4 className=" text-zinc-300 text-[.7rem] ">
          {connections.length} connections
        </h4>
      </div>
    </div>
  );
};

export default ConnectionCard;
