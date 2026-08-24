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
          const isSelected = selected.has(i);
          const isRed = label.includes("♥") || label.includes("♦");
          return (
            <button
              key={i}
              type="button"
              className={`${styles.card} ${isSelected ? styles.cardSelected : ""} ${isRed ? styles.cardRed : styles.cardBlack}`}
              onClick={() => toggleCard(i)}
            >
              {label}
            </button>
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
