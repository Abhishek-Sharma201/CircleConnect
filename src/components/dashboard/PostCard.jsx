import Image from "next/image";
import React from "react";

const PostCard = ({
  postedBy,
  createdAt,
  head,
  description,
  image,
  postedByPic,
}) => {
  const postTime = new Date(createdAt).toLocaleString();
  return (
    <div className="h-[max-content] w-[max-content] p-2 rounded-md flex flex-col items-start justify-between gap-2 border border-zinc-800">
      <div className="h-[max-content] w-full rounded-md overflow-hidden relative">
        <Image
          className="w-full object-contain rounded-md"
          src={image?.secure_url || "/assets/pic1.jpg"}
          alt="postImg"
          width={400}
          height={300}
        />
        <div
          id="post_card_img"
          className="z-4 absolute top-0 left-0 h-full w-full"
        ></div>
      </div>
      <h1 className="text-[.9rem] text-zinc-300">{head}</h1>
      <p className="text-[.8rem] text-zinc-400">{description}</p>
      <hr className="w-full h-[1px] bg-zinc-800 border-none dark:bg-zinc-700" />
      <div className="w-full flex items-center justify-between gap-2">
        <Image
          src={postedByPic || "/assets/default-profile.jpg"}
          alt="proPic"
          className="w-[30px] h-[30px] object-contain rounded-full overflow-hidden"
          width={30}
          height={30}
        />
        <h6 className="text-[.7rem] text-zinc-500">{postedBy}</h6>
        <div className="flex-grow"></div>
        <h6 className="text-[.7rem] text-zinc-500">{postTime}</h6>
      </div>
    </div>
  );
};

export default PostCard;
