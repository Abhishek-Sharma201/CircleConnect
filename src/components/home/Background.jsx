import React from "react";

const Background = () => {
  return (
    <div className=" z-[2] fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-12 ">
      <div
        className=" rotate-[35deg] h-[3px] w-[150px] rounded-md bg-gradient-to-r from-blue-400 via-blue-500 to-blue-300 
       bg-[length:200%_100%] 
       animate-gradient-shadow "
      ></div>
      <div
        className=" rotate-[35deg] h-[5px] w-[250px] rounded-md bg-gradient-to-r from-blue-700 via-blue-300 to-blue-700 
       bg-[length:200%_100%] 
       animate-gradient-shadow "
      ></div>
      <div
        className=" rotate-[35deg] h-[8px] w-[400px] rounded-md bg-gradient-to-r from-blue-700 via-blue-300 to-blue-700 
       bg-[length:200%_100%] 
       animate-gradient-shadow "
      ></div>
      <div
        className=" rotate-[35deg] h-[15px] w-[700px] rounded-md bg-gradient-to-r from-blue-700 via-blue-300 to-blue-700 
       bg-[length:200%_100%] 
       animate-gradient-shadow "
      ></div>
      <div
        className=" rotate-[35deg] h-[8px] w-[400px] rounded-md bg-gradient-to-r from-blue-700 via-blue-300 to-blue-700 
       bg-[length:200%_100%] 
       animate-gradient-shadow "
      ></div>
      <div
        className=" rotate-[35deg] h-[5px] w-[250px] rounded-md bg-gradient-to-r from-blue-700 via-blue-300 to-blue-700 
       bg-[length:200%_100%] 
       animate-gradient-shadow "
      ></div>
      <div
        className=" rotate-[35deg] h-[3px] w-[150px] rounded-md bg-gradient-to-r from-blue-700 via-blue-300 to-blue-700 
       bg-[length:200%_100%] 
       animate-gradient-shadow "
      ></div>
    </div>
  );
};

export default Background;
