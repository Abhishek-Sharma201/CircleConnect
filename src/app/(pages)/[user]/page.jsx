import React from "react";

const page = ({ params }) => {
  const { user } = params;
  return (
    <div className=" w-full h-full flex flex-col items-start justify-start p-4 overflow-x-hidden overflow-y-scroll ">
      {user?.name}
    </div>
  );
};

export default page;
