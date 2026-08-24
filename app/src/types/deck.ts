export type DeckId = "red"|"blue";

export interface DeckDefinition {
    id: DeckId;
    name: string;
    color: string;
    description: string;
}


export const DECKS: DeckDefinition[] = [
    {
        id: "red",
        name: "Red Deck",
        color: "#c1121f",
        description: "+1 discard every round."
    },
    {
        id: "blue",
        name: "Blue Deck",
        color: "#0000FF",
        description: "+1 hands every round."
    }
];