import { useState, type DragEvent, type JSX } from "react";
import styles from "./JokerBoard.module.css";
import type { Joker } from "../../types/joker";
import type { Consumable } from "../../types/consumable";

interface JokerBoardProps {
  jokers: Joker[];
  consumables: Consumable[];
  maxConsumableSlots: number;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onUseConsumable: (consumable: Consumable) => void;
}

const RARITY_LABEL: Record<Joker["rarity"], string> = {
  common: "Común",
  uncommon: "Poco común",
  rare: "Raro",
  legendary: "Legendario",
};

export function JokerBoard({
  jokers,
  consumables,
  maxConsumableSlots,
  onReorder,
  onUseConsumable,
}: JokerBoardProps): JSX.Element {
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

  //* Al pasar la fila de comodines a horizontal, "arriba/abajo" pasa a
  //* ser "izquierda/derecha", pero la lógica de reordenar es la misma.
  const moveLeft = (index: number): void => {
    if (index > 0) onReorder(index, index - 1);
  };

  const moveRight = (index: number): void => {
    if (index < jokers.length - 1) onReorder(index, index + 1);
  };

  return (
    <div className={styles.board}>
      <div className={styles.jokerArea}>
        <div className={styles.areaHeader}>
          <span className={styles.areaTitle}>Comodines</span>
          <span className={styles.areaCount}>{jokers.length}</span>
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
                    onClick={() => moveLeft(index)}
                    disabled={index === 0}
                    aria-label={`Mover ${joker.name} a la izquierda`}
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    className={styles.reorderButton}
                    onClick={() => moveRight(index)}
                    disabled={index === jokers.length - 1}
                    aria-label={`Mover ${joker.name} a la derecha`}
                  >
                    ▶
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Consumibles (Tarot / Planeta): las cartas que tienes, listas  */}
      {/* para usar. Al pulsarlas se activa el uso (con carta objetivo  */}
      {/* si es un tarot de carta, coordinado desde Game.tsx).          */}
      {/* ------------------------------------------------------------ */}
      <div className={styles.consumableArea}>
        <div className={styles.areaHeader}>
          <span className={styles.areaTitle}>Consumibles</span>
          <span className={styles.areaCount}>
            {consumables.length}/{maxConsumableSlots}
          </span>
        </div>

        <div className={styles.consumableSlots}>
          {consumables.map((consumable) => (
            <button
              key={consumable.id}
              type="button"
              className={`${styles.consumableSlot} ${styles.consumableSlotFilled}`}
              onClick={() => onUseConsumable(consumable)}
            >
              <span className={styles.consumableGlyph} aria-hidden="true">
                {consumable.kind === "tarot" ? "🔮" : "🪐"}
              </span>
              <span className={styles.consumableName}>{consumable.name}</span>
            </button>
          ))}

          {Array.from({
            length: Math.max(0, maxConsumableSlots - consumables.length),
          }).map((_, i) => (
            <div key={`empty-${i}`} className={styles.consumableSlot}>
              <span className={styles.consumableGlyph} aria-hidden="true">
                🔮
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JokerBoard;
