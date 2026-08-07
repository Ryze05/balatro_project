import { useState } from "react"
import MainMenu from "../../components/MainMenu/MainMenu"
import type { GameState } from "../../types/Game"

export default function Game() {


    const [gameState, setGameState] = useState<GameState>('menu')

    if (gameState === 'menu') {
        return (
            <div>
                <MainMenu />
                {/* <button onClick={() => setGameState('playing')}>Start Game</button> */}
            </div>
        )
    }

    return (
        <div>
            <h1>Game Page</h1>
            <p>This is where the game will be played.</p>
            <p>Current state: {gameState}</p>
        </div>
    )
}