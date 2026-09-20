import type { JSX } from "react";
import styles from "./RoundPanel.module.css";
import type { Card, Suit } from "../../types/card";
import type { Consumable } from "../../types/consumable";
import type { Blind, HandType } from "../../types/game";
import { evaluateHand } from "../../logic/handEvaluator";
import { checkPlayAllowed, isCardDebuffed } from "../../logic/blinds";

interface RoundPanelProps {
  blind: Blind;
  hand: Card[];
  playedHandTypes: HandType[];
  handsLeft: number;
  discardsLeft: number;
  targetConsumable: Consumable | null;
  onToggleCard: (cardId: string) => void;
  onPlayHand: () => void;
  onDiscard: () => void;
  onTargetCard: (cardId: string) => void;
  onCancelTarget: () => void;
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
  hand,
  playedHandTypes,
  handsLeft,
  discardsLeft,
  targetConsumable,
  onToggleCard,
  onPlayHand,
  onDiscard,
  onTargetCard,
  onCancelTarget,
}: RoundPanelProps): JSX.Element {
  const selectedCards = hand.filter((card) => card.selected === true);
  const hasValidSelection = selectedCards.length >= 1 && selectedCards.length <= 5;

  let restriction: { allowed: boolean; reason?: string } = { allowed: true };
  if (hasValidSelection) {
    const { handType } = evaluateHand(selectedCards);
    restriction = checkPlayAllowed(handType, playedHandTypes, blind);
  }

  const canPlay = hasValidSelection && restriction.allowed && handsLeft > 0;

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <div className={styles.counters}>
          <span className={styles.counter}>Manos: {handsLeft}</span>
          <span className={styles.counter}>Descartes: {discardsLeft}</span>
        </div>
      </div>

      {/* Aviso cuando hay un consumible esperando carta objetivo */}
      {targetConsumable && (
        <div className={styles.consumableBar}>
          <span className={styles.targetHint}>
            Elige una carta para {targetConsumable.name}
            <button
              type="button"
              className={styles.cancelTarget}
              onClick={onCancelTarget}
            >
              Cancelar
            </button>
          </span>
        </div>
      )}

      {hasValidSelection && restriction.reason && (
        <span className={styles.restrictionWarning}>{restriction.reason}</span>
      )}

      <div className={styles.handArea}>
        {hand.map((card, index) => {
          const isSelected = card.selected === true;
          const isRed = RED_SUITS.includes(card.suit);
          const isDebuffed = isCardDebuffed(card, blind);
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
                className={`${styles.card} ${isSelected ? styles.cardSelected : ""} ${
                  isDebuffed ? styles.cardDebuffed : ""
                }`}
                onClick={() => (targetConsumable ? onTargetCard(card.id) : onToggleCard(card.id))}
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
          Descartar
        </button>
        <button
          type="button"
          className={styles.playButton}
          onClick={onPlayHand}
          disabled={!canPlay}
        >
          Jugar mano
        </button>
      </div>
    </div>
  );
}

export default RoundPanel;
