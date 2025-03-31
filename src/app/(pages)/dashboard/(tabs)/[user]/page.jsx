"use client";

import { useParams } from "next/navigation";
import { apiURL } from "@/src/constants";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

  return <div>{userParam}</div>;
};

export default Page;
