export type Suit = "hearts" | "diamonds" | "clubs" | "spades";

export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  chipValue: number;
  enhanced?: boolean;
  selected?: boolean;
}
