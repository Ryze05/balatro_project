import type { JSX } from "react";
import styles from "./ThemeSelector.module.css";
import { useTheme, type ThemeId } from "../../context/ThemeContext";

const THEMES: { id: ThemeId; label: string }[] = [
  { id: "retro-casino", label: "Retro Casino" },
  { id: "neon-night", label: "Neon Night" },
];

export function ThemeSelector(): JSX.Element {
  const { theme, setTheme } = useTheme();

  return (
    <div className={styles.root}>
      <span className={styles.label}>Tema</span>
      <div className={styles.options}>
        {THEMES.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`${styles.option} ${theme === option.id ? styles.optionActive : ""}`}
            onClick={() => setTheme(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThemeSelector;