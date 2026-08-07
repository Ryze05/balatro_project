import { useState, type JSX } from "react";
import { Palo } from "./models/Palo";
import "./MainMenu.css";

export type MenuOption = "jugar" | "reglas" | "opciones";

interface MenuItem {
    label: string;
    option: MenuOption;
    palo: Palo;
    hint: string;
}

const PALOS: Palo[] = Object.values(Palo);

const MENU_ITEMS: MenuItem[] = [
    { label: "Jugar", option: "jugar", palo: Palo.PICAS, hint: "Empezar una partida nueva" },
    { label: "Reglas", option: "reglas", palo: Palo.CORAZON, hint: "Cómo se puntúan las cartas" },
    { label: "Opciones", option: "opciones", palo: Palo.DIAMANTES, hint: "Barajas, sonido, ajustes" },
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
