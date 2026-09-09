import type { JSX } from "react";
import styles from "./GameOverPanel.module.css";
import type { Blind } from "../../types/game";
import type { Joker } from "../../types/joker";

interface GameOverPanelProps {
  level: number;
  round: number;
  currentBlind: Blind;
  score: number;
  money: number;
  jokers: Joker[];
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOverPanel({
  level,
  round,
  currentBlind,
  score,
  money,
  jokers,
  onRestart,
  onMenu,
}: GameOverPanelProps): JSX.Element {
  return (
    <div className={styles.root}>
      <div className={styles.panel}>
        <span className={styles.glyph} aria-hidden="true">🂠</span>

        <h1 className={styles.title}>Game Over</h1>
        <p className={styles.subtitle}>
          Derrotado en {currentBlind.name} — Nivel {level}
        </p>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Ronda</span>
            <span className={styles.statValue}>{round}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Puntuación</span>
            <span className={styles.statValue}>{score.toLocaleString()}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Objetivo</span>
            <span className={styles.statValue}>{currentBlind.targetScore.toLocaleString()}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Dinero</span>
            <span className={styles.statValueMoney}>${money}</span>
          </div>
        </div>

        <div className={styles.jokerRow}>
          <span className={styles.jokerRowLabel}>Comodines ({jokers.length})</span>
          {jokers.length === 0 ? (
            <p className={styles.emptyText}>No conseguiste ningún comodín.</p>
          ) : (
            <div className={styles.jokerChips}>
              {jokers.map((joker) => (
                <span key={joker.id} className={`${styles.jokerChip} ${styles[`rarity_${joker.rarity}`]}`}>
                  {joker.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.menuButton} onClick={onMenu}>
            Menú Principal
          </button>
          <button type="button" className={styles.restartButton} onClick={onRestart}>
            Jugar de Nuevo
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameOverPanel;
