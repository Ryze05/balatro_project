import type { JSX } from "react";
import styles from "./RulesPanel.module.css";
import { getHandValues } from "../../logic/score";
import type { HandType } from "../../types/game";

interface RulesPanelProps {
  onClose: () => void;
}

const HAND_ORDER: HandType[] = [
  "HighCard",
  "Pair",
  "TwoPair",
  "ThreeOfAKind",
  "Straight",
  "Flush",
  "FullHouse",
  "FourOfAKind",
  "StraightFlush",
  "FiveOfAKind",
  "FlushHouse",
  "FlushFive",
];

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

export function RulesPanel({ onClose }: RulesPanelProps): JSX.Element {
  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Reglas del Juego</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar reglas">
            ×
          </button>
        </div>

        <div className={styles.scrollArea}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Objetivo</h3>
            <p className={styles.text}>
              En cada Ante debes superar tres Ciegas (Pequeña, Grande y Jefe) alcanzando la
              puntuación objetivo antes de quedarte sin manos. La Ciega Jefe suele añadir una
              dificultad extra respecto a los otros dos.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Cómo juegar una ronda</h3>
            <p className={styles.text}>
              Cada Ciega te da un número limitado de manos y descartes. Selecciona hasta 5
              cartas de tu mano: puedes jugarlas para que se evalúen como una jugada de póker, o
              descartarlas para cambiarlas por cartas nuevas del mazo, ten en cuenta que no es necesario descartar 5 cartas. Cada jugada suma
              Fichas × Multiplicador a tu puntuación siendo las Fichas el valor de la mano jugada + el valor de la cartas.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Jugadas de Póker</h3>
            <p className={styles.text}>
              Cuanto mejor la jugada, más Fichas base y más Multiplicador aporta antes de sumar
              el valor de las cartas y los efectos de los Comodines.
            </p>
            <div className={styles.handTable}>
              <div className={styles.handRowHeader}>
                <span>Jugada</span>
                <span>Fichas × Mult</span>
              </div>
              {HAND_ORDER.map((hand) => {
                const values = getHandValues(hand);
                return (
                  <div key={hand} className={styles.handRow}>
                    <span className={styles.handName}>{HAND_LABEL[hand]}</span>
                    <span className={styles.handValue}>
                      {values.chips} × {values.multiplier}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Comodines</h3>
            <p className={styles.text}>
              Tras superar cada Ciega visitas la Tienda, donde puedes comprar Comodines. Cada
              Comodín aplica su efecto cada vez que juegas una mano, ganas una ronda o incluso pierdes la ronda: sumar
              fichas, sumar multiplicador o multiplicar el multiplicador ya acumulado.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Ciegas y Antes</h3>
            <p className={styles.text}>
              Las Ciegas Pequeña y Grande se pueden saltar a cambio de una recompensa
              alternativa; La Ciega Jefe nunca se puede saltar. Al superar las tres Ciegas de un
              Ante, avanzas al siguiente Ante y la puntuación objetivo vuelve a subir.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default RulesPanel;
