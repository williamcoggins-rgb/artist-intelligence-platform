import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "accent";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-bold uppercase tracking-[0.15em] transition-colors focus:outline-none font-body";

  const variants = {
    primary:
      "bg-brand-400 text-black hover:bg-white",
    secondary:
      "bg-surface-dark text-white hover:bg-white/10 border border-white/10",
    outline:
      "border border-white/30 text-white hover:border-brand-400 hover:text-brand-400",
    accent:
      "bg-accent text-white hover:bg-accent-light",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-sm",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
