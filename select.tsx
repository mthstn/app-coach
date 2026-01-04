import * as React from "react";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className = "", children, ...props }: Props) {
  return (
    <select
      className={`h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
