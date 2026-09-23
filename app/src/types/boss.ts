import type { Suit } from "./card";

//* Efecto que aplica un Boss Blind. Cada boss tiene exactamente uno.
export type BossEffect =
  | { type: "target"; multiplier: number }            // The Wall
  | { type: "hands"; count: number }                  // The Needle
  | { type: "discards"; count: number }               // The Water
  | { type: "handSize"; delta: number }               // The Manacle
  | { type: "debuff_suit"; suit: Suit }               // The Goad/Head/Window/Club
  | { type: "debuff_face" }                           // The Plant
  | { type: "discard_random_on_play"; count: number } // The Hook
  | { type: "no_repeat_hands" }                       // The Eye
  | { type: "first_hand_only" };                      // The Mouth

export interface BossDefinition {
  id: string;
  name: string;
  description: string;
  anteMinimo: number;
  effect: BossEffect;
}
