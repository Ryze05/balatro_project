import type { Blind, BlindType, HandType } from "../types/game";
import type { Card } from "../types/card";
import type { BossDefinition } from "../types/boss";
import { shuffle } from "../utils/shuffle";

//* Puntajes de los niveles
const BASE_CHIPS_FOR_LEVEL: Record<number, number> = {
  1: 300,
  2: 800,
  3: 2000,
  4: 5000,
  5: 11000,
  6: 20000,
  7: 35000,
  8: 50000,
};

const ENDLESS_BASE_CHIPS_FOR_LEVEL: Record<number, number> = {
  9: 110000,
  10: 560000,
  11: 7200000,
  12: 300000000,
};

const ENDLESS_EXTRA_LEVEL_FACTOR = 4;

function getBaseChipsForLevel(level: number): number {
  if (level <= 8) return BASE_CHIPS_FOR_LEVEL[level];

  const known = ENDLESS_BASE_CHIPS_FOR_LEVEL[level];
  if (known !== undefined) return known;

  const lastKnown = ENDLESS_BASE_CHIPS_FOR_LEVEL[12];
  const extraLevels = level - 12;
  return Math.round(lastKnown * Math.pow(ENDLESS_EXTRA_LEVEL_FACTOR, extraLevels));
}

//* Multiplicadores y premios por tipo de blind
const TYPE_MULTIPLIER: Record<BlindType, number> = {
  small: 1,
  big: 1.5,
  boss: 2,
};

const TYPE_REWARD: Record<BlindType, number> = {
  small: 3,
  big: 4,
  boss: 5,
};

//* Catálogo de Boss Blinds con su efecto y el Ante mínimo en el que aparecen
export const BOSS_CATALOG: BossDefinition[] = [
  { id: "the-hook", name: "The Hook", description: "Descarta 2 cartas al azar cada vez que juegas una mano.", anteMinimo: 1, effect: { type: "discard_random_on_play", count: 2 } },
  { id: "the-goad", name: "The Goad", description: "Las picas no puntúan.", anteMinimo: 1, effect: { type: "debuff_suit", suit: "spades" } },
  { id: "the-head", name: "The Head", description: "Los corazones no puntúan.", anteMinimo: 1, effect: { type: "debuff_suit", suit: "hearts" } },
  { id: "the-window", name: "The Window", description: "Los diamantes no puntúan.", anteMinimo: 1, effect: { type: "debuff_suit", suit: "diamonds" } },
  { id: "the-club", name: "The Club", description: "Los tréboles no puntúan.", anteMinimo: 1, effect: { type: "debuff_suit", suit: "clubs" } },
  { id: "the-water", name: "The Water", description: "Empiezas la ronda sin descartes.", anteMinimo: 1, effect: { type: "discards", count: 0 } },
  { id: "the-manacle", name: "The Manacle", description: "Roba una carta menos.", anteMinimo: 1, effect: { type: "handSize", delta: -1 } },
  { id: "the-wall", name: "The Wall", description: "El objetivo se multiplica por 2.", anteMinimo: 2, effect: { type: "target", multiplier: 2 } },
  { id: "the-needle", name: "The Needle", description: "Solo tienes 1 mano.", anteMinimo: 2, effect: { type: "hands", count: 1 } },
  { id: "the-plant", name: "The Plant", description: "Las figuras (J, Q, K) no puntúan.", anteMinimo: 2, effect: { type: "debuff_face" } },
  { id: "the-eye", name: "The Eye", description: "No puedes repetir el tipo de jugada en la ronda.", anteMinimo: 3, effect: { type: "no_repeat_hands" } },
  { id: "the-mouth", name: "The Mouth", description: "Solo puedes jugar el tipo de tu primera mano.", anteMinimo: 3, effect: { type: "first_hand_only" } },
];

//* Pool de bosses disponibles para un Ante, sin repetir hasta agotarlo
export function createBossPool(level: number): string[] {
  return shuffle(BOSS_CATALOG.filter((boss) => boss.anteMinimo <= level).map((boss) => boss.id));
}

export function pickNextBoss(pool: string[], level: number): { bossId: string; remaining: string[] } {
  const activePool = pool.length === 0 ? createBossPool(level) : pool;
  const bossId = activePool[activePool.length - 1];
  return { bossId, remaining: activePool.slice(0, -1) };
}

export function getBossById(id: string | undefined): BossDefinition | undefined {
  if (!id) return undefined;
  return BOSS_CATALOG.find((boss) => boss.id === id);
}

export function getHandSizeDelta(blind: Blind): number {
  return blind.effect?.type === "handSize" ? blind.effect.delta : 0;
}

export function getResourceOverrides(blind: Blind): { hands?: number; discards?: number } {
  const effect = blind.effect;
  if (effect?.type === "hands") return { hands: effect.count };
  if (effect?.type === "discards") return { discards: effect.count };
  return {};
}

export function isCardDebuffed(card: Card, blind: Blind): boolean {
  const effect = blind.effect;
  if (effect?.type === "debuff_suit") return card.suit === effect.suit;
  if (effect?.type === "debuff_face") return ["J", "Q", "K"].includes(card.rank);
  return false;
}

export function checkPlayAllowed(
  handType: HandType,
  playedTypes: HandType[],
  blind: Blind,
): { allowed: boolean; reason?: string } {
  const effect = blind.effect;
  if (effect?.type === "no_repeat_hands" && playedTypes.includes(handType)) {
    return { allowed: false, reason: `${blind.name}: no puedes repetir esta jugada en la ronda.` };
  }
  if (effect?.type === "first_hand_only" && playedTypes.length > 0 && playedTypes[0] !== handType) {
    return { allowed: false, reason: `${blind.name}: solo puedes jugar la misma jugada que tu primera mano.` };
  }
  return { allowed: true };
}

//* Construcción de los blinds
function buildBlind(level: number, type: BlindType, bossId: string): Blind {
  const baseChips = getBaseChipsForLevel(level);
  let targetScore = Math.round(baseChips * TYPE_MULTIPLIER[type]);
  const reward = TYPE_REWARD[type];

  if (type === "boss") {
    const boss = getBossById(bossId);
    if (boss?.effect.type === "target") {
      targetScore = Math.round(targetScore * boss.effect.multiplier);
    }
    return {
      id: `${level}-boss`,
      name: boss?.name ?? "Boss Blind",
      type,
      targetScore,
      reward,
      skippable: false,
      bossId: boss?.id,
      effect: boss?.effect,
      description: boss?.description ?? "Boss Blind — cannot be skipped.",
    };
  }

  return {
    id: `${level}-${type}`,
    name: type === "small" ? "Small Blind" : "Big Blind",
    type,
    targetScore,
    reward,
    skippable: true,
    skipTag: "+1 Skip Tag",
    description: type === "small" ? "Warm-up blind." : "Ramping up.",
  };
}

//* Generar blinds de los niveles
export function generateBlindsForLevel(level: number, bossId: string): Blind[] {
  return [
    buildBlind(level, "small", bossId),
    buildBlind(level, "big", bossId),
    buildBlind(level, "boss", bossId),
  ];
}