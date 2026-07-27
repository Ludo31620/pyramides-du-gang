"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { theme } from "@/lib/theme";

export type ButtonVariant =
  | "gold"
  | "secondary"
  | "danger"
  | "ghost";

export type ButtonSize =
  | "sm"
  | "md"
  | "lg";

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;

  variant?: ButtonVariant;

  size?: ButtonSize;

  fullWidth?: boolean;

  loading?: boolean;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  gold: [
    "border-[#FFD166]",
    "bg-[#FFD166]",
    "text-[#111318]",
    "hover:bg-[#FFE08A]",
    "hover:border-[#FFE08A]",
    "focus-visible:ring-[#FFD166]",
  ].join(" "),

  secondary: [
    "border-[#353944]",
    "bg-[#20232B]",
    "text-white",
    "hover:border-[#FFD166]/50",
    "hover:bg-[#292D36]",
    "focus-visible:ring-[#FFD166]",
  ].join(" "),

  danger: [
    "border-red-500",
    "bg-red-500",
    "text-white",
    "hover:border-red-400",
    "hover:bg-red-400",
    "focus-visible:ring-red-500",
  ].join(" "),

  ghost: [
    "border-transparent",
    "bg-transparent",
    "text-zinc-300",
    "hover:border-white/10",
    "hover:bg-white/5",
    "hover:text-white",
    "focus-visible:ring-white/40",
  ].join(" "),
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: [
    "min-h-10",
    "rounded-xl",
    "px-4",
    "py-2",
    "text-sm",
  ].join(" "),

  md: [
    "min-h-12",
    "rounded-2xl",
    "px-5",
    "py-3",
    "text-base",
  ].join(" "),

  lg: [
    "min-h-14",
    "rounded-2xl",
    "px-6",
    "py-4",
    "text-lg",
  ].join(" "),
};

export default function Button({
  children,

  variant = "gold",

  size = "md",

  fullWidth = false,

  loading = false,

  leftIcon,

  rightIcon,

  disabled,

  className = "",

  type = "button",

  style,

  ...buttonProps
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const classes = [
    "relative",
    "inline-flex",
    "select-none",
    "items-center",
    "justify-center",
    "gap-2",
    "overflow-hidden",
    "border",
    "font-black",
    "transition-colors",
    "duration-200",

    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-[#0B0E13]",

    "disabled:cursor-not-allowed",
    "disabled:opacity-45",

    fullWidth ? "w-full" : "w-auto",

    VARIANT_CLASSES[variant],

    SIZE_CLASSES[size],

    className,
  ]
    .filter(Boolean)
    .join(" ");

  const shadow =
    variant === "gold"
      ? theme.shadow.gold
      : variant === "danger"
      ? theme.shadow.danger
      : undefined;

  return (
    <motion.button
      {...buttonProps}
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={classes}
      style={{
        boxShadow: isDisabled ? undefined : shadow,
        ...style,
      }}
      whileHover={
        isDisabled
          ? undefined
          : {
              y: -2,
              scale: 1.01,
            }
      }
      whileTap={
        isDisabled
          ? undefined
          : {
              y: 1,
              scale: 0.98,
            }
      }
      transition={{
        duration: theme.animation.fast,
        ease: theme.animation.easing,
      }}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}

      {!loading && leftIcon && (
        <span
          aria-hidden="true"
          className="flex shrink-0 items-center justify-center"
        >
          {leftIcon}
        </span>
      )}

      <span>{children}</span>

      {!loading && rightIcon && (
        <span
          aria-hidden="true"
          className="flex shrink-0 items-center justify-center"
        >
          {rightIcon}
        </span>
      )}
    </motion.button>
  );
}