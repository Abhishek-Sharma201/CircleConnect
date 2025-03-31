"use client";

import Link from "next/link";
import React from "react";
import { useAuth } from "../hooks/useAuth";

const page = () => {
  return <Link href={`/dashboard`}>Dashboard</Link>;
};

export default page;
