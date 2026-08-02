"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getStoredThemeId,
  saveThemeId,
} from "./storage";

import {
  getTheme,
} from "./themes";

import type {
  GameTheme,
  ThemeId,
} from "./types";

interface ThemeContextValue {
  theme: GameTheme;

  themeId: ThemeId;

  setTheme: (
    themeId: ThemeId
  ) => void;
}

const ThemeContext =
  createContext<
    ThemeContextValue | null
  >(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [
    themeId,
    setThemeId,
  ] = useState<ThemeId>(
    "classic"
  );

  useEffect(() => {
    setThemeId(
      getStoredThemeId()
    );
  }, []);

  useEffect(() => {
    const theme =
      getTheme(themeId);

    const root =
      document.documentElement;

    root.style.setProperty(
      "--color-background",
      theme.colors.background
    );

    root.style.setProperty(
      "--color-surface",
      theme.colors.surface
    );

    root.style.setProperty(
      "--color-surface-elevated",
      theme.colors.surfaceElevated
    );

    root.style.setProperty(
      "--color-border",
      theme.colors.border
    );

    root.style.setProperty(
      "--color-text",
      theme.colors.text
    );

    root.style.setProperty(
      "--color-text-muted",
      theme.colors.textMuted
    );

    root.style.setProperty(
      "--color-primary",
      theme.colors.primary
    );

    root.style.setProperty(
      "--color-primary-hover",
      theme.colors.primaryHover
    );

    root.style.setProperty(
      "--color-primary-text",
      theme.colors.primaryText
    );

    root.style.setProperty(
      "--color-danger",
      theme.colors.danger
    );

    root.style.setProperty(
      "--color-success",
      theme.colors.success
    );
  }, [themeId]);

  const value =
    useMemo(
      () => ({
        theme:
          getTheme(
            themeId
          ),

        themeId,

setTheme(
  nextTheme: ThemeId
) {
  saveThemeId(
    nextTheme
  );

  setThemeId(
    nextTheme
  );
},
      }),
      [themeId]
    );

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(
      ThemeContext
    );

  if (!context) {
    throw new Error(
      "ThemeProvider manquant."
    );
  }

  return context;
}