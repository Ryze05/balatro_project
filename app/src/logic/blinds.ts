import type { Blind, BlindType } from "../types/game";

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

//* Boss blinds
const BOSS_NAMES = [
  "The Hook",
  "The Ox",
  "The Wall",
  "The Fish",
  "The Manacle",
  "The Eye",
  "The Mouth",
  "The Serpent",
  "The Pillar",
  "The Water",
];

function shuffleBosses(): string[] {
  const pool = [...BOSS_NAMES];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

export function createBossPool(): () => string {
  let remaining = shuffleBosses();

  return function pickBossName(): string {
    if (remaining.length === 0) {
      remaining = shuffleBosses();
    }

    return remaining.pop() as string;
  };
}

//* Construcción de los blinds
function buildBlind(level: number, type: BlindType, pickBossName: () => string): Blind {
  const baseChips = getBaseChipsForLevel(level);
  const targetScore = Math.round(baseChips * TYPE_MULTIPLIER[type]);
  const reward = TYPE_REWARD[type];

  if (type === "boss") {
    return {
      id: `${level}-boss`,
      name: pickBossName(),
      type,
      targetScore,
      reward,
      skippable: false,
      description: "Boss Blind — cannot be skipped.",
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
export function generateBlindsForLevel(level: number, pickBossName: () => string): Blind[] {
  return [
    buildBlind(level, "small", pickBossName),
    buildBlind(level, "big", pickBossName),
    buildBlind(level, "boss", pickBossName),
  ];
}