import type { Card, Rank, Suit } from "../types/card";

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