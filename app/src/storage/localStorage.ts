import type { GameState } from "../types/game";

const STORAGE_KEY = "balatro-clone:save";

export function saveGame(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadGame(): GameState | null {
  const item = localStorage.getItem(STORAGE_KEY);
  if (!item) return null;

  try {
    // return JSON.parse(item) as GameState;
    return JSON.parse(item);
  } catch {
    return null;
  }
}

export function clearSavedGame(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasSavedGame(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
