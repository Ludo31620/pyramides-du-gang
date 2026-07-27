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

export type InputState =
  | "default"
  | "success"
  | "error";

interface InputProps
  extends Omit<
    HTMLMotionProps<"input">,
    "size"
  > {
  label?: ReactNode;

  helper?: ReactNode;

  error?: ReactNode;

  success?: ReactNode;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;

  fullWidth?: boolean;

  inputSize?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "min-h-10 px-3 text-sm",

  md: "min-h-12 px-4 text-base",

  lg: "min-h-14 px-5 text-lg",
} as const;

export default function Input({
  label,

  helper,

  error,

  success,

  leftIcon,

  rightIcon,

  fullWidth = true,

  inputSize = "md",

  id,

  name,

  disabled,

  required,

  className = "",

  style,

  "aria-describedby": ariaDescribedBy,

  ...inputProps
}: InputProps) {
  const inputId =
    id ??
    name ??
    undefined;

  const helperId =
    inputId
      ? `${inputId}-helper`
      : undefined;

  const errorId =
    inputId
      ? `${inputId}-error`
      : undefined;

  const successId =
    inputId
      ? `${inputId}-success`
      : undefined;

  const state: InputState =
    error
      ? "error"
      : success
        ? "success"
        : "default";

  const describedBy = [
    ariaDescribedBy,

    error
      ? errorId
      : undefined,

    !error && success
      ? successId
      : undefined,

    !error && !success && helper
      ? helperId
      : undefined,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const borderClasses = {
    default: [
      "border-[#353944]",
      "focus-within:border-[#FFD166]",
      "focus-within:ring-[#FFD166]/15",
    ].join(" "),

    success: [
      "border-emerald-500/70",
      "focus-within:border-emerald-400",
      "focus-within:ring-emerald-500/15",
    ].join(" "),

    error: [
      "border-red-500/70",
      "focus-within:border-red-400",
      "focus-within:ring-red-500/15",
    ].join(" "),
  } satisfies Record<InputState, string>;

  const iconColorClasses = {
    default:
      "text-zinc-500 group-focus-within:text-[#FFD166]",

    success:
      "text-emerald-400",

    error:
      "text-red-400",
  } satisfies Record<InputState, string>;

  return (
    <div
      className={
        fullWidth
          ? "w-full"
          : "w-auto"
      }
    >
      {label && (
        <label
          htmlFor={inputId}
          className="
            mb-2
            block
            text-sm
            font-bold
            tracking-wide
            text-zinc-200
          "
        >
          {label}

          {required && (
            <span
              aria-hidden="true"
              className="ml-1 text-[#FFD166]"
            >
              *
            </span>
          )}
        </label>
      )}

      <motion.div
  className={[
    "group",
    "relative",
    "flex",
    "items-center",
    "overflow-hidden",
    "rounded-2xl",
    "border",
    "bg-[#181A20]",
    "ring-4",
    "ring-transparent",
    "transition-colors",
    "duration-200",

    borderClasses[state],

    disabled
      ? "cursor-not-allowed opacity-45"
      : "",

    fullWidth
      ? "w-full"
      : "w-auto",
  ]
    .filter(Boolean)
    .join(" ")}
  transition={{
    duration: theme.animation.fast,
    ease: theme.animation.easing,
  }}
>
        {leftIcon && (
          <span
            aria-hidden="true"
            className={[
              "pointer-events-none",
              "absolute",
              "left-4",
              "flex",
              "items-center",
              "justify-center",
              "transition-colors",
              "duration-200",

              iconColorClasses[state],
            ].join(" ")}
          >
            {leftIcon}
          </span>
        )}

        <motion.input
          {...inputProps}
          id={inputId}
          name={name}
          disabled={disabled}
          required={required}
          aria-invalid={
            error
              ? true
              : undefined
          }
          aria-describedby={describedBy}
          className={[
            "w-full",
            "border-none",
            "bg-transparent",
            "font-semibold",
            "text-white",
            "outline-none",
            "placeholder:font-normal",
            "placeholder:text-zinc-600",
            "disabled:cursor-not-allowed",

            SIZE_CLASSES[inputSize],

            leftIcon
              ? "pl-12"
              : "",

            rightIcon
              ? "pr-12"
              : "",

            className,
          ]
            .filter(Boolean)
            .join(" ")}
          style={style}
        />

        {rightIcon && (
          <span
            aria-hidden="true"
            className={[
              "absolute",
              "right-4",
              "flex",
              "items-center",
              "justify-center",
              "transition-colors",
              "duration-200",

              iconColorClasses[state],
            ].join(" ")}
          >
            {rightIcon}
          </span>
        )}

        <div
          aria-hidden="true"
          className={[
            "pointer-events-none",
            "absolute",
            "inset-x-6",
            "bottom-0",
            "h-px",
            "origin-center",
            "scale-x-0",
            "bg-gradient-to-r",
            "from-transparent",
            "to-transparent",
            "transition-transform",
            "duration-300",
            "group-focus-within:scale-x-100",

            state === "error"
              ? "via-red-400"
              : state === "success"
                ? "via-emerald-400"
                : "via-[#FFD166]",
          ].join(" ")}
        />
      </motion.div>

      {error && (
        <motion.p
          id={errorId}
          role="alert"
          initial={{
            opacity: 0,
            y: -4,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            mt-2
            text-sm
            font-medium
            text-red-400
          "
        >
          {error}
        </motion.p>
      )}

      {!error && success && (
        <motion.p
          id={successId}
          initial={{
            opacity: 0,
            y: -4,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            mt-2
            text-sm
            font-medium
            text-emerald-400
          "
        >
          {success}
        </motion.p>
      )}

      {!error && !success && helper && (
        <p
          id={helperId}
          className="
            mt-2
            text-sm
            leading-relaxed
            text-zinc-500
          "
        >
          {helper}
        </p>
      )}
    </div>
  );
}