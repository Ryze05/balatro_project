import { useState, type JSX } from "react";
import styles from "./RoundPanel.module.css";
import type { Blind } from "../../types/game";

interface RoundPanelProps {
  blind: Blind;
  ante: number;
  onWin: () => void;
  onLose: () => void;
}

const HANDS_PLACEHOLDER = 4;
const DISCARDS_PLACEHOLDER = 3;

// Placeholder hand just to give the panel something to lay out.
// Real cards will come from the deck once the round logic is wired in.
const PLACEHOLDER_HAND = ["A♠", "K♥", "10♦", "7♣", "7♠", "4♥", "3♦", "2♣"];

// Splits a placeholder label like "10♦" into its rank + suit parts.
function parseCard(label: string): { rank: string; suit: string } {
  const suit = label.slice(-1);
  const rank = label.slice(0, -1);
  return { rank, suit };
}

const RED_SUITS = new Set(["♥", "♦"]);

export function RoundPanel({ blind, ante, onWin, onLose }: RoundPanelProps): JSX.Element {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [handsLeft, setHandsLeft] = useState(HANDS_PLACEHOLDER);
  const [discardsLeft, setDiscardsLeft] = useState(DISCARDS_PLACEHOLDER);

  const toggleCard = (i: number): void => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else if (next.size < 5) next.add(i);
      return next;
    });
  };

  // TODO: replace with real hand evaluation + scoring against blind.targetScore
  const handlePlay = (): void => {
    if (handsLeft <= 0) return;
    const nextHandsLeft = handsLeft - 1;
    setHandsLeft(nextHandsLeft);
    setSelected(new Set());

    if (nextHandsLeft <= 0) {
      onLose();
    }
  };

  const handleDiscard = (): void => {
    if (discardsLeft <= 0) return;
    setDiscardsLeft((d) => d - 1);
    setSelected(new Set());
  };

  const cardCount = PLACEHOLDER_HAND.length;
  const mid = (cardCount - 1) / 2;

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <div className={styles.blindInfo}>
          <span className={styles.anteLabel}>Ante {ante}</span>
          <span className={styles.blindName}>{blind.name}</span>
        </div>

        <div className={styles.scoreBlock}>
          <span className={styles.scoreText}>0 / {blind.targetScore.toLocaleString()}</span>
        </div>

        <div className={styles.counters}>
          <span className={styles.counter}>Hands: {handsLeft}</span>
          <span className={styles.counter}>Discards: {discardsLeft}</span>
        </div>
      </div>

      <div className={styles.handArea}>
        {PLACEHOLDER_HAND.map((label, i) => {
          const { rank, suit } = parseCard(label);
          const isSelected = selected.has(i);
          const isRed = RED_SUITS.has(suit);

          // Subtle fan effect: cards rotate away from the center and
          // arc slightly upward, like a hand of cards laid on a table.
          const offset = i - mid;
          const rotation = offset * 3.2;
          const arcLift = Math.abs(offset) * 5;

          return (
            <div
              key={i}
              className={styles.cardSlot}
              style={{ transform: `rotate(${rotation}deg) translateY(${arcLift}px)` }}
            >
              <button
                type="button"
                className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}
                onClick={() => toggleCard(i)}
              >
                <span className={`${styles.cardCorner} ${styles.cardCornerTL} ${isRed ? styles.cardRed : styles.cardBlack}`}>
                  <span className={styles.cardRank}>{rank}</span>
                  <span className={styles.cardCornerSuit}>{suit}</span>
                </span>

                <span className={`${styles.cardCenterSuit} ${isRed ? styles.cardRed : styles.cardBlack}`}>
                  {suit}
                </span>

                <span className={`${styles.cardCorner} ${styles.cardCornerBR} ${isRed ? styles.cardRed : styles.cardBlack}`}>
                  <span className={styles.cardRank}>{rank}</span>
                  <span className={styles.cardCornerSuit}>{suit}</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.discardButton} onClick={handleDiscard} disabled={discardsLeft <= 0}>
          Discard
        </button>
        <button type="button" className={styles.playButton} onClick={handlePlay} disabled={handsLeft <= 0}>
          Play Hand
        </button>
      </div>

      {/* Dev-only nav shortcut until real win condition exists */}
      <button type="button" className={styles.devWinButton} onClick={onWin}>
        (dev) Clear Blind → Shop
      </button>
    </div>
  );
}

export default RoundPanel;
