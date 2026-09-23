import { useState, type DragEvent, type JSX } from "react";
import styles from "./JokerBoard.module.css";
import type { Joker } from "../../types/joker";
import type { Consumable } from "../../types/consumable";
import { getConsumableTargetKind } from "../../logic/consumables";

interface JokerBoardProps {
  jokers: Joker[];
  consumables: Consumable[];
  maxConsumableSlots: number;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onUseConsumable: (consumable: Consumable) => void;
  //* Modo "elige un comodín" activado por Ectoplasm (destruir) o Ankh
  //* (duplicar). Mientras está activo se desactiva el drag&drop.
  targetJokerMode?: boolean;
  onTargetJoker?: (index: number) => void;
  //* FIX: antes no existía esta comprobación y el botón de un consumible
  //* siempre estaba "activo" aunque no hubiera nada que elegir como
  //* objetivo (mano no visible / sin comodines), dejando el flujo colgado.
  //* Ahora Game.tsx decide si se puede usar y aquí solo se refleja.
  canUseConsumable?: (consumable: Consumable) => boolean;
}

const RARITY_LABEL: Record<Joker["rarity"], string> = {
  common: "Común",
  uncommon: "Poco común",
  rare: "Raro",
  legendary: "Legendario",
};

const CONSUMABLE_KIND_LABEL: Record<Consumable["kind"], string> = {
  tarot: "Tarot",
  planet: "Planeta",
  spectral: "Espectral",
};

function getConsumableImage(kind: Consumable["kind"]): string {
  if (kind === "tarot") return "/tarot.png";
  if (kind === "planet") return "/planeta.png";
  return "/espectral.png";
}

function getConsumableStyle(kind: Consumable["kind"]): string {
  if (kind === "tarot") return styles.consumableTarot;
  if (kind === "planet") return styles.consumablePlanet;
  return styles.consumableSpectral;
}

function getBlockedReason(consumable: Consumable): string {
  const kind = getConsumableTargetKind(consumable);
  if (kind === "card") return "Juega una ronda para poder elegir una carta";
  if (kind === "joker") return "Necesitas al menos un comodín para usar esta carta";
  return "";
}

export function JokerBoard({
  jokers,
  consumables,
  maxConsumableSlots,
  onReorder,
  onUseConsumable,
  targetJokerMode = false,
  onTargetJoker,
  canUseConsumable,
}: JokerBoardProps): JSX.Element {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => (e: DragEvent<HTMLLIElement>) => {
    if (targetJokerMode) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (index: number) => (e: DragEvent<HTMLLIElement>) => {
    if (targetJokerMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (index !== overIndex) setOverIndex(index);
  };

  const handleDrop = (index: number) => (e: DragEvent<HTMLLIElement>) => {
    if (targetJokerMode) return;
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

  const handleJokerClick = (index: number): void => {
    if (targetJokerMode) {
      onTargetJoker?.(index);
    }
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
                key={`${joker.id}-${index}`}
                className={`${styles.jokerItem} ${styles[`rarity_${joker.rarity}`]} ${
                  draggedIndex === index ? styles.dragging : ""
                } ${
                  overIndex === index && draggedIndex !== null && draggedIndex !== index
                    ? styles.dragOver
                    : ""
                } ${targetJokerMode ? styles.jokerItemTargetable : ""}`}
                draggable={!targetJokerMode}
                onDragStart={handleDragStart(index)}
                onDragOver={handleDragOver(index)}
                onDrop={handleDrop(index)}
                onDragEnd={handleDragEnd}
                onClick={() => handleJokerClick(index)}
              >
                <div className={styles.jokerArtwork}>
                  <span className={styles.jokerLabelTop} aria-hidden="true">
                    {"JOKER".split("").map((letter, letterIndex) => (
                      <span key={letterIndex}>{letter}</span>
                    ))}
                  </span>
                  <img src="/caraJoker.png" alt="" className={styles.jokerImage} />
                  <span className={styles.jokerLabelBottom} aria-hidden="true">
                    {"JOKER".split("").map((letter, letterIndex) => (
                      <span key={letterIndex}>{letter}</span>
                    ))}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <span className={styles.jokerName}>{joker.name}</span>
                  <span className={styles.jokerRarity}>{RARITY_LABEL[joker.rarity]}</span>
                  <p className={styles.jokerDescription}>{joker.description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.consumableArea}>
        <div className={styles.areaHeader}>
          <span className={styles.areaTitle}>Consumibles</span>
          <span className={styles.areaCount}>
            {consumables.length}/{maxConsumableSlots}
          </span>
        </div>

        <div className={styles.consumableSlots}>
          {consumables.map((consumable, index) => {
            const usable = canUseConsumable ? canUseConsumable(consumable) : true;
            return (
              <button
                key={`${consumable.id}-${index}`}
                type="button"
                className={`${styles.consumableSlot} ${styles.consumableSlotFilled} ${getConsumableStyle(consumable.kind)} ${!usable ? styles.consumableBlocked : ""}`}
                onClick={() => onUseConsumable(consumable)}
                disabled={!usable}
                title={usable ? CONSUMABLE_KIND_LABEL[consumable.kind] : getBlockedReason(consumable)}
              >
                <img
                  src={getConsumableImage(consumable.kind)}
                  alt=""
                  className={styles.consumableImage}
                />
                <span className={styles.consumableName}>{consumable.name}</span>
                <span className={styles.consumableDescription}>
                  {consumable.description}
                </span>
              </button>
            );
          })}

          {Array.from({
            length: Math.max(0, maxConsumableSlots - consumables.length),
          }).map((_, i) => (
            <div key={`empty-${i}`} className={styles.consumableSlot}>
              <span className={styles.consumableGlyph} aria-hidden="true">
                ·
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JokerBoard;
