import type { Card, Rank, Suit } from "../types/card";
import type { HandType } from "../types/joker";

const RANK_ORDER: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

function getRankIndex(rank: Rank): number {
  return RANK_ORDER.indexOf(rank);
}

function groupByRank(cards: Card[]): Map<Rank, Card[]> {
  const groups = new Map<Rank, Card[]>();
  cards.forEach(card => {
    const group = groups.get(card.rank) || [];
    group.push(card);
    groups.set(card.rank, group);
  })
  return groups;
}

function groupBySuit(cards: Card[]): Map<Suit, Card[]> {
  const groups = new Map<Suit, Card[]>();
  cards.forEach(card => {
    const group = groups.get(card.suit) || [];
    group.push(card);
    groups.set(card.suit, group);
  })
  return groups;
}

function isFlush(cards: Card[]): boolean {
  if (cards.length < 5) return false;
  const suitGroups = groupBySuit(cards);

  for (const group of suitGroups.values()) {
    if (group.length >= 5) return true
  }

  return false

  // let isFlush = false

  // suitGroups.forEach((value) => {
  //   if (value.length >= 5) isFlush = true
  // })

  // return isFlush;
}

function isStraight(cards: Card[]): boolean {
  if (cards.length < 5) return false;

  const rankSet = new Set(cards.map(i => i.rank))
  const uniqueRanks = [...rankSet]

  if (uniqueRanks.length < 5) return false;

  const sortedRanks = uniqueRanks
    .map(i => getRankIndex(i))
    .sort((a, b) => a - b);

  let consecutive = true;
  for (let i = 1; i < sortedRanks.length; i++) {
    if (sortedRanks[i] !== sortedRanks[i - 1] + 1) {
      consecutive = false;
      break;
    }
  }

  if (consecutive) return true;

  if (sortedRanks.includes(12) && sortedRanks.includes(0) && sortedRanks.includes(1) && sortedRanks.includes(2) && sortedRanks.includes(3)) {
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

    if (ranks.every(rank => cardsByRank.has(rank))) {
      return ranks.map(rank => cardsByRank.get(rank)![0]);
    }
  }

  const wheelRanks: Rank[] = ["A", "2", "3", "4", "5"];
  if (wheelRanks.every(rank => cardsByRank.has(rank))) {
    return wheelRanks.map(rank => cardsByRank.get(rank)![0]);
  }

  return [];
}

//TODO: Testear todos los casos posibles
function getFlushCards(cards: Card[]): Card[] {
  const suitGroups = groupBySuit(cards);
  for (const group of suitGroups.values()) {
    if (group.length >= 5) {
      return group
      // return group.slice(0, 5);
    }
  }
  return [];
}

export function evaluateHand(cards: Card[]): { handType: HandType; scoringCards: Card[] } {

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
  const groups = Array.from(rankGroups.values()).sort((a, b) => b.length - a.length);

  const hasFlush = isFlush(cards);
  const hasStraight = isStraight(cards);

  //* Straight Flush
  if (hasFlush && hasStraight) {
    return { handType: "StraightFlush", scoringCards: getStraightCards(cards) };
  }

  //* Four of a Kind
  if (groups[0].length === 4) {
    return { handType: "FourOfAKind", scoringCards: groups[0] };
  }

  //* Full House
  if (groups[0].length === 3 && groups.length >= 2 && groups[1].length >= 2) {
    return { handType: "FullHouse", scoringCards: [...groups[0], ...groups[1].slice(0, 2)] };
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
  const sorted = [...cards].sort((a, b) => getRankIndex(b.rank) - getRankIndex(a.rank));
  return { handType: "HighCard", scoringCards: [sorted[0]] };
}