export interface Joker {
  id: string;
  name: string;
  description: string;
  price: number;
  rarity: "common" | "uncommon" | "rare" | "legendary";
  effect: {
    type: string;
    value: number;
  };
}
