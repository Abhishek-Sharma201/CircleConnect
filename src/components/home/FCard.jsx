import React from "react";

const FCard = ({ svg, head, description }) => {
  return (
    <div className="flex flex-col items-start justify-start p-5 gap-3 border-l-2 border-l-blue-600/60 bg-white/[0.02] backdrop-blur-sm rounded-r-lg hover:border-l-blue-400 hover:bg-white/[0.04] transition-all duration-200 flex-1 min-w-[220px]">
      <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
        {svg}
      </div>
      <h2 className="text-[1rem] font-semibold text-[var(--geist-foreground)]">{head}</h2>
      <p className="text-[0.82rem] text-[var(--accents-5)] leading-relaxed">{description}</p>
    </div>
  );
};

export default FCard;
