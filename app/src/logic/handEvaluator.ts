import type { Card, Rank, Suit } from "../types/card";
import type { HandType } from "../types/game";

const RANK_ORDER: Rank[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

function getRankIndex(rank: Rank): number {
  return RANK_ORDER.indexOf(rank);
}

function groupByRank(cards: Card[]): Map<Rank, Card[]> {
  const groups = new Map<Rank, Card[]>();
  cards.forEach((card) => {
    const group = groups.get(card.rank) || [];
    group.push(card);
    groups.set(card.rank, group);
  });
  return groups;
}

function groupBySuit(cards: Card[]): Map<Suit, Card[]> {
  const groups = new Map<Suit, Card[]>();
  cards.forEach((card) => {
    const group = groups.get(card.suit) || [];
    group.push(card);
    groups.set(card.suit, group);
  });
  return groups;
}

function isFlush(cards: Card[]): boolean {
  if (cards.length < 5) return false;
  const suitGroups = groupBySuit(cards);

  for (const group of suitGroups.values()) {
    if (group.length >= 5) return true;
  }

  return false;
}

function isStraight(cards: Card[]): boolean {
  if (cards.length < 5) return false;

  const rankSet = new Set(cards.map((i) => i.rank));
  const uniqueRanks = [...rankSet];

  if (uniqueRanks.length < 5) return false;

  const sortedRanks = uniqueRanks
    .map((i) => getRankIndex(i))
    .sort((a, b) => a - b);

  for (let i = 0; i <= sortedRanks.length - 5; i++) {
    if (sortedRanks[i + 4] - sortedRanks[i] === 4) return true;
  }

  if (
    rankSet.has("A") &&
    rankSet.has("2") &&
    rankSet.has("3") &&
    rankSet.has("4") &&
    rankSet.has("5")
  ) {
    return true;
  }

  return false;
}

// TODO: Revisar/testear todos los casos posibles
function getStraightCards(cards: Card[]): Card[] {
  const cardsByRank = groupByRank(cards);

  for (let high = 12; high >= 4; high--) {
    const ranks: Rank[] = [
      RANK_ORDER[high],
      RANK_ORDER[high - 1],
      RANK_ORDER[high - 2],
      RANK_ORDER[high - 3],
      RANK_ORDER[high - 4],
    ];

    if (ranks.every((rank) => cardsByRank.has(rank))) {
      return ranks.map((rank) => cardsByRank.get(rank)![0]);
    }
  }

  const wheelRanks: Rank[] = ["A", "2", "3", "4", "5"];
  if (wheelRanks.every((rank) => cardsByRank.has(rank))) {
    return wheelRanks.map((rank) => cardsByRank.get(rank)![0]);
  }

  return [];
}

//TODO: Testear todos los casos posibles
function getFlushCards(cards: Card[]): Card[] {
  const suitGroups = groupBySuit(cards);
  for (const group of suitGroups.values()) {
    if (group.length >= 5) {
      return group.sort((a, b) => getRankIndex(b.rank) - getRankIndex(a.rank)).slice(0, 5);
    }
  }
  return [];
}

export function evaluateHand(cards: Card[]): {
  handType: HandType;
  scoringCards: Card[];
} {
  if (cards.length === 0) {
    return {
      handType: "HighCard",
      scoringCards: [],
    };
  }

  if (cards.length === 1) {
    return {
      handType: "HighCard",
      scoringCards: cards,
    };
  }

  const rankGroups = groupByRank(cards);
  const groups = Array.from(rankGroups.values()).sort(
    (a, b) => b.length - a.length,
  );

  const hasFlush = isFlush(cards);
  const hasStraight = isStraight(cards);

  //* Flush Five
  if (groups[0].length >= 5) {
    const suit = groups[0][0].suit;
    const suitedFive = groups[0].filter((i) => i.suit === suit);
    if (suitedFive.length >= 5) {
      return { handType: "FlushFive", scoringCards: suitedFive.slice(0, 5) };
    }
    return { handType: "FiveOfAKind", scoringCards: groups[0] };
  }

  // if (groups[0].length >= 5) {
  //   return { handType: "FiveOfAKind", scoringCards: groups[0] };
  // }

  //* Straight Flush
  if (hasFlush && hasStraight) {
    return { handType: "StraightFlush", scoringCards: getStraightCards(cards) };
  }

  //* Four of a Kind
  if (groups[0].length === 4) {
    return { handType: "FourOfAKind", scoringCards: groups[0] };
  }

  //* Flush House
  if (
    groups[0].length >= 3 &&
    groups.length >= 2 &&
    groups[1].length >= 2 &&
    hasFlush
  ) {
    const tripCards = groups[0].slice(0, 3);
    const pairCards = groups[1].slice(0, 2);
    const fiveCards = [...tripCards, ...pairCards];
    const suit = fiveCards[0].suit;
    if (fiveCards.every((c) => c.suit === suit)) {
      return { handType: "FlushHouse", scoringCards: fiveCards };
    }
  }

  //* Full House
  if (groups[0].length === 3 && groups.length >= 2 && groups[1].length >= 2) {
    return {
      handType: "FullHouse",
      scoringCards: [...groups[0], ...groups[1].slice(0, 2)],
    };
  }

  //* Flush
  if (hasFlush) {
    return { handType: "Flush", scoringCards: getFlushCards(cards) };
  }

  //* Straight
  if (hasStraight) {
    return { handType: "Straight", scoringCards: getStraightCards(cards) };
  }

  //* Three of a Kind
  if (groups[0].length === 3) {
    return { handType: "ThreeOfAKind", scoringCards: groups[0] };
  }

  //* Two Pair
  if (groups[0].length === 2 && groups.length >= 2 && groups[1].length === 2) {
    return { handType: "TwoPair", scoringCards: [...groups[0], ...groups[1]] };
  }

  //* Pair
  if (groups[0].length === 2) {
    return { handType: "Pair", scoringCards: groups[0] };
  }

  //* High Card
  const sorted = [...cards].sort(
    (a, b) => getRankIndex(b.rank) - getRankIndex(a.rank),
  );
  return { handType: "HighCard", scoringCards: [sorted[0]] };
}
