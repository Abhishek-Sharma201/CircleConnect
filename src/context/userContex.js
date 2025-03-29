"use client";

import React, { createContext } from "react";
import { MainUser } from "../utils/dummyData";

const Context = createContext();

const UserContext = () => {
  return <Context value={MainUser} />;
};

export default UserContext;
