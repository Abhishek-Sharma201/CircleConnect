import dotenv from "dotenv";
dotenv.config();

export const apiURL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_SERVER_URL
    : process.env.SERVER_URL;
