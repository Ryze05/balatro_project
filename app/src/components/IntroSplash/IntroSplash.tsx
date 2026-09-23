import { useEffect, useState, type JSX } from "react";
import styles from "./IntroSplash.module.css";

interface IntroSplashProps {
  onComplete: () => void;
  variant?: "start" | "menu";
}

const TITLES = {
  start: "BALATRO",
  menu: "MENÚ",
} as const;

export default function IntroSplash({ onComplete, variant = "start" }: IntroSplashProps): JSX.Element {
  const title = TITLES[variant];
  const [visibleLetters, setVisibleLetters] = useState(0);

  useEffect(() => {
    const letterTimer = window.setInterval(() => {
      setVisibleLetters((current) => {
        if (current >= title.length) {
          window.clearInterval(letterTimer);
          return current;
        }
        return current + 1;
      });
    }, 75);

    const completeTimer = window.setTimeout(onComplete, 1500);

    return () => {
      window.clearInterval(letterTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, variant, title.length]);

  return (
    <main
      className={`${styles.root} ${variant === "menu" ? styles.menuRoot : ""}`}
      aria-label={variant === "menu" ? "Menú principal" : "Balatro Web"}
    >
      <div className={styles.card} aria-hidden="true">
        <span className={styles.cardRank}>A</span>
        <span className={styles.cardSuit}>♥</span>
      </div>
      <h1 className={styles.title} aria-label={title}>
        {title.split("").map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className={index < visibleLetters ? styles.letterVisible : styles.letter}
          >
            {letter === " " ? "\u00a0" : letter}
          </span>
        ))}
      </h1>
    </main>
  );
}
