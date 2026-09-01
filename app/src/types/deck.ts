export type DeckId = "red" | "blue" | "yellow";

export interface DeckDefinition {
    id: DeckId;
    name: string;
    color: string;
    description: string;
}


export const DECKS: DeckDefinition[] = [
    { id: "red", name: "Red Deck", description: "+1 discard every round.", color: "#c1121f" },
    { id: "blue", name: "Blue Deck", description: "+1 hand every round.", color: "#4c8fd1" },
    { id: "yellow", name: "Yellow Deck", description: "Start with $10 extra.", color: "#e3b23c" },
];