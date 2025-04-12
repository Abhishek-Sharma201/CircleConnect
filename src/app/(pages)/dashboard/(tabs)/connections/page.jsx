"use client";

import Loader from "@/src/components/dashboard/Loader";
import { apiURL } from "@/src/constants";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ConnectionData } from "@/src/utils/dummyData";
import ConnectionCard from "@/src/components/dashboard/ConnectionCard";
import { Search } from "@/src/utils/SVG";

const Page = () => {
  const { user, loading } = useAuth();
  const [cnn, setCnn] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!user?._id) return;

    const fetchCnn = async () => {
      try {
        const res = await fetch(
          `${apiURL}/api/connections/getAll/${user?._id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await res.json();
        setCnn(data.connections);
        console.log("cnn :", data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchCnn();
  }, [user?._id]);

  if (loading) return <Loader />;

  return (
    <div className="h-full w-full items-start justify-center flex p-3 gap-4 ">
      {/* {user?._id || "connections"} */}
      <div className=" h-full w-full flex flex-col items-start justify-start  gap-4   ">
        <div className="w-[max-content] h-[max-content] flex items-center justify-center rounded-md border gap-2 p-1 border-zinc-800">
          <button
            className="h-full  rounded-md bg-gradient-to-r from-blue-900 via-blue-600 to-blue-700 
             bg-[length:200%_100%] 
             animate-gradient-shadow text-[.9rem] py-1 px-2 outline-none"
          >
            <Search />
          </button>
          <span className="h-full w-[1px] bg-zinc-700" />
          <input
            type="search"
            name="search"
            id="search"
            placeholder="Search connections..."
            className="h-full w-[250px] px-1 bg-transparent border-none outline-none placeholder:text-zinc-300 placeholder:text-[.9rem] text-zinc-300 text-[.8rem]"
            autoComplete="false"
          />
        </div>
        <div className=" h-full w-full flex flex-col items-start justify-start gap-4 overflow-y-scroll overflow-x-hidden p-1 ">
          {ConnectionData.map((conn) => {
            return <ConnectionCard key={conn._id} {...conn} />;
          })}
        </div>
      </div>
      <hr className="h-full w-[1px] bg-zinc-800 border-none dark:bg-zinc-700" />
      <div className=" h-full w-full flex flex-col items-start justify-start p-2 gap-4 ">
        suggestions
        <hr className="w-full h-[1px] bg-zinc-800 border-none dark:bg-zinc-700" />
      </div>
    </div>
  );
};

export default Page;
