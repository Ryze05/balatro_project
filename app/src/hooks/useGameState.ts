import { useState, useEffect, useCallback } from "react";
import type { GameState, GamePhase, Blind } from "../types/game";
import type { Card } from "../types/card";
import type { Joker } from "../types/joker";
import type { DeckId } from "../types/deck";
import { createDeck, drawCard, shuffleCards } from "../logic/deck";
import { evaluateHand } from "../logic/handEvaluator";
import { calculateScore, getFinalScore } from "../logic/score";
import {
  createBossPool,
  pickNextBossName,
  generateBlindsForLevel,
} from "../logic/blinds";
import { saveGame, loadGame, clearSavedGame } from "../storage/localStorage";

const HAND_SIZE = 8;
const BASE_HANDS = 4;
const BASE_DISCARDS = 3;
const BASE_MONEY = 4;

const DECK_BONUS: Record<
  DeckId,
  { hands: number; discards: number; money: number }
> = {
  red: { hands: 0, discards: 1, money: 0 },
  blue: { hands: 1, discards: 0, money: 0 },
  yellow: { hands: 0, discards: 0, money: 10 },
};

const EMPTY_BLIND: Blind = {
  id: "none",
  name: "None",
  type: "small",
  targetScore: 0,
  reward: 0,
  skippable: true,
};

function makeInitialState(): GameState {
  return {
    deck: [],
    hand: [],
    discardPile: [],
    jokers: [],
    deckId: "red",
    level: 1,
    blinds: [],
    blindIndex: 0,
    currentBlind: EMPTY_BLIND,
    round: 1,
    handsLeft: BASE_HANDS,
    discardsLeft: BASE_DISCARDS,
    money: BASE_MONEY,
    score: 0,
    status: "menu",
    bossNamesRemaining: [],
  };
}

//* Robar cartas
function drawCards(
  deck: Card[],
  count: number,
): { drawn: Card[]; deck: Card[] } {
  const drawn: Card[] = [];
  let current = [...deck];
  for (let i = 0; i < count && current.length > 0; i++) {
    const { drawnCard, remainingDeck } = drawCard(current);
    if (drawnCard) drawn.push({ ...drawnCard, selected: false });
    current = remainingDeck;
  }
  return { drawn, deck: current };
}

//* Estado para nivel nuevo, con pick para devolver partes específicas
function makeRoundState(
  state: GameState,
): Pick<
  GameState,
  "deck" | "hand" | "discardPile" | "handsLeft" | "discardsLeft" | "score"
> {
  const recycled = shuffleCards([
    ...state.deck,
    ...state.discardPile,
    ...state.hand,
  ]);
  const { drawn, deck } = drawCards(recycled, HAND_SIZE);
  return {
    deck,
    hand: drawn,
    discardPile: [],
    handsLeft: BASE_HANDS + DECK_BONUS[state.deckId].hands,
    discardsLeft: BASE_DISCARDS + DECK_BONUS[state.deckId].discards,
    score: 0,
  };
}

