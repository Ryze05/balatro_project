export type Palo = "♥" | "♠" | "♣" | "♦";

export interface Card {
  id: string;
  valor: number;
  palo: Palo;
  hidden: boolean;
}

export type GameState = 'menu' | 'playing' | 'shop' | 'gameover';

export type MenuOption = "play" | "rules" | "options";