export type DeckId = "red" | "blue" | "yellow";

export interface DeckDefinition {
    id: DeckId;
    name: string;
    color: string;
    description: string;
}


export const DECKS: DeckDefinition[] = [
    { id: "red", name: "Baraja Roja", description: "+1 descarte por ronda.", color: "#c1121f" },
    { id: "blue", name: "Baraja Azul", description: "+1 mano por ronda.", color: "#4c8fd1" },
    { id: "yellow", name: "Baraja Amarilla", description: "Empieza con 10$ extra.", color: "#e3b23c" },
];
