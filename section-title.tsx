import * as React from "react";

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <div className="text-lg font-semibold">{title}</div>
      {subtitle ? <div className="text-sm text-zinc-500">{subtitle}</div> : null}
    </div>
  );
}
