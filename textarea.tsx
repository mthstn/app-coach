import * as React from "react";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className = "", ...props }: Props) {
  return (
    <textarea
      className={`min-h-[96px] w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400 ${className}`}
      {...props}
    />
  );
}
