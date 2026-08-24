import type { JSX } from "react";
import styles from "./BlindSelect.module.css";
import type { Blind } from "../../types/game";

interface BlindSelectProps {
  ante: number;
  blinds: Blind[];
  blindIndex: number;
  onPlay: (blind: Blind) => void;
  onSkip: (blind: Blind) => void;
}

const TYPE_LABEL: Record<Blind["type"], string> = {
  small: "Small Blind",
  big: "Big Blind",
  boss: "Boss Blind",
};

export function BlindSelect({ ante, blinds, blindIndex, onPlay, onSkip }: BlindSelectProps): JSX.Element {
  const currentBlind = blinds[blindIndex];

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.anteLabel}>Ante {ante}</span>
      </div>

      <div className={styles.row}>
        {blinds.map((blind, i) => {
          const state = i < blindIndex ? "done" : i === blindIndex ? "current" : "upcoming";
          return (
            <div
              key={blind.id}
              className={`${styles.blindCard} ${styles[`blindCard_${blind.type}`]} ${styles[`state_${state}`]}`}
            >
              <span className={styles.blindType}>{TYPE_LABEL[blind.type]}</span>
              <span className={styles.blindName}>{blind.name}</span>
              <span className={styles.targetLabel}>Target</span>
              <span className={styles.targetScore}>{blind.targetScore.toLocaleString()}</span>
              {state === "done" && <span className={styles.badge}>Cleared</span>}
              {state === "upcoming" && <span className={styles.badge}>Locked</span>}
            </div>
          );
        })}
      </div>

      {currentBlind && (
        <div className={styles.actions}>
          <div className={styles.buttonRow}>
            <button
              type="button"
              className={styles.skipButton}
              onClick={() => onSkip(currentBlind)}
              disabled={!currentBlind.skippable}
              title={currentBlind.skippable ? "Skip this blind" : "Boss blinds cannot be skipped"}
            >
              Skip
            </button>
            <button type="button" className={styles.playButton} onClick={() => onPlay(currentBlind)}>
              Select Blind
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlindSelect;
