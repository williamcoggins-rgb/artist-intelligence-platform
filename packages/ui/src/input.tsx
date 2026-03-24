import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label className="block font-body text-xs tracking-[0.15em] uppercase text-white/50 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-6 py-4 bg-transparent border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-brand-400 font-body text-sm tracking-[0.1em] uppercase transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}
