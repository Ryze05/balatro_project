import { Palo } from "./PaloLegacy";

export class Card {
    valor: number;
    palo: Palo;
    hidden: boolean;

    constructor(valor: number, palo: Palo) {
        this.valor = Number(valor);
        this.palo = palo;
        this.hidden = true;
    }

    get_card(): typeof Card {
        return Card;
    }

    get_info(): string {
        return `${this.valor} de ${this.palo}`;
    }

    get_score(): number {
        if ([11, 12, 13].includes(this.valor)) {
            return 10;
        }

        if (this.valor === 1) return 11;

        return this.valor;
    }
}
