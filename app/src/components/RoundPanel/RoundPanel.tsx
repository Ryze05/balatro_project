import type { JSX } from "react";
import styles from "./RoundPanel.module.css";
import type { Blind } from "../../types/game";
import type { Card, Suit } from "../../types/card";

interface RoundPanelProps {
  blind: Blind;
  level: number;
  hand: Card[];
  handsLeft: number;
  discardsLeft: number;
  score: number;
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
  blind,
  level,
  hand,
  handsLeft,
  discardsLeft,
  score,
  onToggleCard,
  onPlayHand,
  onDiscard,
}: RoundPanelProps): JSX.Element {
  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <div className={styles.blindInfo}>
          <span className={styles.levelLabel}>Level {level}</span>
          <span className={styles.blindName}>{blind.name}</span>
        </div>

        <div className={styles.scoreBlock}>
          <span className={styles.scoreText}>
            {score.toLocaleString()} / {blind.targetScore.toLocaleString()}
          </span>
        </div>

        <div className={styles.counters}>
          <span className={styles.counter}>Hands: {handsLeft}</span>
          <span className={styles.counter}>Discards: {discardsLeft}</span>
        </div>
      </div>

      <div className={styles.handArea}>
        {hand.map((card) => {
          const isSelected = card.selected === true;
          const isRed = RED_SUITS.includes(card.suit);
          return (
            <button
              key={card.id}
              type="button"
              className={`${styles.card} ${isSelected ? styles.cardSelected : ""} ${isRed ? styles.cardRed : styles.cardBlack}`}
              onClick={() => onToggleCard(card.id)}
            >
              <span className={styles.cardRank}>{card.rank}</span>
              <span className={styles.cardSuit}>{SUIT_SYMBOLS[card.suit]}</span>
            </button>
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