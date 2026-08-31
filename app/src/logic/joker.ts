import type { Joker } from "../types/joker";
import { shuffle } from "../utils/shuffle";

//* Catálogo de jokers
const JOKER_DEFINITIONS: Joker[] = [
  {
    id: "joker-chips-10",
    name: "+10 Chips",
    description: "Suma 10 chips a cada mano",
    price: 4,
    rarity: "common",
    effect: { type: "add_chips", value: 10 },
  },
  {
    id: "joker-mult-2",
    name: "+2 Multi",
    description: "Suma 2 al multiplicador",
    price: 4,
    rarity: "common",
    effect: { type: "add_multiplier", value: 2 },
  },
  {
    id: "joker-chip-magnet",
    name: "Chip Magnet",
    description: "Suma 15 chips",
    price: 5,
    rarity: "common",
    effect: { type: "add_chips", value: 15 },
  },
  {
    id: "joker-multi-boost",
    name: "Multi Boost",
    description: "Suma 3 al multiplicador",
    price: 6,
    rarity: "uncommon",
    effect: { type: "add_multiplier", value: 3 },
  },
  {
    id: "joker-double-multi",
    name: "Double Multi",
    description: "Duplica el multiplicador",
    price: 8,
    rarity: "uncommon",
    effect: { type: "multiply_multiplier", value: 2 },
  },
  {
    id: "joker-chip-stack",
    name: "Chip Stack",
    description: "Suma 25 chips",
    price: 7,
    rarity: "uncommon",
    effect: { type: "add_chips", value: 25 },
  },
  {
    id: "joker-multi-hammer",
    name: "Multi Hammer",
    description: "Suma 5 al multiplicador",
    price: 10,
    rarity: "rare",
    effect: { type: "add_multiplier", value: 5 },
  },
  {
    id: "joker-jackpot",
    name: "Jackpot",
    description: "Suma 50 chips",
    price: 12,
    rarity: "rare",
    effect: { type: "add_chips", value: 50 },
  },
];

export function getShopJokers(count: number = 3): Joker[] {
  return shuffle(JOKER_DEFINITIONS)
    .slice(0, count)
    .map((joker) => ({ ...joker }));
}

export function getJokerById(id: string): Joker | undefined {
  return JOKER_DEFINITIONS.find((joker) => joker.id === id);
}