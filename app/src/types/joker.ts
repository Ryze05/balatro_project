export interface Joker {
  id: string;
  name: string;
  description: string;
  price: number;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  effect: {
    type: "add_chips" | "add_multiplier" | "multiply_multiplier";
    value: number;
  };
}
