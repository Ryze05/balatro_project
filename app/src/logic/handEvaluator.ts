import type { Rank } from "../types/game";

const RANK_ORDER: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

function getRankIndex(rank: Rank): number {
  return RANK_ORDER.indexOf(rank);
}

//getRankIndex("3")