import React from "react";

const Loader = () => {
  return (
    <div className=" h-full w-full flex items-center justify-center gap-4 ">
      <div className=" h-[20px] w-[20px] border-[3px] border-zinc-800 border-t-blue-500 rounded-full animate-spin "></div>
      Loading...
    </div>
  );
};

export default Loader;
