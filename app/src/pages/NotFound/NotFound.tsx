import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.root}>
      <div className={styles.glyphRow} aria-hidden="true">
        <span className={`${styles.glyph} ${styles.glyphRed}`}>🂠</span>
        <span className={`${styles.glyph} ${styles.glyphBlue}`}>🂠</span>
        <span className={`${styles.glyph} ${styles.glyphYellow}`}>🂠</span>
      </div>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>¡Ups! Carta fuera del mazo</h2>
      <p className={styles.description}>
        La página que buscas no existe o ha sido eliminada.
      </p>
      <Link to="/" className={styles.homeLink}>
        Volver al inicio
      </Link>
    </div>
  );
}
