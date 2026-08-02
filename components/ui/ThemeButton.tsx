"use client";

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ThemeButtonVariant =
  | "primary"
  | "secondary"
  | "danger";

interface ThemeButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ThemeButtonVariant;

  icon?: ReactNode;

  children: ReactNode;
}

export default function ThemeButton({
  variant = "primary",
  icon,
  children,
  className = "",
  ...props
}: ThemeButtonProps) {
  let colors = "";

  switch (variant) {
    case "primary":
      colors = `
        border-[var(--color-primary)]
        bg-[var(--color-primary)]
        text-[var(--color-primary-text)]
        hover:bg-[var(--color-primary-hover)]
      `;
      break;

    case "secondary":
      colors = `
        border-[var(--color-border)]
        bg-[var(--color-surface)]
        text-[var(--color-text)]
        hover:bg-[var(--color-surface-elevated)]
      `;
      break;

    case "danger":
      colors = `
        border-[var(--color-danger)]
        bg-[var(--color-danger)]
        text-white
      `;
      break;
  }

  return (
    <button
      {...props}
      className={`
        flex
        min-h-16
        w-full
        items-center
        justify-center
        gap-3
        rounded-2xl
        border
        px-6
        py-4
        text-lg
        font-black
        transition-all
        duration-200
        hover:scale-[1.01]
        active:scale-[0.98]
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${colors}
        ${className}
      `}
    >
      {icon}

      {children}
    </button>
  );
}