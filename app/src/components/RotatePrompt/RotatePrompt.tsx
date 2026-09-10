import { useEffect, useState, type JSX } from "react";
import styles from "./RotatePrompt.module.css";

export function RotatePrompt(): JSX.Element | null {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(
      "(orientation: portrait) and (max-width: 720px)",
    );
    const update = (): void => setIsPortrait(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (!isPortrait) return null;

  return (
    <div className={styles.overlay}>
      <span className={styles.icon} aria-hidden="true">
        ⟳
      </span>
      <p className={styles.text}>Gira tu dispositivo para jugar</p>
    </div>
  );
}

export default RotatePrompt;