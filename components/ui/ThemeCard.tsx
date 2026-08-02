import type {
  HTMLAttributes,
  ReactNode,
} from "react";

type ThemeCardVariant =
  | "default"
  | "elevated"
  | "highlighted"
  | "danger";

interface ThemeCardProps
  extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  variant?: ThemeCardVariant;
  as?: "section" | "div" | "article";
}

export default function ThemeCard({
  children,
  variant = "default",
  as: Component = "section",
  className = "",
  ...props
}: ThemeCardProps) {
  let variantClasses = "";

  switch (variant) {
    case "default":
      variantClasses = `
        border-[var(--color-border)]
        bg-[var(--color-surface)]
      `;
      break;

    case "elevated":
      variantClasses = `
        border-[var(--color-border)]
        bg-[var(--color-surface-elevated)]
      `;
      break;

    case "highlighted":
      variantClasses = `
        border-[var(--color-primary)]
        bg-[var(--color-surface)]
      `;
      break;

    case "danger":
      variantClasses = `
        border-[var(--color-danger)]
        bg-[var(--color-surface)]
      `;
      break;

    default: {
      const exhaustiveCheck:
        never =
        variant;

      throw new Error(
        `Variante ThemeCard inconnue : ${exhaustiveCheck}`
      );
    }
  }

  return (
    <Component
      {...props}
      className={`
        rounded-3xl
        border
        p-5
        text-[var(--color-text)]
        shadow-md
        transition-colors
        duration-200
        sm:p-7
        ${variantClasses}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}