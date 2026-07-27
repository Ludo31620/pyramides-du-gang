"use client";

import {
  motion,
  type HTMLMotionProps,
} from "framer-motion";

import type {
  ReactNode,
} from "react";

import {
  theme,
} from "@/lib/theme";

export type CardVariant =
  | "default"
  | "gold"
  | "danger"
  | "success";

interface CardProps
  extends Omit<
    HTMLMotionProps<"div">,
    "title"
  > {
  children: ReactNode;

  title?: ReactNode;

  subtitle?: ReactNode;

  icon?: ReactNode;

  footer?: ReactNode;

  variant?: CardVariant;

  interactive?: boolean;

  selected?: boolean;

  disabled?: boolean;

  padded?: boolean;
}

const VARIANT_CLASSES: Record<
  CardVariant,
  string
> = {
  default: [
    "border-[#2B2E36]",
    "bg-[#181A20]",
  ].join(" "),

  gold: [
    "border-[#FFD166]/40",
    "bg-gradient-to-br",
    "from-[#FFD166]/10",
    "via-[#181A20]",
    "to-[#181A20]",
  ].join(" "),

  danger: [
    "border-red-500/40",
    "bg-gradient-to-br",
    "from-red-500/10",
    "via-[#181A20]",
    "to-[#181A20]",
  ].join(" "),

  success: [
    "border-emerald-500/40",
    "bg-gradient-to-br",
    "from-emerald-500/10",
    "via-[#181A20]",
    "to-[#181A20]",
  ].join(" "),
};

const SELECTED_CLASSES: Record<
  CardVariant,
  string
> = {
  default:
    "border-[#FFD166] ring-2 ring-[#FFD166]/20",

  gold:
    "border-[#FFD166] ring-2 ring-[#FFD166]/25",

  danger:
    "border-red-400 ring-2 ring-red-500/20",

  success:
    "border-emerald-400 ring-2 ring-emerald-500/20",
};

export default function Card({
  children,

  title,

  subtitle,

  icon,

  footer,

  variant = "default",

  interactive = false,

  selected = false,

  disabled = false,

  padded = true,

  className = "",

  style,

  onClick,

  tabIndex,

  role,

  onKeyDown,

  ...cardProps
}: CardProps) {
  const isInteractive =
    interactive && !disabled;

  const classes = [
    "relative",
    "overflow-hidden",
    "rounded-3xl",
    "border",
    "text-white",
    "transition-colors",
    "duration-200",

    padded
      ? "p-5 sm:p-6"
      : "",

    VARIANT_CLASSES[variant],

    selected
      ? SELECTED_CLASSES[variant]
      : "",

    isInteractive
      ? [
          "cursor-pointer",
          "select-none",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-[#FFD166]",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[#0B0E13]",
        ].join(" ")
      : "",

    disabled
      ? "cursor-not-allowed opacity-45"
      : "",

    className,
  ]
    .filter(Boolean)
    .join(" ");

  const selectedShadow =
    variant === "danger"
      ? theme.shadow.danger
      : theme.shadow.gold;

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLDivElement>,
  ) {
    onKeyDown?.(event);

    if (
      !isInteractive ||
      event.defaultPrevented
    ) {
      return;
    }

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      event.currentTarget.click();
    }
  }

  return (
    <motion.div
      {...cardProps}
      role={
        isInteractive
          ? role ?? "button"
          : role
      }
      tabIndex={
        isInteractive
          ? tabIndex ?? 0
          : tabIndex
      }
      aria-disabled={
        disabled || undefined
      }
      aria-pressed={
        isInteractive
          ? selected
          : undefined
      }
      className={classes}
      style={{
        boxShadow: selected
          ? selectedShadow
          : undefined,

        ...style,
      }}
      onClick={
        disabled
          ? undefined
          : onClick
      }
      onKeyDown={handleKeyDown}
      whileHover={
        isInteractive
          ? {
              y: -4,
              scale: 1.01,
            }
          : undefined
      }
      whileTap={
        isInteractive
          ? {
              y: 0,
              scale: 0.985,
            }
          : undefined
      }
      transition={{
        duration:
          theme.animation.fast,

        ease:
          theme.animation.easing,
      }}
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-x-8
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/25
          to-transparent
        "
      />

      {(icon || title || subtitle) && (
        <header
          className={[
            "flex",
            "items-start",
            "gap-4",

            children
              ? "mb-5"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {icon && (
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-white/10
                bg-white/5
                text-[#FFD166]
              "
            >
              {icon}
            </div>
          )}

          {(title || subtitle) && (
            <div className="min-w-0 flex-1">
              {title && (
                <h3
                  className="
                    text-lg
                    font-black
                    leading-tight
                    tracking-wide
                    text-white
                  "
                >
                  {title}
                </h3>
              )}

              {subtitle && (
                <p
                  className="
                    mt-1
                    text-sm
                    leading-relaxed
                    text-zinc-400
                  "
                >
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {selected && (
            <div
              aria-label="Sélectionné"
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#FFD166]
                text-sm
                font-black
                text-[#111318]
              "
            >
              ✓
            </div>
          )}
        </header>
      )}

      <div>{children}</div>

      {footer && (
        <footer
          className="
            mt-5
            border-t
            border-white/10
            pt-4
          "
        >
          {footer}
        </footer>
      )}
    </motion.div>
  );
}