import React from "react";
import Name from "../dashboard/Name";
import RotatingText from "../bits/RotatingText";
import Link from "next/link";

const Hero = () => {
  return (
    <div className=" w-full h-[100dvh] flex items-start justify-between gap-4 bg-transparent backdrop-blur-md px-20 ">
      <div className=" w-[max-content] h-full flex flex-col items-start justify-center gap-4 ">
        <Name className={" text-[3rem] "} />
        <RotatingText
          texts={[
            "Create Posts",
            "Connect with Others",
            "Create Badges",
            "Dynamic Profile",
          ]}
          mainClassName="px-4 pt-1 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-700 
                   bg-[length:200%_100%] 
                   animate-gradient-shadow text-[1rem] text-white overflow-hidden rounded-md"
          staggerFrom={"last"}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          rotationInterval={2000}
        />
        <p className=" text-zinc-400 text-[.8rem] ">
          circle-connect is platform for bloggers who want's <br /> to share
          there daily life activities.
        </p>
      </div>
      <div className=" w-[max-content] h-full flex flex-col items-start justify-center gap-4 ">
        <h1 className=" text-[1.1rem] ">
          New to Circle connect? <br />
          <Link href={"/signup"} className=" text-blue-600 text-[.9rem] ">Signup now</Link>
        </h1>
      </div>
    </div>
  );
};

export default Hero;
