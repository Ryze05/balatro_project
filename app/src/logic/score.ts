import type { Card } from "../types/card";
import type { HandType, ScoringContext } from "../types/game";
import type { Joker } from "../types/joker";

interface HandValues {
  chips: number;
  multiplier: number;
}

const HAND_VALUES: Record<HandType, HandValues> = {
  HighCard:       { chips: 5,   multiplier: 1 },
  Pair:           { chips: 10,  multiplier: 2 },
  TwoPair:        { chips: 20,  multiplier: 2 },
  ThreeOfAKind:   { chips: 30,  multiplier: 3 },
  Straight:       { chips: 30,  multiplier: 4 },
  Flush:          { chips: 35,  multiplier: 4 },
  FullHouse:      { chips: 40,  multiplier: 4 },
  FourOfAKind:    { chips: 60,  multiplier: 7 },
  StraightFlush:  { chips: 100, multiplier: 8 },
  FiveOfAKind:    { chips: 120, multiplier: 12 },
  FlushHouse:     { chips: 140, multiplier: 14 },
  FlushFive:      { chips: 160, multiplier: 16 },
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
  jokers: Joker[]
): ScoringContext {
  const baseScore = HAND_VALUES[handType];

  let cardChips = 0
  scoringCards.forEach(card => {
    cardChips += card.chipValue
  })

  const score: ScoringContext = {
    chips: baseScore.chips + cardChips,
    multiplier: baseScore.multiplier,
    handType,
    playedCards: scoringCards,
  };

  return applyJokers(jokers, score);
}

export function getFinalScore(score: ScoringContext): number {
  return score.chips * score.multiplier;
}
