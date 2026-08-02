export type ThemeId =
  | "classic"
  | "gang"
  | "casino"
  | "neon";

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryHover: string;
  primaryText: string;
  danger: string;
  success: string;
}

export interface GameTheme {
  id: ThemeId;
  name: string;
  description: string;
  icon: string;
  premium: boolean;
  colors: ThemeColors;
}