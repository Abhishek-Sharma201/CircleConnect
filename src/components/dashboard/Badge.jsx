import React from "react";
import { ShieldCheck, ExternalLink } from "lucide-react";

const Badge = ({ name, isVerifiable, verificationSource, evidenceUrl, verified }) => {
  return (
    <div className="pg-badge group relative">
      {isVerifiable && (
        <ShieldCheck
          size={13}
          className={`shrink-0 ${
            verified ? "text-[var(--pg-success)]" : "text-[var(--pg-accent)]"
          }`}
        />
      )}
      <span className="text-pg-text-secondary group-hover:text-pg-text-primary transition-colors">
        {name}
      </span>
      {evidenceUrl && (
        <a
          href={evidenceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ExternalLink size={11} className="text-pg-text-ghost hover:text-[var(--pg-accent)]" />
        </a>
      )}
    </div>
  );
};

export default Badge;
