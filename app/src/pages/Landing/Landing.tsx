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
          Jugar Partida
        </Link>
      </div>
 
      <div className={styles.presentationSection}>
        <p className={styles.presentationLabel}>Presentación del proyecto</p>
        <div className={styles.presentationCard}>
          <div className={styles.presentationFrameWrap}>
            <iframe
              className={styles.presentationFrame}
              src="https://www.canva.com/design/DAHT2gnsSDg/6P7I361trcuZTHduXnoRaA/view?embed"
              loading="lazy"
              allow="fullscreen"
              allowFullScreen
              title="Presentación del proyecto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}