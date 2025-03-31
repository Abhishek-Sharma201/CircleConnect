import React from "react";

const page = async ({ params }) => {
  const user = await Promise.resolve(params);

  return <div>{JSON.stringify(user.user)}</div>;
};

export default page;
