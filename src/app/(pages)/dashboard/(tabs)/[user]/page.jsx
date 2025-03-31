"use client";

import { useParams } from "next/navigation";
import { apiURL } from "@/src/constants";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import PostCard from "@/src/components/dashboard/PostCard";
import Badge from "@/src/components/dashboard/Badge";

const Page = () => {
  const params = useParams();
  const userParam = params?.user;

  const [data, setData] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${apiURL}/api/search/${userParam}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message);
      }
      setData(json.user);
      console.log(json.user);
      toast.success(json.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userParam) {
      (async () => {
        await fetchUser();
      })();
    }
  }, [userParam]);

  return (
    <div className=" w-full h-full flex flex-col items-start justify-start py-3 px-2 gap-2 overflow-y-scroll ">
      <div className="h-[max-content] w-[max-content] flex flex-col items-center justify-center p-1 border-[3px] border-blue-900 rounded-full">
        <Image
          src={data?.picture || "/assets/pic1.jpg"}
          alt="Profile Picture"
          height={140}
          width={140}
          className="rounded-full"
        />
      </div>
      <div className=" h-[max-content] w-[400px] flex flex-col items-start justify-start p-2 gap-2 ">
        <h1>{data?.userName}</h1>
        <h3>{data?.firstName + " " + data?.lastName}</h3>
        <h4>{data?.headLine}</h4>
        <p>{data?.about}</p>
      </div>
      <div className=" w-full h-[max-content] flex items-start justify-start flex-wrap gap-4 ">
        {data?.badges?.map((v, i) => {
          return <Badge key={v._id} {...v} />;
        })}
      </div>
      <div className=" w-full h-[max-content] flex items-start justify-start flex-wrap gap-4 ">
        {data?.posts?.map((v, i) => {
          return <PostCard key={v._id} {...v} />;
        })}
      </div>
    </div>
  );
};

export default Page;
