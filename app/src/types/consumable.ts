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
  //* cartas espectrales
  | { type: "enhance_card"; chipBonus: number } //* Añade fichas permanentes
  | { type: "convert_hand_suit" } //* Convierte toda la mano a un palo aleatorio
  | { type: "destroy_joker" } //* Destruye el comodín seleccionado
  | { type: "duplicate_joker" } //* Duplica el comodín seleccionado
  | { type: "add_random_joker" }; //* Añade un comodín aleatorio gratis

export interface Consumable {
  id: string;
  name: string;
  description: string;
  price: number;
  kind: ConsumableKind;
  effect: ConsumableEffect;
}
