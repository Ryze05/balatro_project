import { Card } from "./CardLegacy";
import { Palo } from "./PaloLegacy";

export class Deck {

    cards: Card[];
    numDecks: number;

    // numDecks: cuántas barajas de 52 cartas se combinan en el zapato (shoe).
    // Los casinos suelen usar 1, 2, 4, 6 u 8 barajas mezcladas juntas.
    constructor(numDecks: number = 1) {

        this.cards = [];
        this.numDecks = numDecks;

        for (let d = 0; d < numDecks; d++) {
            Object.values(Palo).forEach((palo) => {
                for (let i = 1; i <= 13; i++) {
                    this.cards.push(new Card(i, palo));
                }
            });
        }

        this.suffle_cards();
    }

    // Metodo que bajara las cartas del mazo al llamarlo
    suffle_cards(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    // Extrae la primera carta de la baraja
    get_card(): Card | undefined {

        console.log("you draw " + this.cards[0].get_info());

        return this.cards.shift();
    }
}
