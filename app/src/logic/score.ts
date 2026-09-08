import type { Card } from "../types/card";
import type { HandType, ScoringContext } from "../types/game";
import type { Joker } from "../types/joker";

interface HandValues {
  chips: number;
  multiplier: number;
  chipsPerLevel: number;
  multPerLevel: number;
}

const HAND_VALUES: Record<HandType, HandValues> = {
  HighCard:       { chips: 5,   multiplier: 1, chipsPerLevel: 10, multPerLevel: 1 },
  Pair:           { chips: 10,  multiplier: 2, chipsPerLevel: 15, multPerLevel: 1 },
  TwoPair:        { chips: 20,  multiplier: 2, chipsPerLevel: 20, multPerLevel: 1 },
  ThreeOfAKind:   { chips: 30,  multiplier: 3, chipsPerLevel: 20, multPerLevel: 2 },
  Straight:       { chips: 30,  multiplier: 4, chipsPerLevel: 30, multPerLevel: 3 },
  Flush:          { chips: 35,  multiplier: 4, chipsPerLevel: 15, multPerLevel: 2 },
  FullHouse:      { chips: 40,  multiplier: 4, chipsPerLevel: 25, multPerLevel: 2 },
  FourOfAKind:    { chips: 60,  multiplier: 7, chipsPerLevel: 30, multPerLevel: 3 },
  StraightFlush:  { chips: 100, multiplier: 8, chipsPerLevel: 40, multPerLevel: 4 },
  FiveOfAKind:    { chips: 120, multiplier: 12, chipsPerLevel: 35, multPerLevel: 3 },
  FlushHouse:     { chips: 140, multiplier: 14, chipsPerLevel: 40, multPerLevel: 4 },
  FlushFive:      { chips: 160, multiplier: 16, chipsPerLevel: 50, multPerLevel: 4 },
};

export function getHandValues(handType: HandType): HandValues {
  return HAND_VALUES[handType];
}

function applyJokers(jokers: Joker[], score: ScoringContext): ScoringContext {
  const initialScore = { ...score };

  jokers.forEach(joker => {
    if (!joker.effect) return

    const {type, value} = joker.effect

    switch (type) {
      case "add_chips":
        initialScore.chips += value;
        break;
      case "add_multiplier":
        initialScore.multiplier += value;
        break;
      case "multiply_multiplier":
        initialScore.multiplier *= value;
        break;
    }

  });

  return initialScore;
}

export function calculateScore(
  handType: HandType,
  scoringCards: Card[],
  jokers: Joker[],
  handLevels: Partial<Record<HandType, number>> = {}
): ScoringContext {
  const baseScore = HAND_VALUES[handType];
  const level = handLevels[handType] ?? 1;
  const levelBonus = level - 1;

  let cardChips = 0
  scoringCards.forEach(card => {
    cardChips += card.chipValue
  })

  const score: ScoringContext = {
    chips: baseScore.chips + cardChips + levelBonus * baseScore.chipsPerLevel,
    multiplier: baseScore.multiplier + levelBonus * baseScore.multPerLevel,
    handType,
    playedCards: scoringCards,
  };

  return applyJokers(jokers, score);
}

export function getFinalScore(score: ScoringContext): number {
  return score.chips * score.multiplier;
}
