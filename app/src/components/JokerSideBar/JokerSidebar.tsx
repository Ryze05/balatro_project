import { useState, type DragEvent, type JSX } from "react";
import styles from "./JokerSidebar.module.css";
import type { Joker } from "../../types/joker";
import type { Blind } from "../../types/game";

interface JokerSidebarProps {
  money: number;
  jokers: Joker[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  blind: Blind;
  score: number;
}

const RARITY_LABEL: Record<Joker["rarity"], string> = {
  common: "Común",
  uncommon: "Poco común",
  rare: "Raro",
  legendary: "Legendario",
};

const BLIND_TYPE_LABEL: Record<Blind["type"], string> = {
  small: "Small Blind",
  big: "Big Blind",
  boss: "Boss Blind",
};

export function JokerSidebar({ money, jokers, onReorder, blind, score }: JokerSidebarProps): JSX.Element {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => (e: DragEvent<HTMLLIElement>) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (index: number) => (e: DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    if (index !== overIndex) setOverIndex(index);
  };

  const handleDrop = (index: number) => (e: DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorder(draggedIndex, index);
    }
    setDraggedIndex(null);
    setOverIndex(null);
  };

  const handleDragEnd = (): void => {
    setDraggedIndex(null);
    setOverIndex(null);
  };

  const moveUp = (index: number): void => {
    if (index > 0) onReorder(index, index - 1);
  };

  const moveDown = (index: number): void => {
    if (index < jokers.length - 1) onReorder(index, index + 1);
  };

  //* El panel de puntuación solo se muestra si hay un blind activo
  //* (evita mostrar "None" / 0 mientras se está en menú, tienda, etc.)
  const hasActiveBlind = blind.id !== "none";
  const progress =
    hasActiveBlind && blind.targetScore > 0
      ? Math.min(100, (score / blind.targetScore) * 100)
      : 0;

  return (
    <aside className={styles.sidebar}>
      {hasActiveBlind && (
        <div className={`${styles.scorePanel} ${styles[`scorePanel_${blind.type}`]}`}>
          <div className={styles.scorePanelHeader}>
            <span className={styles.scoreBlindType}>{BLIND_TYPE_LABEL[blind.type]}</span>
            <span className={styles.scoreBlindName}>{blind.name}</span>
          </div>

          <div className={styles.scoreMain}>
            <span className={styles.scoreMainLabel}>Puntos</span>
            <span className={styles.scoreMainValue}>{score.toLocaleString()}</span>
          </div>

          <div className={styles.scoreProgressTrack}>
            <div className={styles.scoreProgressFill} style={{ width: `${progress}%` }} />
          </div>

          <div className={styles.scoreTargetRow}>
            <span className={styles.scoreTargetLabel}>Objetivo</span>
            <span className={styles.scoreTargetValue}>{blind.targetScore.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className={styles.moneyBlock}>
        <span className={styles.moneyLabel}>Dinero</span>
        <span className={styles.moneyValue}>${money}</span>
      </div>

      <div className={styles.jokerSection}>
        <div className={styles.jokerHeader}>
          <span className={styles.jokerTitle}>Comodines</span>
          <span className={styles.jokerCount}>{jokers.length}</span>
        </div>

        {jokers.length === 0 ? (
          <p className={styles.emptyText}>
            Todavía no tienes comodines. Cómpralos en la tienda.
          </p>
        ) : (
          <ul className={styles.jokerList}>
            {jokers.map((joker, index) => (
              <li
                key={joker.id}
                className={`${styles.jokerItem} ${styles[`rarity_${joker.rarity}`]} ${
                  draggedIndex === index ? styles.dragging : ""
                } ${
                  overIndex === index && draggedIndex !== null && draggedIndex !== index
                    ? styles.dragOver
                    : ""
                }`}
                draggable
                onDragStart={handleDragStart(index)}
                onDragOver={handleDragOver(index)}
                onDrop={handleDrop(index)}
                onDragEnd={handleDragEnd}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.dragHandle} aria-hidden="true">⠿</span>
                  <span className={styles.cardGlyph} aria-hidden="true">🃏</span>
                  <span className={styles.positionBadge}>#{index + 1}</span>
                </div>

                <div className={styles.cardBody}>
                  <span className={styles.jokerName}>{joker.name}</span>
                  <span className={styles.jokerRarity}>{RARITY_LABEL[joker.rarity]}</span>
                  <p className={styles.jokerDescription}>{joker.description}</p>
                </div>

                <div className={styles.reorderButtons}>
                  <button
                    type="button"
                    className={styles.reorderButton}
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    aria-label={`Mover ${joker.name} hacia arriba`}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className={styles.reorderButton}
                    onClick={() => moveDown(index)}
                    disabled={index === jokers.length - 1}
                    aria-label={`Mover ${joker.name} hacia abajo`}
                  >
                    ▼
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

export default JokerSidebar;
