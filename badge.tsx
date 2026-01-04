import * as React from "react";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "good" | "warn";
};

const tones: Record<NonNullable<Props["tone"]>, string> = {
  neutral: "bg-zinc-100 text-zinc-700",
  good: "bg-emerald-100 text-emerald-800",
  warn: "bg-amber-100 text-amber-800",
};

export function Badge({ className = "", tone = "neutral", ...props }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]} ${className}`} {...props} />
  );
}
