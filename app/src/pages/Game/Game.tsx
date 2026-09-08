import type { MenuOption } from "../../types/game";
import type { DeckId } from "../../types/deck";
import MainMenu from "../../components/MainMenu/MainMenu";
import BlindSelect from "../../components/BlindSelect/BlindSelect";
import RoundPanel from "../../components/RoundPanel/RoundPanel";
import Shop from "../../components/Shop/Shop";
import { useGameState } from "../../hooks/useGameState";
import styles from "./Game.module.css";
import JokerSidebar from "../../components/JokerSideBar/JokerSidebar";

export default function Game() {
  const {
    gameState,
    startNewGame,
    selectCard,
    playHand,
    discardCards,
    buyJoker,
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

  // A partir de aquí ya hay una partida en curso: mostramos el
  // layout de dos columnas con el sidebar de dinero + comodines.
  // El sidebar también muestra ahora el marcador de puntuación del
  // blind actual (puntos / objetivo), estilo Balatro.
  return (
    <div className={styles.layout}>
      <div className={styles.sidebarColumn}>
        <JokerSidebar
          money={money}
          jokers={jokers}
          onReorder={reorderJokers}
          blind={currentBlind}
          score={score}
        />
      </div>

      <div className={styles.mainColumn}>
        {status === "blindSelect" && (
          <BlindSelect
            level={level}
            blinds={blinds}
            blindIndex={blindIndex}
            onPlay={() => setGamePhase("playing")}
            onSkip={advanceToNextBlind}
          />
        )}

        {status === "playing" && currentBlind && (
          <RoundPanel
            blind={currentBlind}
            level={level}
            hand={hand}
            jokers={jokers}
            handsLeft={handsLeft}
            discardsLeft={discardsLeft}
            onToggleCard={selectCard}
            onPlayHand={playHand}
            onDiscard={discardCards}
          />
        )}

        {status === "shop" && (
          <Shop money={money} onBuy={buyJoker} onContinue={advanceToNextBlind} />
        )}

        {status === "gameover" && (
          <div>
            <h1>Game Over</h1>
            <p>You reached Level {level}.</p>
            <button onClick={() => setGamePhase("menu")}>Back to Menu</button>
          </div>
        )}
      </div>
    </div>
  );
}
