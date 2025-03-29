"use client";

import Link from "next/link";
import React from "react";
import { useAuth } from "../hooks/useAuth";

const page = () => {
  const { user } = useAuth();

  return <Link href={`/${user.name}`}>Dashboard</Link>;
};

export default page;
