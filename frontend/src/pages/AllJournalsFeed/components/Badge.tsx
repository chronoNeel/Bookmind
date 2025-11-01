import React from "react";

const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full border border-transparent ring-1 px-2 py-0.5 text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

export default Badge;
