import type { Consumable } from "../types/consumable";
import type { Card } from "../types/card";
import type { HandType } from "../types/game";
import { shuffle } from "../utils/shuffle";

const TAROT_DEFINITIONS: Consumable[] = [
  { id: "tarot-chariot", name: "The Chariot", description: "Cambia el palo de una carta a Picas", price: 3, kind: "tarot", effect: { type: "set_suit", suit: "spades" } },
  { id: "tarot-lovers", name: "The Lovers", description: "Cambia el palo de una carta a Corazones", price: 3, kind: "tarot", effect: { type: "set_suit", suit: "hearts" } },
  { id: "tarot-star", name: "The Star", description: "Cambia el palo de una carta a Diamantes", price: 3, kind: "tarot", effect: { type: "set_suit", suit: "diamonds" } },
  { id: "tarot-sun", name: "The Sun", description: "Cambia el palo de una carta a Tréboles", price: 3, kind: "tarot", effect: { type: "set_suit", suit: "clubs" } },
  { id: "tarot-hierophant", name: "The Hierophant", description: "Cambia el rango de una carta a 2", price: 3, kind: "tarot", effect: { type: "set_rank", rank: "2" } },
  { id: "tarot-emperor", name: "The Emperor", description: "Cambia el rango de una carta a 4", price: 3, kind: "tarot", effect: { type: "set_rank", rank: "4" } },
  { id: "tarot-tower", name: "The Tower", description: "Cambia el rango de una carta a 6", price: 3, kind: "tarot", effect: { type: "set_rank", rank: "6" } },
  { id: "tarot-strength", name: "Strength", description: "Cambia el rango de una carta a 8", price: 3, kind: "tarot", effect: { type: "set_rank", rank: "8" } },
  { id: "tarot-hermit", name: "The Hermit", description: "Gana 20 dólares", price: 4, kind: "tarot", effect: { type: "add_money", value: 20 } },
  { id: "tarot-temperance", name: "Temperance", description: "Gana 25 dólares", price: 4, kind: "tarot", effect: { type: "add_money", value: 25 } },
  { id: "tarot-hanged-man", name: "The Hanged Man", description: "Destruye una carta seleccionada", price: 3, kind: "tarot", effect: { type: "destroy_card" } },
];

const PLANET_DEFINITIONS: Consumable[] = [
  { id: "planet-mercury", name: "Mercury", description: "Sube de nivel la Pareja", price: 4, kind: "planet", effect: { type: "level_hand", handType: "Pair" } },
  { id: "planet-uranus", name: "Uranus", description: "Sube de nivel Doble Pareja", price: 4, kind: "planet", effect: { type: "level_hand", handType: "TwoPair" } },
  { id: "planet-mars", name: "Mars", description: "Sube de nivel Trío", price: 4, kind: "planet", effect: { type: "level_hand", handType: "ThreeOfAKind" } },
  { id: "planet-jupiter", name: "Jupiter", description: "Sube de nivel Color", price: 4, kind: "planet", effect: { type: "level_hand", handType: "Flush" } },
  { id: "planet-saturn", name: "Saturn", description: "Sube de nivel Escalera", price: 4, kind: "planet", effect: { type: "level_hand", handType: "Straight" } },
  { id: "planet-earth", name: "Earth", description: "Sube de nivel Full House", price: 4, kind: "planet", effect: { type: "level_hand", handType: "FullHouse" } },
  { id: "planet-venus", name: "Venus", description: "Sube de nivel Póker", price: 4, kind: "planet", effect: { type: "level_hand", handType: "FourOfAKind" } },
  { id: "planet-neptune", name: "Neptune", description: "Sube de nivel Escalera de Color", price: 4, kind: "planet", effect: { type: "level_hand", handType: "StraightFlush" } },
  { id: "planet-pluto", name: "Pluto", description: "Sube de nivel Carta Alta", price: 4, kind: "planet", effect: { type: "level_hand", handType: "HighCard" } },
];

export function getShopConsumables(count: number = 2): Consumable[] {
  return shuffle([...TAROT_DEFINITIONS, ...PLANET_DEFINITIONS])
    .slice(0, count)
    .map((i) => ({ ...i }));
}

export function getArcanaPack(count: number = 3): Consumable[] {
  return shuffle(TAROT_DEFINITIONS).slice(0, count).map((i) => ({ ...i }));
}

export function getCelestialPack(count: number = 3): Consumable[] {
  return shuffle(PLANET_DEFINITIONS).slice(0, count).map((i) => ({ ...i }));
}

export function getConsumableById(id: string): Consumable | undefined {
  return [...TAROT_DEFINITIONS, ...PLANET_DEFINITIONS].find((i) => i.id === id);
}

export function requiresTarget(consumable: Consumable): boolean {
  return (
    consumable.effect.type === "set_suit" ||
    consumable.effect.type === "set_rank" ||
    consumable.effect.type === "destroy_card"
  );
}

export function getHandType(consumable: Consumable): HandType | undefined {
  return consumable.effect.type === "level_hand"
    ? consumable.effect.handType
    : undefined;
}

export function applyConsumableEffect(
  consumable: Consumable,
  hand: Card[],
  consumables: Consumable[],
  targetCardId?: string,
): { money?: number; hand?: Card[]; consumables?: Consumable[] } {
  const effect = consumable.effect;
  const consumableIndex = consumables.findIndex((i) => i.id === consumable.id);
  const remaining = consumables.filter((_, i) => i !== consumableIndex);

  if (effect.type === "add_money") {
    return { money: effect.value, consumables: remaining };
  }

  if (effect.type === "level_hand") {
    return { consumables: remaining };
  }

  const target = hand.find((card) => card.id === targetCardId);
  if (!target) return {};

  const cardIndex = hand.findIndex((card) => card.id === targetCardId);
  const updated = hand.map((card, index) => {
    if (index !== cardIndex) return card;
    if (effect.type === "set_suit") return { ...card, suit: effect.suit };
    if (effect.type === "set_rank") return { ...card, rank: effect.rank };
    return card;
  });

  if (effect.type === "destroy_card") {
    return {
      hand: hand.filter((card) => card.id !== targetCardId),
      consumables: remaining,
    };
  }

  return { hand: updated, consumables: remaining };
}