import { useState, useEffect } from "react";
import type { MenuOption } from "../../types/game";
import type { DeckId } from "../../types/deck";
import type { Consumable } from "../../types/consumable";
import { getConsumableTargetKind } from "../../logic/consumables";
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
import IntroSplash from "../../components/IntroSplash/IntroSplash";

export default function Game() {
  const [showIntro, setShowIntro] = useState(false);
  const [showMenuTransition, setShowMenuTransition] = useState(false);

  const {
    gameState,
    startNewGame,
    selectCard,
    playHand,
    discardCards,
    buyJoker,
    buyConsumable,
    buyVoucher,
    spendMoney,
    rerollShop,
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
    playedHandTypesThisRound,
    status,
  } = gameState;

  const maxConsumableSlots = getConsumableSlots(MAX_CONSUMABLES, vouchers);

  const [targetConsumable, setTargetConsumable] = useState<Consumable | null>(null);

  const targetKind = targetConsumable ? getConsumableTargetKind(targetConsumable) : "none";

  useEffect(() => {
    setTargetConsumable(null);
  }, [status]);

  const canUseConsumable = (consumable: Consumable): boolean => {
    const kind = getConsumableTargetKind(consumable);
    if (kind === "card") return status === "playing" && hand.length > 0;
    if (kind === "joker") return jokers.length > 0;
    return true;
  };

  const handleUseConsumable = (consumable: Consumable): void => {
    if (!canUseConsumable(consumable)) return;

    if (getConsumableTargetKind(consumable) !== "none") {
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

  const handleTargetJoker = (jokerIndex: number): void => {
    if (targetConsumable) {
      applyConsumable(targetConsumable.id, undefined, jokerIndex);
      setTargetConsumable(null);
    }
  };

  const handleMenuSelect = (option: MenuOption, deckId?: DeckId): void => {
    if (option === "play") {
      setShowMenuTransition(false);
      startNewGame(deckId);
      setShowIntro(true);
      return;
    }
    setGamePhase("menu");
  };

  const handleReturnToMenu = (): void => {
    setGamePhase("menu");
    setShowMenuTransition(true);
  };

  if (status === "menu") {
    return (
      <div>
        <MainMenu onSelect={handleMenuSelect} />
        {showMenuTransition && (
          <IntroSplash
            variant="menu"
            onComplete={() => setShowMenuTransition(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {showIntro && <IntroSplash onComplete={() => setShowIntro(false)} />}
      <div className={styles.sidebarColumn}>
        <JokerSidebar
          money={money}
          jokers={jokers}
          hand={status === "playing" ? hand : []}
          blind={currentBlind}
          score={score}
          vouchers={vouchers}
          handLevels={gameState.handLevels}
        />
      </div>

      <div className={styles.mainColumn}>
        {targetConsumable && targetKind === "joker" && (
          <div className={styles.jokerTargetBanner}>
            <span>Elige un comodín para {targetConsumable.name}</span>
            <button
              type="button"
              className={styles.jokerTargetBannerCancel}
              onClick={() => setTargetConsumable(null)}
            >
              Cancelar
            </button>
          </div>
        )}

        <JokerBoard
          jokers={jokers}
          consumables={consumables}
          maxConsumableSlots={maxConsumableSlots}
          onReorder={reorderJokers}
          onUseConsumable={handleUseConsumable}
          targetJokerMode={targetKind === "joker"}
          onTargetJoker={handleTargetJoker}
          //* FIX: JokerBoard usa esto para deshabilitar (en vez de dejar
          //* "muerto") el botón de un consumible que no se puede usar ahora.
          canUseConsumable={canUseConsumable}
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
              blind={currentBlind}
              hand={hand}
              playedHandTypes={playedHandTypesThisRound}
              handsLeft={handsLeft}
              discardsLeft={discardsLeft}
              targetConsumable={targetKind === "card" ? targetConsumable : null}
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
              shopOffers={gameState.shopOffers!}
              onBuy={buyJoker}
              onBuyConsumable={buyConsumable}
              onBuyVoucher={buyVoucher}
              onSpendMoney={spendMoney}
              onAddConsumable={addConsumable}
              onReroll={rerollShop}
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
              onMenu={handleReturnToMenu}
            />
          </div>
        )}
      </div>
    </div>
  );
}
