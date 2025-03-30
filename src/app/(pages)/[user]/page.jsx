"use client";

import { apiURL } from "@/src/constants";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = ({ params }) => {
  const { user: username } = params;
  const [fetchedUser, setFetchedUser] = useState(null);

  const fetchUser = async () => {
    try {
      const fe = await fetch(`${apiURL}/api/search/get/${username}`);
      const res = await fe.json();
      setFetchedUser(res.user);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [username]);

  return (
    <div className="w-full h-full flex flex-col items-start justify-start p-4 overflow-x-hidden overflow-y-scroll">
      {fetchedUser?.userName}
    </div>
  );
};

export default Page;
