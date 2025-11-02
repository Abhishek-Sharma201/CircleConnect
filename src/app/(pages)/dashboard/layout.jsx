import ShaderAnimation from "@/src/components/21stdevs/ShaderAnimation";
import Nav from "@/src/components/dashboard/Nav";
import Sidebar from "@/src/components/dashboard/Sidebar";
import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <main className=" h-[100dvh] w-full flex items-center justify-start overflow-hidden relative ">
      <div className=" h-full w-full flex flex-col items-center justify-center z-2 absolute top-0 right-0 blur-md ">
        <ShaderAnimation />
      </div>
      <div className=" h-full w-full flex items-center justify-center relative overflow-hidden ">
        <Sidebar />
        <div className=" h-full w-full flex flex-col items-start justify-start ">
          <Nav />
          {children}
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
