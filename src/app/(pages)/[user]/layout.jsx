import Nav from "@/src/components/dashboard/Nav";
import Sidebar from "@/src/components/dashboard/Sidebar";
import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <main className=" h-[100dvh] w-full flex items-center justify-start overflow-hidden ">
      <Sidebar />
      <div className=" h-full w-full flex flex-col items-start justify-start px-[6px] ">
        <Nav />
        {children}
      </div>
    </main>
  );
};

export default DashboardLayout;
