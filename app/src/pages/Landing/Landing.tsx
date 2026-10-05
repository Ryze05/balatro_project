import { Link } from "react-router-dom";
import styles from "./Landing.module.css";
 
export default function Landing() {
  return (
    <div className={styles.root}>
      <div className={styles.hero}>
        <h1 className={styles.title}>BALATRO WEB</h1>
        <p className={styles.subtitle}>
          Un juego de póker y construcción de mazo, proyecto de estudio.
        </p>
        <Link to="/game" className={styles.playLink}>
          Ir al Menú
        </Link>
      </div>
    </div>
  );
}
