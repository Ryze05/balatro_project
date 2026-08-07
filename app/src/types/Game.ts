export type Suit = "hearts" | "diamonds" | "clubs" | "spades";

export type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

export interface Card {
  id: string;
  rank: Rank;
  suit: Suit;
  hidden: boolean;
}

export type GamePhase = 'menu' | 'playing' | 'shop' | 'gameover';

export type MenuOption = "play" | "rules" | "options";