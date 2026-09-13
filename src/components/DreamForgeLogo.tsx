import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  alt?: string;
}

export const DreamForgeLogo: React.FC<LogoProps> = ({
  className = "w-7 h-7",
  size,
  alt = "DreamForge Logo",
}) => {
  return (
    <img
      src="/logo/DreamForge_LOGO.png"
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover shrink-0 select-none ${className}`}
      loading="eager"
    />
  );
};

