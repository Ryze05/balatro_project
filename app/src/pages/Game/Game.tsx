import { useState } from "react";
import type { Blind, GamePhase, MenuOption } from "../../types/game";
import MainMenu from "../../components/MainMenu/MainMenu";
import BlindSelect from "../../components/BlindSelect/BlindSelect";
import RoundPanel from "../../components/RoundPanel/RoundPanel";
import Shop from "../../components/Shop/Shop";
import { generateBlindsForAnte } from "../../lib/blinds";


export default function Game() {
    const [phase, setPhase] = useState<GamePhase>("menu");

    const [ante, setAnte] = useState(1);
    const [blinds, setBlinds] = useState<Blind[]>([]);
    const [blindIndex, setBlindIndex] = useState(0);

    const currentBlind = blinds[blindIndex];

    // --- Menu -> Blind Select -------------------------------------------------
    const handleMenuSelect = (option: MenuOption, _deckId?: string): void => {
        // _deckId: chosen deck from DeckSelectPanel, not wired in yet.
        if (option !== "play") return;
        setAnte(1);
        setBlinds(generateBlindsForAnte(1));
        setBlindIndex(0);
        setPhase("blindSelect");
    };

    // Shared step used both by "skip" and by "continue" after the shop.
    const advanceToNextBlind = (): void => {
        const nextIndexRaw = blindIndex + 1;
        if (nextIndexRaw >= blinds.length) {
            const nextAnte = ante + 1;
            setAnte(nextAnte);
            setBlinds(generateBlindsForAnte(nextAnte));
            setBlindIndex(0);
        } else {
            setBlindIndex(nextIndexRaw);
        }
        setPhase("blindSelect");
    };

    // --- Blind Select ----------------------------------------------------------
    const handlePlayBlind = (_blind: Blind): void => {
        setPhase("playing");
    };

    const handleSkip = (blind: Blind): void => {
        if (!blind.skippable) return;
        advanceToNextBlind(); // skip never goes through the shop
    };

    // --- Playing -> Shop / Game Over -------------------------------------------
    const handleWin = (): void => {
        setPhase("shop");
    };

    const handleLose = (): void => {
        setPhase("gameover");
    };

    // --- Shop -> Blind Select ----------------------------------------------------
    const handleShopContinue = (): void => {
        advanceToNextBlind();
    };

    // --- Render ----------------------------------------------------------------
    if (phase === "menu") {
        return (
            <div>
                <MainMenu onSelect={handleMenuSelect} />
            </div>
        );
    }

    if (phase === "blindSelect") {
        return (
            <BlindSelect ante={ante} blinds={blinds} blindIndex={blindIndex} onPlay={handlePlayBlind} onSkip={handleSkip} />
        );
    }

    if (phase === "playing" && currentBlind) {
        return <RoundPanel blind={currentBlind} ante={ante} onWin={handleWin} onLose={handleLose} />;
    }

    if (phase === "shop") {
        return <Shop onContinue={handleShopContinue} />;
    }

    if (phase === "gameover") {
        return (
            <div>
                <h1>Game Over</h1>
                <p>You reached Ante {ante}.</p>
                <button onClick={() => setPhase("menu")}>Back to Menu</button>
            </div>
        );
    }

    return null;
}
