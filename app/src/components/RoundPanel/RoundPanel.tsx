import type { JSX } from "react";
import styles from "./RoundPanel.module.css";
import type { Card, Suit } from "../../types/card";

interface RoundPanelProps {
  hand: Card[];
  handsLeft: number;
  discardsLeft: number;
  onToggleCard: (cardId: string) => void;
  onPlayHand: () => void;
  onDiscard: () => void;
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const RED_SUITS: Suit[] = ["hearts", "diamonds"];

export function RoundPanel({
  hand,
  handsLeft,
  discardsLeft,
  onToggleCard,
  onPlayHand,
  onDiscard,
}: RoundPanelProps): JSX.Element {
  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <div className={styles.counters}>
          <span className={styles.counter}>Hands: {handsLeft}</span>
          <span className={styles.counter}>Discards: {discardsLeft}</span>
        </div>
      </div>

      <div className={styles.handArea}>
        {hand.map((card, index) => {
          const isSelected = card.selected === true;
          const isRed = RED_SUITS.includes(card.suit);
          const offset = index - (hand.length - 1) / 2;
          const rotation = offset * 3.2;
          const arcLift = Math.abs(offset) * 5;

          return (
            <div
              key={card.id}
              className={styles.cardSlot}
              style={{ transform: `rotate(${rotation}deg) translateY(${arcLift}px)` }}
            >
              <button
                type="button"
                className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
                onClick={() => onToggleCard(card.id)}
                aria-label={`${card.rank} of ${card.suit}`}
              >
                <span
                  className={`${styles.cardCorner} ${styles.cardCornerTL} ${isRed ? styles.cardRed : styles.cardBlack}`}
                >
                  <span className={styles.cardRank}>{card.rank}</span>
                  <span className={styles.cardCornerSuit}>{SUIT_SYMBOLS[card.suit]}</span>
                </span>

                <span
                  className={`${styles.cardCenterSuit} ${isRed ? styles.cardRed : styles.cardBlack}`}
                >
                  {SUIT_SYMBOLS[card.suit]}
                </span>

                <span
                  className={`${styles.cardCorner} ${styles.cardCornerBR} ${isRed ? styles.cardRed : styles.cardBlack}`}
                >
                  <span className={styles.cardRank}>{card.rank}</span>
                  <span className={styles.cardCornerSuit}>{SUIT_SYMBOLS[card.suit]}</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.discardButton}
          onClick={onDiscard}
          disabled={discardsLeft <= 0}
        >
          Discard
        </button>
        <button
          type="button"
          className={styles.playButton}
          onClick={onPlayHand}
          disabled={handsLeft <= 0}
        >
          Play Hand
        </button>
      </div>
    </div>
  );
}

export default RoundPanel;
