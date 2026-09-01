import type { Card, Rank, Suit } from "../types/card";

const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];

const RANKS: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

export function getCardScore(rank: Rank): number {
  if (["J", "Q", "K"].includes(rank)) return 10;
  if (rank === "A") return 11;
  return parseInt(rank);
}

export function getCardInfo(card: Card): string {
  return `${card.rank} of ${card.suit}`;
}

export function createDeck(numDecks: number = 1): Card[] {
  const cards: Card[] = [];

  for (let i = 0; i < numDecks; i++) {
    SUITS.forEach((suit) => {
      RANKS.forEach((rank) => {
        const chipValue = getCardScore(rank);
        cards.push({
          id: `${i}-${suit}-${rank}-${Math.random()}`,
          rank,
          suit,
          chipValue,
        });
      });
    });
  }

  return shuffleCards(cards);
}

export function shuffleCards(cards: Card[]): Card[] {
  const newDeck = [...cards];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

export function drawCard(deck: Card[]): { drawnCard: Card | undefined; remainingDeck: Card[] } {
  if (deck.length === 0) return { drawnCard: undefined, remainingDeck: [] };

  const [drawnCard, ...remainingDeck] = deck;
  return { drawnCard, remainingDeck };
}