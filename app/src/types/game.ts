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
  /** Boss blinds can never be skipped */
  skippable: boolean;
  /** Shown to the player when hovering the skip button, e.g. "+1 skip tag" */
  skipTag?: string;
  description?: string;
}

export interface GameState {
  deck: Card[];
  hand: Card[];
  discardPile: Card[];
  jokers: Joker[];
  ante: number;
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
