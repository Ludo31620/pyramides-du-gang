export const theme = {
  colors: {
    background: "#0B0E13",
    surface: "#181A20",
    surfaceLight: "#20232B",
    border: "#2B2E36",

    gold: "#FFD166",
    goldLight: "#FFE08A",
    goldDark: "#D9A928",

    text: "#FFFFFF",
    muted: "#9CA3AF",

    danger: "#EF4444",
    dangerLight: "#F87171",

    success: "#22C55E",
    successLight: "#4ADE80",
  },

  radius: {
    sm: "12px",
    md: "18px",
    lg: "24px",
    full: "9999px",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  animation: {
    fast: 0.15,
    normal: 0.25,
    slow: 0.4,

    easing: [0.22, 1, 0.36, 1] as const,
  },

  shadow: {
    panel:
      "0 24px 60px rgba(0, 0, 0, 0.35)",

    gold:
      "0 0 32px rgba(255, 209, 102, 0.28)",

    goldStrong:
      "0 0 46px rgba(255, 209, 102, 0.4)",

    danger:
      "0 0 32px rgba(239, 68, 68, 0.25)",
  },
} as const;

export type Theme = typeof theme;