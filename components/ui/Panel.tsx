"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { theme } from "@/lib/theme";

interface PanelProps {
  children: ReactNode;

  title?: ReactNode;

  footer?: ReactNode;

  className?: string;

  animated?: boolean;
}

export default function Panel({
  children,
  title,
  footer,
  className = "",
  animated = true,
}: PanelProps) {
  const content = (
    <div
      className={[
        "relative",
        "overflow-hidden",
        "rounded-3xl",
        "border",
        "border-[#2B2E36]",
        "bg-[#181A20]",
        "p-6",
        "text-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        boxShadow: theme.shadow.panel,
      }}
    >
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#FFD166]/50
          to-transparent
        "
      />

      {title && (
        <div className="mb-6">
          <h2 className="text-xl font-black tracking-wide">
            {title}
          </h2>
        </div>
      )}

      <div>
        {children}
      </div>

      {footer && (
        <div className="mt-6 border-t border-white/10 pt-4">
          {footer}
        </div>
      )}
    </div>
  );

  if (!animated) {
    return content;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: theme.animation.normal,
        ease: theme.animation.easing,
      }}
    >
      {content}
    </motion.div>
  );
}