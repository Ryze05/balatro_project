import type { Suit } from "./card";
import type { Rank } from "./card";
import type { HandType } from "./game";

export type ConsumableKind = "tarot" | "planet" | "spectral";

export type ConsumableEffect =
  | { type: "set_suit"; suit: Suit }
  | { type: "set_rank"; rank: Rank }
  | { type: "add_money"; value: number }
  | { type: "destroy_card" }
  | { type: "level_hand"; handType: HandType }
  //* Efectos espectrales
  | { type: "enhance_card"; chipBonus: number } //* Grim: mejora una carta
  | { type: "convert_hand_suit" } //* Sigil: convierte la mano a un palo aleatorio
  | { type: "destroy_joker" } //* Ectoplasm: destruye el comodín elegido
  | { type: "duplicate_joker" } //* Ankh: duplica el comodín elegido
  | { type: "add_random_joker" }; //* The Soul: añade un comodín aleatorio gratis

export interface Consumable {
  id: string;
  name: string;
  description: string;
  price: number;
  kind: ConsumableKind;
  effect: ConsumableEffect;
}
