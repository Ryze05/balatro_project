import { useState, type JSX } from "react";
import "./MainMenu.css";
import type { MenuOption, Palo } from "../../types/Game";

interface MenuItem {
  label: string;
  option: MenuOption;
  palo: Palo;
  hint: string;
}

const PALOS: Palo[] = ["♠", "♥", "♦", "♣"];

const MENU_ITEMS: MenuItem[] = [
  { label: "Jugar", option: "play", palo: "♠", hint: "Start a new game" },
  { label: "Reglas", option: "rules", palo: "♥", hint: "How cards are scored" },
  { label: "Opciones", option: "options", palo: "♦", hint: "Decks, sound, settings" },
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
    <div className="menu-root">
      <div className="stage">
        <div className="fan">
          {PALOS.map((palo, i) => (
            <div key={palo} className={`fan-card c${i}`}>
              <span>{palo}</span>
            </div>
          ))}
        </div>

        <div className="title-block">
          <h1 className="title">BALATRO WEB</h1>
          <p className="subtitle">Para Xarxatec Activa</p>
        </div>

        <nav className="menu-list">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.option}
              className={`menu-item${active === item.option ? " active" : ""}`}
              onClick={() => handleSelect(item.option)}
            >
              <span className="icon">{item.palo}</span>
              {item.label}
              <span className="hint">{item.hint}</span>
            </button>
          ))}
        </nav>

        <footer>
          <div className="suit-row">
            {PALOS.map((palo) => (
              <span key={palo}>{palo}</span>
            ))}
          </div>
          <span className="version">v0.1 — borrador</span>
        </footer>
      </div>
    </div>
  );
}

export default MainMenu;