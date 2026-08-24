import { useState, type JSX } from "react";
import styles from "./DeckSelectPanel.module.css";
import { DECKS } from "../../types/deck";
import type { DeckDefinition } from "../../types/deck";

interface DeckSelectPanelProps {
    onConfirm: (deck: DeckDefinition) => void;
    onCancel: () => void;
}

export function DeckSelectPanel({ onConfirm, onCancel }: DeckSelectPanelProps): JSX.Element {
    const [index, setIndex] = useState(0);
    const deck = DECKS[index];
    const hasMultiple = DECKS.length > 1;

    const goPrev = (): void => setIndex((i) => (i - 1 + DECKS.length) % DECKS.length);
    const goNext = (): void => setIndex((i) => (i + 1) % DECKS.length);

    return (
        <div className={styles.overlay}>
            <div className={styles.panel}>
                <h2 className={styles.title}>Choose your deck</h2>

                <div className={styles.selector}>
                    <button
                        type="button"
                        className={styles.arrow}
                        onClick={goPrev}
                        disabled={!hasMultiple}
                        aria-label="Previous deck"
                    >
                        ‹
                    </button>

                    <div className={styles.deckCard} style={{ borderColor: deck.color }}>
                        <div className={styles.deckBack} style={{ background: deck.color }}>
                            <span className={styles.deckBackGlyph}>🂠</span>
                        </div>
                        <h3 className={styles.deckName} style={{ color: deck.color }}>
                            {deck.name}
                        </h3>
                        <p className={styles.deckDescription}>{deck.description}</p>
                    </div>

                    <button
                        type="button"
                        className={styles.arrow}
                        onClick={goNext}
                        disabled={!hasMultiple}
                        aria-label="Next deck"
                    >
                        ›
                    </button>
                </div>

                <div className={styles.dots}>
                    {DECKS.map((d, i) => (
                        <span
                            key={d.id}
                            className={`${styles.dot}${i === index ? ` ${styles.dotActive}` : ""}`}
                        />
                    ))}
                </div>

                <div className={styles.actions}>
                    <button type="button" className={styles.cancelButton} onClick={onCancel}>
                        Back
                    </button>
                    <button type="button" className={styles.confirmButton} onClick={() => onConfirm(deck)}>
                        Play
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeckSelectPanel;