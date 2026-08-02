import type {
  GameTheme,
  ThemeId,
} from "./types";

export const DEFAULT_THEME_ID:
  ThemeId = "classic";

export const GAME_THEMES:
  Record<
    ThemeId,
    GameTheme
  > = {
  classic: {
    id: "classic",

    name:
      "Classique",

    description:
      "L’apparence officielle de Pyramide du Gang.",

    icon:
      "🟡",

    premium:
      false,

    colors: {
      background:
        "#0B0E13",

      surface:
        "#181A20",

      surfaceElevated:
        "#24272F",

      border:
        "#343842",

      text:
        "#FFFFFF",

      textMuted:
        "#A1A1AA",

      primary:
        "#FACC15",

      primaryHover:
        "#FDE047",

      primaryText:
        "#111318",

      danger:
        "#EF4444",

      success:
        "#34D399",
    },
  },

  gang: {
    id: "gang",

    name:
      "Gang Noir",

    description:
      "Une ambiance sombre, métallique et dorée.",

    icon:
      "⚫",

    premium:
      true,

    colors: {
      background:
        "#070707",

      surface:
        "#111111",

      surfaceElevated:
        "#1B1B1B",

      border:
        "#36302A",

      text:
        "#F8F4E8",

      textMuted:
        "#A8A29E",

      primary:
        "#D4AF37",

      primaryHover:
        "#E7C75C",

      primaryText:
        "#090909",

      danger:
        "#DC2626",

      success:
        "#22C55E",
    },
  },

  casino: {
    id: "casino",

    name:
      "Casino Royal",

    description:
      "Rouge profond, or et tables de jeu.",

    icon:
      "🔴",

    premium:
      true,

    colors: {
      background:
        "#160607",

      surface:
        "#260B0E",

      surfaceElevated:
        "#391014",

      border:
        "#6B2028",

      text:
        "#FFF7ED",

      textMuted:
        "#D6B9B9",

      primary:
        "#F5C451",

      primaryHover:
        "#FFD66F",

      primaryText:
        "#221006",

      danger:
        "#FB7185",

      success:
        "#4ADE80",
    },
  },

  neon: {
    id: "neon",

    name:
      "Néon",

    description:
      "Une ambiance nocturne violette et électrique.",

    icon:
      "🟣",

    premium:
      true,

    colors: {
      background:
        "#090612",

      surface:
        "#151022",

      surfaceElevated:
        "#211832",

      border:
        "#49336B",

      text:
        "#F8F4FF",

      textMuted:
        "#B7A9CC",

      primary:
        "#C084FC",

      primaryHover:
        "#D8B4FE",

      primaryText:
        "#160822",

      danger:
        "#FB7185",

      success:
        "#2DD4BF",
    },
  },
};

export function getTheme(
  themeId: ThemeId
): GameTheme {
  return (
    GAME_THEMES[
      themeId
    ] ??
    GAME_THEMES[
      DEFAULT_THEME_ID
    ]
  );
}

export function getAvailableThemes():
  GameTheme[] {
  return Object.values(
    GAME_THEMES
  );
}