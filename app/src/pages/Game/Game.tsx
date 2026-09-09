import { useState, useEffect } from "react";
import type { MenuOption } from "../../types/game";
import type { DeckId } from "../../types/deck";
import type { Consumable } from "../../types/consumable";
import { requiresTarget } from "../../logic/consumables";
import MainMenu from "../../components/MainMenu/MainMenu";
import BlindSelect from "../../components/BlindSelect/BlindSelect";
import RoundPanel from "../../components/RoundPanel/RoundPanel";
import Shop from "../../components/Shop/Shop";
import { useGameState, MAX_CONSUMABLES } from "../../hooks/useGameState";
import { getConsumableSlots } from "../../logic/vouchers";
import styles from "./Game.module.css";
import JokerSidebar from "../../components/JokerSideBar/JokerSidebar";
import JokerBoard from "../../components/JokerBoard/JokerBoard";
import GameOverPanel from "../../components/GameOverPanel/GameOverPanel";

export default function Game() {
  const {
    gameState,
    startNewGame,
    selectCard,
    playHand,
    discardCards,
    buyJoker,
    buyConsumable,
    buyVoucher,
    buyPack,
    addConsumable,
    applyConsumable,
    reorderJokers,
    advanceToNextBlind,
    setGamePhase,
  } = useGameState();

  const {
    level,
    blinds,
    blindIndex,
    currentBlind,
    hand,
    handsLeft,
    discardsLeft,
    score,
    money,
    jokers,
    consumables,
    vouchers,
    status,
  } = gameState;

  //* Huecos reales de consumibles (tiene en cuenta el voucher Grabber),
  //* misma función que ya usa useGameState internamente para bloquear
  //* la compra cuando no hay hueco.
  const maxConsumableSlots = getConsumableSlots(MAX_CONSUMABLES, vouchers);

  const [targetConsumable, setTargetConsumable] = useState<Consumable | null>(null);

  //* Si sales de la ronda, se cancela el modo "elige carta objetivo"
  useEffect(() => {
    if (status !== "playing") setTargetConsumable(null);
  }, [status]);

  const handleUseConsumable = (consumable: Consumable): void => {
    if (requiresTarget(consumable)) {
      setTargetConsumable(consumable);
      return;
    }
    applyConsumable(consumable.id);
  };

  const handleTargetCard = (cardId: string): void => {
    if (targetConsumable) {
      applyConsumable(targetConsumable.id, cardId);
      setTargetConsumable(null);
    }
  };

  const handleMenuSelect = (option: MenuOption, deckId?: DeckId): void => {
    if (option === "play") {
      startNewGame(deckId);
      return;
    }
    setGamePhase("menu");
  };

  if (status === "menu") {
    return (
      <div>
        <MainMenu onSelect={handleMenuSelect} />
      </div>
    );
  }

  // Layout de dos columnas:
  // - Izquierda: marcador del blind, previsualización de la jugada,
  //   dinero y el botón que abre el panel de Vouchers comprados.
  // - Derecha: el tablero, que ahora empieza con la fila fija de
  //   Comodines + Consumibles (como en Balatro) y debajo la pantalla
  //   activa (selección de blind, ronda o tienda).
  // Ambas columnas ya son responsive vía Game.module.css (se apilan en
  // pantallas estrechas) y JokerBoard hace flex-wrap en su fila.
  return (
    <div className={styles.layout}>
      <div className={styles.sidebarColumn}>
        <JokerSidebar
          money={money}
          jokers={jokers}
          hand={status === "playing" ? hand : []}
          blind={currentBlind}
          score={score}
          vouchers={vouchers}
        />
      </div>

      <div className={styles.mainColumn}>
        <JokerBoard
          jokers={jokers}
          consumables={consumables}
          maxConsumableSlots={maxConsumableSlots}
          onReorder={reorderJokers}
          onUseConsumable={handleUseConsumable}
        />

        {status === "blindSelect" && (
          <div className={styles.screenArea}>
            <BlindSelect
              level={level}
              blinds={blinds}
              blindIndex={blindIndex}
              onPlay={() => setGamePhase("playing")}
              onSkip={advanceToNextBlind}
            />
          </div>
        )}

        {status === "playing" && currentBlind && (
          <div className={styles.screenArea}>
            <RoundPanel
              hand={hand}
              handsLeft={handsLeft}
              discardsLeft={discardsLeft}
              targetConsumable={targetConsumable}
              onToggleCard={selectCard}
              onPlayHand={playHand}
              onDiscard={discardCards}
              onTargetCard={handleTargetCard}
              onCancelTarget={() => setTargetConsumable(null)}
            />
          </div>
        )}

        {status === "shop" && (
          <div className={styles.screenArea}>
            <Shop
              money={money}
              consumables={consumables}
              vouchers={vouchers}
              maxConsumableSlots={maxConsumableSlots}
              onBuy={buyJoker}
              onBuyConsumable={buyConsumable}
              onBuyVoucher={buyVoucher}
              onBuyPack={buyPack}
              onAddConsumable={addConsumable}
              onContinue={advanceToNextBlind}
            />
          </div>
        )}

        {status === "gameover" && (
          <div className={styles.screenArea}>
            <GameOverPanel
              level={level}
              round={gameState.round}
              currentBlind={currentBlind}
              score={score}
              money={money}
              jokers={jokers}
              onRestart={() => startNewGame(gameState.deckId)}
              onMenu={() => setGamePhase("menu")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
