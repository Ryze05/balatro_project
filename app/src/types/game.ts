export type { Suit, Rank, Card } from "./card";
export type { Joker, ScoringContext, HandType } from "./joker";

export type GamePhase = "menu" | "playing" | "rules" | "shop" | "gameover";

export interface Blind {
  id: string;
  name: string;
  targetScore: number;
  reward: number;
}

export interface GameState {
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  jokers: Joker[];
  currentBlind: Blind;
  round: number;
  handsLeft: number;
  discardsLeft: number;
  money: number;
  score: number;
  status: GamePhase;
}

export type MenuOption = "play" | "rules" | "options";

import type { Card } from "./card";
import type { Joker } from "./joker";
