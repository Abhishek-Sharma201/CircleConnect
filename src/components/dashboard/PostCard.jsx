import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const Card = ({
  id,
  postedBy,
  createdAt,
  head,
  description,
  image,
  postedByPic,
}) => {
  const router = useRouter();
  const postTime = getTimeDifference(createdAt);

  return (
    <div className="mb-4 break-inside-avoid rounded-md overflow-hidden border border-zinc-800 bg-zinc-950 cursor-pointer">
      <Link
        href={`/dashboard/${postedBy}/${id}`}
        className="h-[max-content] w-full rounded-md overflow-hidden relative"
      >
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
      </Link>

      <div className="p-3">
        <Link href={`/dashboard/${postedBy}/${id}`}>
          <h1
            className="text-[1rem] text-zinc-200 font-medium mb-2"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {head}
          </h1>

          <p
            className="text-[.85rem] text-zinc-400 mb-3"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {description}
          </p>
        </Link>

        <div className="w-full h-[1px] bg-zinc-800 my-2" />

        <div className="flex items-center gap-2">
          <Image
            src={postedByPic || "/assets/default-profile.jpg"}
            alt={postedBy || "author"}
            width={20}
            height={20}
            className="rounded-full object-cover"
          />
          <Link
            href={`/dashboard/${postedBy}`}
            className="text-[.72rem] text-blue-500 underline"
          >
            {postedBy || "Unknown"}
          </Link>
          <div className="flex-1" />
          <h6 className="text-[.72rem] text-zinc-500">{postTime}</h6>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Card);
