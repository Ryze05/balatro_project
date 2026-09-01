import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.root}>
      <span className={styles.cardGlyph}>🂠</span>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.title}>Oops! Card out of deck</h2>
      <p className={styles.description}>
        The page you are looking for does not exist or has been deleted.
      </p>
      <Link to="/" className={styles.homeLink}>
        Back to Home
      </Link>
    </div>
  );
}
