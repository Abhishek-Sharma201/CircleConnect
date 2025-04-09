"use client";

import Loader from "@/src/components/dashboard/Loader";
import { apiURL } from "@/src/constants";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const page = () => {
  const params = useParams();
  const id = params?.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSinglePost = async () => {
    setLoading(true);
    try {
      const f = await fetch(`${apiURL}/api/posts/getSinglePost/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const j = await f.json();
      setPost(j.post);
      setLoading(false);
      console.log(`post : ${JSON.stringify(j.post)}`);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSinglePost();
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div className=" h-full w-full p-6 flex flex-col items-center justify-start gap-4 ">
      <div className=" h-full w-[max-content] flex flex-col items-start justify-start gap-4 ">
        <div className=" h-[max-content] w-full flex items-center justify-center gap-4 ">
          <Image
            src={post?.postedBy?.picture || "/assets/pic1.jpg"}
            alt="user pic"
            width={50}
            height={50}
            className=" rounded-full "
          />
          <div className=" h-[max-content] w-[max-content] flex flex-col items-start justify-start ">
            <h1> {post?.postedBy?.userName} </h1>
            <h4 className=" text-[.8rem] text-zinc-300 ">
              {post?.postedBy?.headLine}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
