"use client";

import type {
  ReactNode,
} from "react";

export type ActionVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost";

export type ActionPanelAction = {
  id: string;
  label: string;
  icon?: ReactNode;
  variant?: ActionVariant;
  disabled?: boolean;
  onClick: () => void;
};

type ActionPanelProps = {
  eyebrow?: string;
  icon?: ReactNode;
  title: string;
  description?: string;
  actions?: ActionPanelAction[];
  children?: ReactNode;
  footer?: ReactNode;
  highlighted?: boolean;
};

const variantClasses: Record<
  ActionVariant,
  string
> = {
  primary:
    "border-[#FFD166] bg-[#FFD166] text-[#111318] shadow-[0_12px_35px_rgba(255,209,102,0.18)] hover:bg-[#FFE08A] hover:shadow-[0_15px_45px_rgba(255,209,102,0.28)]",

  secondary:
    "border-[#343842] bg-[#24272F] text-white hover:border-[#505562] hover:bg-[#2C3039]",

  danger:
    "border-red-500/60 bg-red-600 text-white shadow-[0_12px_35px_rgba(220,38,38,0.16)] hover:bg-red-500",

  ghost:
    "border-transparent bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white",
};

export default function ActionPanel({
  eyebrow,
  icon,
  title,
  description,
  actions = [],
  children,
  footer,
  highlighted = false,
}: ActionPanelProps) {
  return (
    <section
      className={`
        relative
        overflow-hidden
        rounded-[28px]
        border
        bg-[#181A20]
        px-5
        py-6
        text-white
        shadow-[0_24px_70px_rgba(0,0,0,0.3)]
        sm:px-7
        sm:py-7
        ${
          highlighted
            ? "border-[#FFD166]/45"
            : "border-[#292C34]"
        }
      `}
    >
      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-40
          w-64
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          blur-3xl
          ${
            highlighted
              ? "bg-[#FFD166]/15"
              : "bg-[#7C5CFC]/10"
          }
        `}
      />

      <div className="relative">
        <header className="text-center">
          {eyebrow && (
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#FFD166]">
              {eyebrow}
            </p>
          )}

          {icon && (
            <div
              className="
                mx-auto
                mt-4
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                border
                border-[#343842]
                bg-[#22252C]
                text-3xl
                shadow-[0_10px_30px_rgba(0,0,0,0.25)]
              "
            >
              {icon}
            </div>
          )}

          <h2
            className={`
              text-2xl
              font-black
              tracking-tight
              sm:text-3xl
              ${
                eyebrow || icon
                  ? "mt-4"
                  : ""
              }
            `}
          >
            {title}
          </h2>

          {description && (
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400 sm:text-base">
              {description}
            </p>
          )}
        </header>

        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}

        {actions.length > 0 && (
          <div className="mt-7 space-y-3">
            {actions.map((action) => {
              const variant =
                action.variant ??
                "secondary";

              return (
                <button
                  key={action.id}
                  type="button"
                  disabled={
                    action.disabled
                  }
                  onClick={
                    action.onClick
                  }
                  className={`
                    flex
                    min-h-14
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-2xl
                    border
                    px-5
                    py-4
                    text-base
                    font-black
                    transition-all
                    duration-200
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    disabled:hover:shadow-none
                    ${
                      variantClasses[
                        variant
                      ]
                    }
                  `}
                >
                  {action.icon && (
                    <span className="text-xl">
                      {action.icon}
                    </span>
                  )}

                  <span>
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {footer && (
          <div className="mt-5 border-t border-[#292C34] pt-5 text-center text-sm text-zinc-500">
            {footer}
          </div>
        )}
      </div>
    </section>
  );
}