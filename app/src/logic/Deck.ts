import type { Card, Palo } from "../types/Game";

const PALOS: Palo[] = ["♥", "♠", "♣", "♦"];

// Devuelve el valor numérico/puntuación de una carta
export function getCardScore(card: Card): number {
  if ([11, 12, 13].includes(card.valor)) return 10;
  if (card.valor === 1) return 11;
  return card.valor;
}

// Devuelve la información textual de la carta
export function getCardInfo(card: Card): string {
  return `${card.valor} de ${card.palo}`;
}

// Genera un mazo nuevo de cartas (barajado por defecto)
export function createDeck(numDecks: number = 1): Card[] {
  const cards: Card[] = [];

  for (let d = 0; d < numDecks; d++) {
    PALOS.forEach((palo) => {
      for (let i = 1; i <= 13; i++) {
        cards.push({
          id: `${d}-${palo}-${i}-${Math.random()}`,
          valor: i,
          palo: palo,
          hidden: true,
        });
      }
    });
  }

  return shuffleCards(cards);
}

// Mezcla las cartas de forma inmutable (devuelve un array nuevo)
export function shuffleCards(cards: Card[]): Card[] {
  const newDeck = [...cards];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

// Extrae una carta del mazo de forma inmutable
export function drawCard(deck: Card[]): { drawnCard: Card | undefined; remainingDeck: Card[] } {
  if (deck.length === 0) return { drawnCard: undefined, remainingDeck: [] };

  const [drawnCard, ...remainingDeck] = deck;
  return { drawnCard, remainingDeck };
}