//* Hook personalizado
export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const loaded = loadGame();
    if (!loaded) return makeInitialState();
    return loaded;
  });

  useEffect(() => {
    if (
      gameState.status === "blindSelect" ||
      gameState.status === "playing" ||
      gameState.status === "shop"
    ) {
      saveGame(gameState);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState.status === "gameover") {
      clearSavedGame();
    }
  }, [gameState.status]);

  //* Empezar nueva partida
  const startNewGame = useCallback((deckId: DeckId = "red") => {
    const deck = createDeck();
    const { drawn, deck: remainingDeck } = drawCards(deck, HAND_SIZE);

    setGameState((prev) => {
      const bossPool = createBossPool();
      const { bossName, remaining } = pickNextBossName(bossPool);
      const blinds = generateBlindsForLevel(1, bossName);

      return {
        ...prev,
        deck: remainingDeck,
        hand: drawn,
        discardPile: [],
        jokers: [],
        deckId,
        level: 1,
        blinds,
        blindIndex: 0,
        currentBlind: blinds[0],
        round: 1,
        handsLeft: BASE_HANDS + DECK_BONUS[deckId].hands,
        discardsLeft: BASE_DISCARDS + DECK_BONUS[deckId].discards,
        money: BASE_MONEY + DECK_BONUS[deckId].money,
        score: 0,
        status: "blindSelect",
        bossNamesRemaining: remaining,
      };
    });
  }, []);

  //* Selecciona carta
  const selectCard = useCallback((cardId: string) => {
    setGameState((prev) => ({
      ...prev,
      hand: prev.hand.map((card) =>
        card.id === cardId ? { ...card, selected: !card.selected } : card,
      ),
    }));
  }, []);

  const playHand = useCallback(() => {
    setGameState((prev) => {
      const selected = prev.hand.filter((i) => i.selected === true);
      if (selected.length < 1 || selected.length > 5) return prev;

      //* Calculamos puntuación
      const { handType, scoringCards } = evaluateHand(selected);
      const score = calculateScore(handType, scoringCards, prev.jokers);
      const roundScore = getFinalScore(score);

      const newScore = prev.score + roundScore;
      const newHandsLeft = prev.handsLeft - 1;

      //* Cogemos cartas del mazo y actualizamos estado
      const remaining = prev.hand.filter((i) => i.selected === false);
      const { drawn, deck } = drawCards(
        prev.deck,
        HAND_SIZE - remaining.length,
      );

      const next: GameState = {
        ...prev,
        deck,
        hand: [...remaining, ...drawn],
        discardPile: [...prev.discardPile, ...selected],
        score: newScore,
        handsLeft: newHandsLeft,
      };

      if (newScore >= prev.currentBlind.targetScore) {
        return {
          ...next,
          money: prev.money + prev.currentBlind.reward,
          status: "shop",
        };
      }

      if (newHandsLeft <= 0) {
        return { ...next, handsLeft: 0, status: "gameover" };
      }

      return next;
    });
  }, []);

  //* Descartes
  const discardCards = useCallback(() => {
    setGameState((prev) => {
      if (prev.discardsLeft <= 0) return prev;
      const selected = prev.hand.filter((i) => i.selected === true);
      if (selected.length === 0) return prev;

      const remaining = prev.hand.filter((i) => i.selected === false);
      const { drawn, deck } = drawCards(prev.deck, selected.length);

      return {
        ...prev,
        deck,
        hand: [...remaining, ...drawn],
        discardPile: [...prev.discardPile, ...selected],
        discardsLeft: prev.discardsLeft - 1,
      };
    });
  }, []);

  //* Tienda
  const buyJoker = useCallback((joker: Joker) => {
    setGameState((prev) => {
      if (prev.money < joker.price) return prev;
      return {
        ...prev,
        money: prev.money - joker.price,
        jokers: [...prev.jokers, joker],
      };
    });
  }, []);

  //* Avanzar de blind
  const advanceToNextBlind = useCallback(() => {
    setGameState((prev) => {
      const nextIndex = prev.blindIndex + 1;

      //* Sigue dentro del mismo nivel, siguiente blind
      if (nextIndex < prev.blinds.length) {
        return {
          ...prev,
          blindIndex: nextIndex,
          currentBlind: prev.blinds[nextIndex],
          score: 0,
          handsLeft: BASE_HANDS + DECK_BONUS[prev.deckId].hands,
          discardsLeft: BASE_DISCARDS + DECK_BONUS[prev.deckId].discards,
          status: "blindSelect",
        };
      }

      //* Nuevo nivel, generar los nuevos blinds
      const { bossName, remaining } = pickNextBossName(prev.bossNamesRemaining);
      const nextLevel = prev.level + 1;
      const blinds = generateBlindsForLevel(nextLevel, bossName);

      return {
        ...prev,
        ...makeRoundState(prev),
        level: nextLevel,
        blinds,
        blindIndex: 0,
        currentBlind: blinds[0],
        round: prev.round + 1,
        status: "blindSelect",
        bossNamesRemaining: remaining,
      };
    });
  }, []);

  //* Cambiar fase
  const setGamePhase = useCallback((phase: GamePhase) => {
    setGameState((prev) => ({ ...prev, status: phase }));
  }, []);

  return {
    gameState,
    startNewGame,
    selectCard,
    playHand,
    discardCards,
    buyJoker,
    advanceToNextBlind,
    setGamePhase,
  };
}
