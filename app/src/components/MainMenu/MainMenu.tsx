import { useState, type JSX } from "react";
import styles from "./MainMenu.module.css";
import type { MenuOption, Suit } from "../../types/Game";

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
  { label: "Options", option: "options", suit: "diamonds", hint: "Decks, sound, settings" },
];

interface MainMenuProps {
  onSelect?: (option: MenuOption) => void;
}

export function MainMenu({ onSelect }: MainMenuProps): JSX.Element {
  const [active, setActive] = useState<MenuOption | null>(null);

  const handleSelect = (option: MenuOption): void => {
    setActive(option);
    onSelect?.(option);
  };

  return (
    <div className={styles.menuRoot}>
      <div className={styles.stage}>
        <div className={styles.fan}>
          {SUITS.map((suit, i) => (
            <div key={suit} className={`${styles.fanCard} ${styles[`fanCardC${i}`]}`}>
              <span>{SUIT_SYMBOLS[suit]}</span>
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
    </div>
  );
}

export default MainMenu;