import { useEffect, useState, type JSX } from "react";
import styles from "./FullscreenToggle.module.css";

export function FullscreenToggle(): JSX.Element {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const update = (): void => setIsFullscreen(Boolean(document.fullscreenElement));

    update();
    document.addEventListener("fullscreenchange", update);

    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  const toggle = (): void => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen();
    }
  };

  return (
    <button type="button" className={styles.button} onClick={toggle}>
      {isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
    </button>
  );
}

export default FullscreenToggle;