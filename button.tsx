import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const base =
  "inline-flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary: "bg-zinc-950 text-white hover:bg-zinc-800 shadow-soft",
  secondary: "bg-white text-zinc-950 border border-zinc-200 hover:bg-zinc-50 shadow-soft",
  ghost: "bg-transparent text-zinc-950 hover:bg-zinc-100",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-soft",
};

const sizes: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function Button({ className = "", variant = "primary", size = "md", ...props }: Props) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
  );
}
