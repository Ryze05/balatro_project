import type { JSX } from "react";
import styles from "./PackModal.module.css";
import type { Consumable } from "../../types/consumable";

interface PackModalProps {
  packName: string;
  cards: Consumable[];
  canTake: boolean;
  onPick: (card: Consumable) => void;
  onClose: () => void;
}

export function PackModal({
  packName,
  cards,
  canTake,
  onPick,
  onClose,
}: PackModalProps): JSX.Element {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{packName}</h3>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.grid}>
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              className={styles.card}
              onClick={() => onPick(card)}
              disabled={!canTake}
            >
              <span
                className={styles.kind}
                style={{ color: card.kind === "tarot" ? "#c1121f" : "#4c8fd1" }}
              >
                {card.kind === "tarot" ? "Tarot" : "Planeta"}
              </span>
              <span className={styles.cardName}>{card.name}</span>
              <span className={styles.cardDescription}>{card.description}</span>
            </button>
          ))}
        </div>

        {!canTake && (
          <p className={styles.warning}>
            Inventario de consumibles lleno. No puedes coger más cartas.
          </p>
        )}

        <button type="button" className={styles.skipButton} onClick={onClose}>
          No coger nada
        </button>
      </div>
    </div>
  );
}

export default PackModal;