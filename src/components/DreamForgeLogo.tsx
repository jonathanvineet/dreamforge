import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const DreamForgeLogo: React.FC<LogoProps> = ({ className = "w-7 h-7", size = 28 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="df-inline-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="50%" stopColor="#0072FF" />
          <stop offset="100%" stopColor="#7000FF" />
        </linearGradient>
        <linearGradient id="df-inline-gold" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF4500" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="100%" stopColor="#FFD700" />
        </linearGradient>
        <linearGradient id="df-inline-dark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>

      <rect width="512" height="512" rx="120" fill="url(#df-inline-dark)" />
      <rect width="504" height="504" x="4" y="4" rx="116" fill="none" stroke="url(#df-inline-cyan)" strokeWidth="4" strokeOpacity="0.3" />

      <g transform="translate(0, 10)">
        <path d="M 256,110 L 376,178 L 256,246 L 136,178 Z" fill="url(#df-inline-cyan)" opacity="0.9" />
        <path d="M 256,128 L 350,181 L 256,234 L 162,181 Z" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" />
        <path d="M 136,178 L 256,246 L 256,384 L 136,316 Z" fill="url(#df-inline-gold)" opacity="0.85" />
        <path d="M 256,246 L 376,178 L 376,316 L 256,384 Z" fill="url(#df-inline-cyan)" opacity="0.75" />
        <path d="M 256,190 L 290,240 L 256,290 L 222,240 Z" fill="#FFFFFF" opacity="0.95" />
        <circle cx="256" cy="240" r="12" fill="#00F0FF" />
      </g>
    </svg>
  );
};
