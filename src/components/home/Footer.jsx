import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className=" w-full h-[max-content] flex items-start justify-start gap-[10rem] px-20 py-24 backdrop-blur-md ">
      <div className=" w-[max-content] h-full px-4 flex flex-col items-center justify-center ">
        <h1 className=" text-[2rem] ">PostGrid</h1>
      </div>
      <div className=" h-full w-[max-content] flex items-start justify-start gap-8 ">
        <div className=" w-[max-content] h-full p-2 gap-1 flex flex-col items-start justify-center text-[.8rem] font-medium ">
          <Link href={"/"} className=" hover:text-blue-500 ">
            Privacy
          </Link>
          <Link href={"/"} className=" hover:text-blue-500 ">
            Terms & conditions
          </Link>
        </div>
        <div className=" w-[max-content] h-full p-2 gap-1 flex flex-col items-start justify-center text-[.8rem] font-medium ">
          <Link href={"/"} className=" hover:text-blue-500 ">
            You
          </Link>
          <Link href={"/"} className=" hover:text-blue-500 ">
            Do not share my information
          </Link>
        </div>
      </div>
      <div className=" flex-grow "></div>
      <div className=" w-[max-content] h-full p-2 gap-1 flex flex-col items-start justify-center text-[.8rem] font-medium ">
        <h4>PostGrid &copy; {new Date().getFullYear()} all rights reserved</h4>
      </div>
    </footer>
  );
};

export default Footer;
