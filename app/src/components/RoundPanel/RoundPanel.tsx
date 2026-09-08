import type { JSX } from "react";
import styles from "./RoundPanel.module.css";
import type { Blind } from "../../types/game";
import type { HandType } from "../../types/game";
import type { Card, Suit } from "../../types/card";
import type { Joker } from "../../types/joker";
import { evaluateHand } from "../../logic/handEvaluator";
import { calculateScore, getFinalScore } from "../../logic/score";

interface RoundPanelProps {
  blind: Blind;
  level: number;
  hand: Card[];
  jokers: Joker[];
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

//* Nombres en español de cada jugada, igual que en RulesPanel.
const HAND_LABEL: Record<HandType, string> = {
  HighCard: "Carta Alta",
  Pair: "Pareja",
  TwoPair: "Doble Pareja",
  ThreeOfAKind: "Trío",
  Straight: "Escalera",
  Flush: "Color",
  FullHouse: "Full House",
  FourOfAKind: "Póker",
  StraightFlush: "Escalera de Color",
  FiveOfAKind: "Cinco Iguales",
  FlushHouse: "Full de Color",
  FlushFive: "Cinco de Color",
};

export function RoundPanel({
  blind,
  level,
  hand,
  jokers,
  handsLeft,
  discardsLeft,
  onToggleCard,
  onPlayHand,
  onDiscard,
}: RoundPanelProps): JSX.Element {
  //* Previsualización de puntuación: se recalcula en cada render con
  //* la misma lógica que se usa al jugar la mano de verdad (playHand
  //* en useGameState), así que ya incluye el efecto de los comodines.
  const selectedCards = hand.filter((card) => card.selected === true);
  const hasValidSelection = selectedCards.length >= 1 && selectedCards.length <= 5;

  let preview: { handType: HandType; chips: number; multiplier: number; total: number } | null = null;
  if (hasValidSelection) {
    const { handType, scoringCards } = evaluateHand(selectedCards);
    const scoreContext = calculateScore(handType, scoringCards, jokers);
    preview = {
      handType,
      chips: scoreContext.chips,
      multiplier: scoreContext.multiplier,
      total: getFinalScore(scoreContext),
    };
  }

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <div className={styles.blindInfo}>
          <span className={styles.levelLabel}>Level {level}</span>
          <span className={styles.blindName}>{blind.name}</span>
        </div>

        <div className={styles.counters}>
          <span className={styles.counter}>Hands: {handsLeft}</span>
          <span className={styles.counter}>Discards: {discardsLeft}</span>
        </div>
      </div>

      <div className={styles.previewBlock}>
        {selectedCards.length === 0 && (
          <span className={styles.previewHint}>Selecciona cartas para ver tu jugada</span>
        )}

        {selectedCards.length > 5 && (
          <span className={styles.previewWarning}>Máximo 5 cartas seleccionadas</span>
        )}

        {preview && (
          <>
            <span className={styles.previewHandType}>{HAND_LABEL[preview.handType]}</span>
            <span className={styles.previewFormula}>
              <span className={styles.previewChips}>{preview.chips}</span>
              {" × "}
              <span className={styles.previewMultiplier}>{preview.multiplier}</span>
              {" = "}
              <span className={styles.previewTotal}>{preview.total.toLocaleString()}</span>
            </span>
          </>
        )}
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
