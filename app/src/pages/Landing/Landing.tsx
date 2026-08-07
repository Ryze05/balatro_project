import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div>
      <h1>Welcome to the Balatro Clone Game</h1>
      <p>A poker and deck-building game.</p>
      <Link to="/play">
        <button>
          Jugar Partida
        </button>
      </Link>
    </div>
  )
}