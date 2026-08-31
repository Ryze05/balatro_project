import type { Blind, BlindType } from "../types/game";

// Simplified approximation of Balatro's ante scaling curve.
// Not the exact numbers from the game, but grows the same way:
// each ante is meaningfully harder than the last.
const BASE_SCORE_BY_ANTE: number[] = [
  100, 300, 500, 800, 1200, 1800, 2600, 3800,
];

function getBaseScore(ante: number): number {
  if (ante <= BASE_SCORE_BY_ANTE.length) return BASE_SCORE_BY_ANTE[ante - 1];
  // keep scaling ~1.5x per ante past the table above
  const last = BASE_SCORE_BY_ANTE[BASE_SCORE_BY_ANTE.length - 1];
  const extraAntes = ante - BASE_SCORE_BY_ANTE.length;
  return Math.round(last * Math.pow(1.5, extraAntes));
}

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

function pickBossName(ante: number): string {
  return BOSS_NAMES[(ante - 1) % BOSS_NAMES.length];
}

function makeBlind(ante: number, type: BlindType): Blind {
  const base = getBaseScore(ante);
  const targetScore = Math.round(base * TYPE_MULTIPLIER[type]);
  const reward = TYPE_REWARD[type];

  if (type === "boss") {
    return {
      id: `${ante}-boss`,
      name: pickBossName(ante),
      type,
      targetScore,
      reward,
      skippable: false,
      description: "Boss Blind — cannot be skipped.",
    };
  }

  return {
    id: `${ante}-${type}`,
    name: type === "small" ? "Small Blind" : "Big Blind",
    type,
    targetScore,
    reward,
    skippable: true,
    skipTag: "+1 Skip Tag",
    description: type === "small" ? "Warm-up blind." : "Ramping up.",
  };
}

export function generateBlindsForAnte(ante: number): Blind[] {
  return [makeBlind(ante, "small"), makeBlind(ante, "big"), makeBlind(ante, "boss")];
}
