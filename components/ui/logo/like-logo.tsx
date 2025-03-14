import React from 'react';

export const LikeLogo: React.FC<{
  className?: string;
  width?: number;
  height?: number;
}> = ({ className, width = 300, height = 150 }) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 300 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="likeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#333333" />
          <stop offset="100%" stopColor="#999999" />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="url(#likeGradient)"
        fontSize="120"
        fontWeight="bold"
        // 斜体
        fontStyle="italic"
      >
        LIKEN
      </text>
    </svg>
  );
};