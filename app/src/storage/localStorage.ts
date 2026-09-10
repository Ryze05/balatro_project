import type { GameState } from "../types/game";

const STORAGE_KEY = "balatro-clone:save";
const SAVE_VERSION = 2;

interface SavedGame {
  version: number;
  state: GameState;
}

export function saveGame(state: GameState): void {
  try {
    const payload: SavedGame = { version: SAVE_VERSION, state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage no disponible (modo privado, cuota, etc.)
  }
}

export function loadGame(): GameState | null {
  const item = localStorage.getItem(STORAGE_KEY);
  if (!item) return null;

  try {
    const parsed = JSON.parse(item) as Partial<SavedGame>;
    if (parsed?.version !== SAVE_VERSION || !parsed.state) {
      clearSavedGame();
      return null;
    }
    return parsed.state;
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