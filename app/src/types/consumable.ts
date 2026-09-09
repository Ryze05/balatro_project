import type { Suit } from "./card";
import type { Rank } from "./card";
import type { HandType } from "./game";

export type ConsumableKind = "tarot" | "planet";

export type ConsumableEffect =
  | { type: "set_suit"; suit: Suit }
  | { type: "set_rank"; rank: Rank }
  | { type: "add_money"; value: number }
  | { type: "destroy_card" }
  | { type: "level_hand"; handType: HandType };

export interface Consumable {
  id: string;
  name: string;
  description: string;
  price: number;
  kind: ConsumableKind;
  effect: ConsumableEffect;
}
