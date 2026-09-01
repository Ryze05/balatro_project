import type { MenuOption } from "../../types/game";
import type { DeckId } from "../../types/deck";
import MainMenu from "../../components/MainMenu/MainMenu";
import BlindSelect from "../../components/BlindSelect/BlindSelect";
import RoundPanel from "../../components/RoundPanel/RoundPanel";
import Shop from "../../components/Shop/Shop";
import { useGameState } from "../../hooks/useGameState";

export default function Game() {
  const {
    gameState,
    startNewGame,
    selectCard,
    playHand,
    discardCards,
    buyJoker,
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
    status,
  } = gameState;

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

  if (status === "blindSelect") {
    return (
      <BlindSelect
        level={level}
        blinds={blinds}
        blindIndex={blindIndex}
        onPlay={() => setGamePhase("playing")}
        onSkip={advanceToNextBlind}
      />
    );
  }

  if (status === "playing" && currentBlind) {
    return (
      <RoundPanel
        blind={currentBlind}
        level={level}
        hand={hand}
        handsLeft={handsLeft}
        discardsLeft={discardsLeft}
        score={score}
        onToggleCard={selectCard}
        onPlayHand={playHand}
        onDiscard={discardCards}
      />
    );
  }

  if (status === "shop") {
    return (
      <Shop
        money={money}
        onBuy={buyJoker}
        onContinue={advanceToNextBlind}
      />
    );
  }

  if (status === "gameover") {
    return (
      <div>
        <h1>Game Over</h1>
        <p>You reached Level {level}.</p>
        <button onClick={() => setGamePhase("menu")}>Back to Menu</button>
      </div>
    );
  }

  return null;
}