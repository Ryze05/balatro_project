import { useState, type DragEvent, type JSX } from "react";
import styles from "./JokerSidebar.module.css";
import type { Joker } from "../../types/joker";

interface JokerSidebarProps {
  money: number;
  jokers: Joker[];
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const RARITY_LABEL: Record<Joker["rarity"], string> = {
  common: "Común",
  uncommon: "Poco común",
  rare: "Raro",
  legendary: "Legendario",
};

export function JokerSidebar({ money, jokers, onReorder }: JokerSidebarProps): JSX.Element {
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

  return (
    <aside className={styles.sidebar}>
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
