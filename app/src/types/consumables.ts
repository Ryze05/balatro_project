import type { Consumable } from "../types/consumable";
import type { Card, Suit } from "../types/card";
import type { HandType } from "../types/game";
import type { Joker } from "../types/joker";
import { shuffle } from "../utils/shuffle";
import { getCardScore } from "./deck";
import { getRandomJoker } from "./joker";

const SUITS_FOR_RANDOM: Suit[] = ["hearts", "diamonds", "clubs", "spades"];

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

//* Cartas espectrales: pool exclusivo del Spectral Pack (nunca aparecen en
//* la tienda normal ni en Arcana/Celestial, igual que en Balatro).
const SPECTRAL_DEFINITIONS: Consumable[] = [
  {
    id: "spectral-grim",
    name: "Grim",
    description: "Mejora una carta seleccionada: +20 fichas permanentes",
    price: 4,
    kind: "spectral",
    effect: { type: "enhance_card", chipBonus: 20 },
  },
  {
    id: "spectral-sigil",
    name: "Sigil",
    description: "Convierte todas las cartas de tu mano a un palo aleatorio",
    price: 4,
    kind: "spectral",
    effect: { type: "convert_hand_suit" },
  },
  {
    id: "spectral-ectoplasm",
    name: "Ectoplasm",
    description: "Destruye el comodín seleccionado",
    price: 4,
    kind: "spectral",
    effect: { type: "destroy_joker" },
  },
  {
    id: "spectral-ankh",
    name: "Ankh",
    description: "Duplica el comodín seleccionado",
    price: 6,
    kind: "spectral",
    effect: { type: "duplicate_joker" },
  },
  {
    id: "spectral-soul",
    name: "The Soul",
    description: "Añade un comodín aleatorio gratis",
    price: 6,
    kind: "spectral",
    effect: { type: "add_random_joker" },
  },
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

//* Sobre espectral: 2 cartas por defecto (como el Spectral Pack de Balatro)
export function getSpectralPack(count: number = 2): Consumable[] {
  return shuffle(SPECTRAL_DEFINITIONS).slice(0, count).map((i) => ({ ...i }));
}

export function getConsumableById(id: string): Consumable | undefined {
  return [...TAROT_DEFINITIONS, ...PLANET_DEFINITIONS, ...SPECTRAL_DEFINITIONS].find(
    (i) => i.id === id,
  );
}

export type ConsumableTargetKind = "card" | "joker" | "none";

//* A qué hay que apuntar para poder aplicar el efecto: una carta de la
//* mano, un comodín, o nada (se aplica directamente).
export function getConsumableTargetKind(consumable: Consumable): ConsumableTargetKind {
  switch (consumable.effect.type) {
    case "set_suit":
    case "set_rank":
    case "destroy_card":
    case "enhance_card":
      return "card";
    case "destroy_joker":
    case "duplicate_joker":
      return "joker";
    default:
      return "none";
  }
}

//* Se mantiene por compatibilidad con el código existente
export function requiresTarget(consumable: Consumable): boolean {
  return getConsumableTargetKind(consumable) !== "none";
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
  jokers: Joker[],
  targetCardId?: string,
  targetJokerIndex?: number,
): { money?: number; hand?: Card[]; consumables?: Consumable[]; jokers?: Joker[] } {
  const effect = consumable.effect;
  const consumableIndex = consumables.findIndex((i) => i.id === consumable.id);
  const remaining = consumables.filter((_, i) => i !== consumableIndex);

  if (effect.type === "add_money") {
    return { money: effect.value, consumables: remaining };
  }

  if (effect.type === "level_hand") {
    return { consumables: remaining };
  }

  //* --- Efectos espectrales sin objetivo (se aplican al instante) ---

  if (effect.type === "add_random_joker") {
    return { jokers: [...jokers, getRandomJoker()], consumables: remaining };
  }

  if (effect.type === "convert_hand_suit") {
    const suit = SUITS_FOR_RANDOM[Math.floor(Math.random() * SUITS_FOR_RANDOM.length)];
    return {
      hand: hand.map((card) => ({ ...card, suit })),
      consumables: remaining,
    };
  }

  //* --- Efectos espectrales que apuntan a un comodín ---

  if (effect.type === "destroy_joker") {
    if (targetJokerIndex === undefined || !jokers[targetJokerIndex]) return {};
    return {
      jokers: jokers.filter((_, i) => i !== targetJokerIndex),
      consumables: remaining,
    };
  }

  if (effect.type === "duplicate_joker") {
    if (targetJokerIndex === undefined || !jokers[targetJokerIndex]) return {};
    return {
      jokers: [...jokers, { ...jokers[targetJokerIndex] }],
      consumables: remaining,
    };
  }

  //* --- Efectos que apuntan a una carta de la mano (tarots + Grim) ---

  const target = hand.find((card) => card.id === targetCardId);
  if (!target) return {};

  const cardIndex = hand.findIndex((card) => card.id === targetCardId);
  const updated = hand.map((card, index) => {
    if (index !== cardIndex) return card;
    if (effect.type === "set_suit") return { ...card, suit: effect.suit };
    if (effect.type === "set_rank")
      return { ...card, rank: effect.rank, chipValue: getCardScore(effect.rank) };
    if (effect.type === "enhance_card")
      return { ...card, enhanced: true, chipValue: card.chipValue + effect.chipBonus };
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
