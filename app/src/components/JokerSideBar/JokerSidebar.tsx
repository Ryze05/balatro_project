import { useState, type JSX } from "react";
import styles from "./JokerSidebar.module.css";
import type { Joker } from "../../types/joker";
import type { Blind, HandType } from "../../types/game";
import type { Card } from "../../types/card";
import type { Voucher } from "../../types/voucher";
import { evaluateHand } from "../../logic/handEvaluator";
import { calculateScore, getFinalScore } from "../../logic/score";
import { VouchersPanel } from "../VouchersPanel/VouchersPanel";

interface JokerSidebarProps {
  money: number;
  jokers: Joker[];
  hand: Card[];
  blind: Blind;
  score: number;
  vouchers: Voucher[];
}

const BLIND_TYPE_LABEL: Record<Blind["type"], string> = {
  small: "Small Blind",
  big: "Big Blind",
  boss: "Boss Blind",
};

//* Mismas etiquetas que ya se usaban en RoundPanel/RulesPanel para la
//* previsualización, ahora vive aquí junto al marcador.
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

export function JokerSidebar({
  money,
  jokers,
  hand,
  blind,
  score,
  vouchers,
}: JokerSidebarProps): JSX.Element {
  const [showVouchers, setShowVouchers] = useState(false);

  //* El panel de puntuación solo se muestra si hay un blind activo
  //* (evita mostrar "None" / 0 mientras se está en menú, tienda, etc.)
  const hasActiveBlind = blind.id !== "none";
  const progress =
    hasActiveBlind && blind.targetScore > 0
      ? Math.min(100, (score / blind.targetScore) * 100)
      : 0;

  //* Previsualización de puntuación: se recalcula en cada render con la
  //* misma lógica que se usa al jugar la mano de verdad (playHand en
  //* useGameState). Antes vivía en RoundPanel, ahora se mueve a la
  //* barra lateral junto al resto del marcador.
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
    <aside className={styles.sidebar}>
      {hasActiveBlind && (
        <div className={`${styles.scorePanel} ${styles[`scorePanel_${blind.type}`]}`}>
          <div className={styles.scorePanelHeader}>
            <span className={styles.scoreBlindType}>{BLIND_TYPE_LABEL[blind.type]}</span>
            <span className={styles.scoreBlindName}>{blind.name}</span>
          </div>

          <div className={styles.scoreMain}>
            <span className={styles.scoreMainLabel}>Puntos</span>
            <span className={styles.scoreMainValue}>{score.toLocaleString()}</span>
          </div>

          <div className={styles.scoreProgressTrack}>
            <div className={styles.scoreProgressFill} style={{ width: `${progress}%` }} />
          </div>

          <div className={styles.scoreTargetRow}>
            <span className={styles.scoreTargetLabel}>Objetivo</span>
            <span className={styles.scoreTargetValue}>{blind.targetScore.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Previsualización de la jugada seleccionada. Solo tiene sentido    */}
      {/* mientras hay una mano en juego; Game.tsx solo pasa `hand` cuando  */}
      {/* status === "playing".                                            */}
      {/* ---------------------------------------------------------------- */}
      {hand.length > 0 && (
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
      )}

      <div className={styles.moneyBlock}>
        <span className={styles.moneyLabel}>Dinero</span>
        <span className={styles.moneyValue}>${money}</span>
      </div>

      <button
        type="button"
        className={styles.vouchersButton}
        onClick={() => setShowVouchers(true)}
      >
        <span>Vouchers</span>
        <span className={styles.vouchersCount}>{vouchers.length}</span>
      </button>

      {showVouchers && (
        <VouchersPanel vouchers={vouchers} onClose={() => setShowVouchers(false)} />
      )}
    </aside>
  );
}

export default JokerSidebar;
