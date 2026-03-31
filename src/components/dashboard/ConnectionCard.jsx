"use client";

import React from "react";
import Image from "next/image";

const ConnectionCard = ({ userName, picture, headLine, badges }) => {
  return (
    <div className="pg-card p-4 flex items-center gap-3">
      <Image
        src={picture || "/assets/default-profile.jpg"}
        alt={userName || "User"}
        width={40}
        height={40}
        className="rounded-full object-cover w-10 h-10 ring-1 ring-[var(--pg-border)] shrink-0"
      />
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-medium text-pg-text-primary truncate">
          {userName}
        </h4>
        {headLine && (
          <p className="text-xs text-pg-text-muted truncate mt-0.5">
            {headLine}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConnectionCard;
