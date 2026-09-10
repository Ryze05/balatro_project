import { useEffect, useState, type JSX, type ReactNode } from "react";
import { ThemeContext, type ThemeId } from "./ThemeContext";

const STORAGE_KEY = "balatro-theme";

function getStoredTheme(): ThemeId {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "neon-night" ? "neon-night" : "retro-casino";
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const [theme, setTheme] = useState<ThemeId>(getStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}