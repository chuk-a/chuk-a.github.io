import React from 'react';

export function Logo({ className = '' }) {
  return (
    <svg
      width="116"
      height="36"
      viewBox="0 0 116 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Simple stylized V shape and wordmark for placeholder */}
      <path d="M4 8L16 32L28 8H20L16 18L12 8H4Z" fill="white" />
      <path d="M12 2L16 10L20 2H12Z" fill="white" />
      <text x="36" y="24" fill="white" fontSize="18" fontWeight="bold" letterSpacing="0.05em">CHUKA</text>
    </svg>
  );
}
