import { useState, type JSX } from "react";
import styles from "./MainMenu.module.css";
import type { MenuOption } from "../../types/game";
import type { Suit } from "../../types/card"
import type { DeckDefinition } from "../../types/deck";
import type { Joker } from "../../types/joker";
import { DeckSelectPanel } from "../DeckSelectPanel/DeckSelectPanel"
import { RulesPanel } from "../RulesPanel/RulesPanel"
import { getShopJokers } from "../../logic/joker";

interface MenuItem {
  label: string;
  option: MenuOption;
  suit: Suit;
  hint: string;
}

const SUITS: Suit[] = ["spades", "hearts", "diamonds", "clubs"];

const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};

const MENU_ITEMS: MenuItem[] = [
  { label: "Play", option: "play", suit: "spades", hint: "Start a new game" },
  { label: "Rules", option: "rules", suit: "hearts", hint: "How cards are scored" },
];

const FAN_CARD_COUNT = 4;

interface MainMenuProps {
  onSelect?: (option: MenuOption, deckId?: DeckId) => void;
}

export function MainMenu({ onSelect }: MainMenuProps): JSX.Element {
  const [active, setActive] = useState<MenuOption | null>(null);
  const [showDeckPanel, setShowDeckPanel] = useState(false);
  const [showRulesPanel, setShowRulesPanel] = useState(false);
  // Se eligen una sola vez al montar el menú, no en cada render.
  const [fanJokers] = useState<Joker[]>(() => getShopJokers(FAN_CARD_COUNT));

  const handleSelect = (option: MenuOption): void => {
    setActive(option);

    if (option === "play") {
      setShowDeckPanel(true);
      return;
    }

    if (option === "rules") {
      setShowRulesPanel(true);
      return;
    }

    onSelect?.(option);
  };

  const handleDeckConfirm = (deck: DeckDefinition): void => {
    setShowDeckPanel(false);
    onSelect?.("play", deck.id);
  };

  const handleDeckCancel = (): void => {
    setShowDeckPanel(false);
    setActive(null);
  };

  const handleRulesClose = (): void => {
    setShowRulesPanel(false);
    setActive(null);
  };

  return (
    <div className={styles.menuRoot}>
      <div className={styles.stage}>
        <div className={styles.fan}>
          {fanJokers.map((joker, i) => (
            <div key={joker.id} className={`${styles.fanCard} ${styles[`fanCardC${i}`]}`}>
              <span>{joker.name}</span>
            </div>
          ))}
        </div>

        <div className={styles.titleBlock}>
          <h1 className={styles.title}>BALATRO WEB</h1>
          <p className={styles.subtitle}>Para Xarxatec Activa</p>
        </div>

        <nav className={styles.menuList}>
          {MENU_ITEMS.map((item) => (
            <button
              key={item.option}
              className={`${styles.menuItem}${active === item.option ? ` ${styles.menuItemActive}` : ""}`}
              onClick={() => handleSelect(item.option)}
            >
              <span className={styles.icon}>{SUIT_SYMBOLS[item.suit]}</span>
              {item.label}
              <span className={styles.hint}>{item.hint}</span>
            </button>
          ))}
        </nav>

        <footer className={styles.footer}>
          <div className={styles.suitRow}>
            {SUITS.map((suit) => (
              <span key={suit}>{SUIT_SYMBOLS[suit]}</span>
            ))}
          </div>
          <span className={styles.version}>v0.1 — draft</span>
        </footer>
      </div>

      {showDeckPanel && (
        <DeckSelectPanel onConfirm={handleDeckConfirm} onCancel={handleDeckCancel} />
      )}

      {showRulesPanel && <RulesPanel onClose={handleRulesClose} />}
    </div>
  );
}

export default MainMenu;