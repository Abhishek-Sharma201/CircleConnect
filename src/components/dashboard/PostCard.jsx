import Image from "next/image";
import React from "react";

const getTimeDifference = (createdAt) => {
  const now = new Date();
  const postDate = new Date(createdAt);
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} years ago`;
};

const PostCard = ({
  postedBy,
  createdAt,
  head,
  description,
  image,
  postedByPic,
}) => {
  const postTime = getTimeDifference(createdAt);

  return (
    <div className="h-[max-content] w-[370px] p-2 rounded-md flex flex-col items-start justify-between gap-2 border border-zinc-800">
      <div className="h-[max-content] w-full rounded-md overflow-hidden relative">
        <Image
          className="w-full object-contain rounded-md"
          src={image || "/assets/pic1.jpg"}
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
