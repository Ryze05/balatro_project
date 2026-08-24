import type { HandType } from "../types/game";

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
