import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`p-6 bg-gray-900 rounded-xl border border-gray-800 ${className}`}
    >
      {children}
    </div>
  );
}
