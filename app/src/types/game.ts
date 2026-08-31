import type { Card } from "./card";
import type { Joker } from "./joker";

export type GamePhase = "menu" | "blindSelect" | "playing" | "rules" | "shop" | "gameover";

export type BlindType = "small" | "big" | "boss";

export interface Blind {
  id: string;
  name: string;
  type: BlindType;
  targetScore: number;
  reward: number;
  skippable: boolean;
  skipTag?: string;
  description?: string;
}

export interface GameState {
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  jokers: Joker[];
  level: number;
  blinds: Blind[];
  blindIndex: number;
  currentBlind: Blind;
  round: number;
  handsLeft: number;
  discardsLeft: number;
  money: number;
  score: number;
  status: GamePhase;
}

export type MenuOption = "play" | "rules" | "options";

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
  | "StraightFlush"
  | "FiveOfAKind"
  | "FlushHouse"
  | "FlushFive";
