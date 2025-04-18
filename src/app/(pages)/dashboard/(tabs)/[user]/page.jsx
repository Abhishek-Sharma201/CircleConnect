"use client";

import { useParams } from "next/navigation";
import { apiURL } from "@/src/constants";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import PostCard from "@/src/components/dashboard/PostCard";
import Badge from "@/src/components/dashboard/Badge";
import Loader from "@/src/components/dashboard/Loader";

const Page = () => {
  const params = useParams();
  const userParam = params?.user;
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiURL}/api/search/${userParam}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message);
      }
      const userData = Array.isArray(json.user) ? json.user[0] : json.user;
      setData(userData);
      console.log(userData);
      setLoading(false);
      toast.success(json.message);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userParam) {
      (async () => {
        await fetchUser();
      })();
    }
  }, [userParam]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full h-full flex flex-col items-start justify-start py-6 px-16 gap-2 overflow-x-hidden overflow-y-scroll ">
      <div className=" w-[max-content] h-[max-content] flex flex-col items-center justify-start gap-6 ">
        <div className=" w-[max-content] h-[max-content] flex items-center justify-start gap-6 ">
          <div
            className="h-[max-content] w-[max-content] flex flex-col items-center justify-center p-[2px] bg-gradient-to-r from-blue-900 via-blue-600 to-white 
             bg-[length:200%_100%] 
             animate-gradient-shadow rounded-full"
          >
            <Image
              src={data?.picture || "/assets/pic1.jpg"}
              alt="Profile Picture"
              height={140}
              width={140}
              className="rounded-full object-contain "
            />
          </div>
          <div className="h-[max-content] w-[max-content] flex flex-col items-start justify-start p-2 ">
            <h1 className=" text-zinc-400  text-[.9rem]">{data?.userName}</h1>
            <h3 className=" text-zinc-200  text-[2rem]">
              {data?.firstName + " " + data?.lastName}
            </h3>
            <h4 className=" text-zinc-300  text-[1.1rem]">{data?.headLine}</h4>
            <p className=" text-zinc-400  text-[.8rem]">{data?.about}</p>
          </div>
        </div>

        <div
          className="w-full h-[1px] 
             bg-zinc-700"
        />
      </div>
      <div className="w-full h-[max-content] flex items-start justify-start flex-wrap gap-4">
        {data?.badges?.length === 0 ? (
          <h3 className=" text-zinc-300 text-[.9rem] ">No badges Available.</h3>
        ) : (
          <>
            {data?.badges?.map((v) => (
              <Badge key={v._id} {...v} />
            ))}
          </>
        )}
      </div>
      <div className="mt-6 grid grid-cols-3 w-full gap-4">
        {data?.posts?.map((v) => (
          <PostCard
            key={v?._id}
            id={v?._id}
            postedBy={data?.userName}
            createdAt={v?.createdAt}
            head={v?.head}
            description={v?.description}
            image={v?.image?.secure_url}
            postedByPic={data?.picture || "/assets/pic1.jpg"}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
