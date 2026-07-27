"use client";

import type { ReactNode } from "react";

export type BadgeVariant =
  | "gold"
  | "gray"
  | "success"
  | "danger";

interface BadgeProps {
  children: ReactNode;

  variant?: BadgeVariant;

  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  gold:
    "bg-[#FFD166]/15 text-[#FFD166] border-[#FFD166]/30",

  gray:
    "bg-white/5 text-zinc-300 border-white/10",

  success:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",

  danger:
    "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function Badge({
  children,
  variant = "gray",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex",
        "items-center",
        "justify-center",
        "rounded-full",
        "border",
        "px-3",
        "py-1",
        "text-xs",
        "font-bold",
        "tracking-wide",

        variants[variant],

        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}