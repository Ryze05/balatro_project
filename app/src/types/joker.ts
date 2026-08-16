import type { Card } from "./card";

export interface Joker {
  id: string;
  name: string;
  description: string;
  price: number;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  effect: {
    type: string;
    value: number;
  };
}

export interface ScoringContext {
  chips: number;
  multiplier: number;
  handType: HandType;
  playedCards: Card[];
}

export type HandType =
  | "HighCard"
  | "Pair"
  | "TwoPair"
  | "ThreeOfAKind"
  | "Straight"
  | "Flush"
  | "FullHouse"
  | "FourOfAKind"
  | "StraightFlush";
