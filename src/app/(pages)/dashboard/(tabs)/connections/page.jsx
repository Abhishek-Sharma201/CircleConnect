"use client";

import { apiURL } from "@/src/constants";
import { UserProvider, useUser } from "@/src/context/userContex";
import { useAuth } from "@/src/hooks/useAuth";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const page = () => {
  const { user } = useAuth();
  const [cnn, setCnn] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCnn = async () => {
    setLoading(true);
    try {
      const f = await fetch(`${apiURL}/api/connections/getAll/${user?._id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const j = await f.json();
      setCnn(j.connections);
      setLoading(false);
      console.log(`cnn : ${j.connections}`);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(`user: ${user}`);
    if (!user?._id) return;
    fetchCnn();
  }, []);

  return (
    <div className=" h-full w-full items-start justify-start flex flex-col p-6 gap-4 ">
      connections
    </div>
  );
};

export default page;
