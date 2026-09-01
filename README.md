# Balatro Web Clone

Clon web de Balatro desarrollado con React, TypeScript y Vite. El proyecto reproduce la estructura básica de una partida de Balatro: selección de baraja, niveles, blinds, juego de manos de poker, tienda y jokers.

## Tecnologías

- React 19
- TypeScript
- Vite
- React Router
- CSS Modules

## Instalación

Desde el directorio `app`:

```bash
npm install
```

## Scripts

```bash
npm run dev       # inicia el servidor de desarrollo
npm run build     # comprueba TypeScript y genera la build de producción
npm run preview   # sirve localmente la build generada
npm run lint      # ejecuta ESLint
```

La aplicación se puede abrir en:

```text
http://localhost:5173
```

La pantalla de juego está disponible en `/game`.

## Estructura del proyecto

```text
src/
├── components/              # Componentes visuales reutilizables
│   ├── BlindSelect/         # Selección de Small, Big y Boss Blind
│   ├── DeckSelectPanel/     # Selección de baraja
│   ├── MainMenu/            # Menú principal
│   ├── RoundPanel/          # Mesa, mano y acciones del jugador
│   └── Shop/                # Tienda y ofertas de jokers
├── hooks/
│   └── useGameState.ts      # Estado y acciones principales de la partida
├── logic/                   # Reglas del dominio del juego
│   ├── blinds.ts            # Niveles, blinds y bosses
│   ├── deck.ts              # Creación, barajado y robo de cartas
│   ├── handEvaluator.ts     # Detección de manos de poker
│   ├── joker.ts             # Catálogo y ofertas de jokers
│   └── score.ts             # Cálculo de chips, multiplicador y score
├── pages/
│   ├── Game/                # Pantalla principal de la partida
│   ├── Landing/             # Pantalla inicial
│   └── NotFound/            # Ruta inexistente
├── storage/
│   └── localStorage.ts      # Guardado y carga de partidas
├── types/                   # Tipos TypeScript del dominio
└── utils/
    └── shuffle.ts           # Utilidad genérica para barajar arrays
```

## Flujo de una partida

```text
Landing
  ↓
Menú principal
  ↓
Elegir baraja
  ↓
Seleccionar Blind
  ↓
Jugar manos y descartar cartas
  ↓
Ganar el Blind
  ↓
Tienda: comprar jokers
  ↓
Siguiente Blind o siguiente Level
```

### Levels y Blinds

Un `Level` representa un Ante de Balatro. Cada level contiene tres blinds:

1. `Small Blind`: objetivo base, se puede saltar.
2. `Big Blind`: objetivo de `1.5x`, se puede saltar.
3. `Boss Blind`: objetivo de `2x`, no se puede saltar y tiene un nombre de boss.

La tabla de objetivos de la partida normal usa los valores de Balatro White Stake:

```text
Level 1: 300 / 450 / 600
Level 2: 800 / 1200 / 1600
Level 3: 2000 / 3000 / 4000
Level 4: 5000 / 7500 / 10000
Level 5: 11000 / 16500 / 22000
Level 6: 20000 / 30000 / 40000
Level 7: 35000 / 52500 / 70000
Level 8: 50000 / 75000 / 100000
```

Los niveles 9 a 12 tienen valores de Endless definidos. A partir del nivel 13 se utiliza una extrapolación aproximada.

## Estado del juego

El tipo `GameState` (`src/types/game.ts`) contiene toda la información necesaria para continuar una partida:

- `deck`: cartas que quedan en el mazo.
- `hand`: cartas que tiene el jugador.
- `discardPile`: cartas jugadas o descartadas.
- `jokers`: jokers comprados.
- `deckId`: baraja elegida.
- `level`: nivel/Ante actual.
- `blinds`: los tres blinds del nivel actual.
- `blindIndex`: índice del blind actual.
- `currentBlind`: blind que se está enfrentando.
- `handsLeft`: manos disponibles.
- `discardsLeft`: descartes disponibles.
- `money`: dinero del jugador.
- `score`: puntuación acumulada contra el blind actual.
- `status`: pantalla o fase actual.
- `bossNamesRemaining`: bosses que todavía no han aparecido en el ciclo actual.

## Hook `useGameState`

`src/hooks/useGameState.ts` centraliza el estado y las acciones del juego. `Game.tsx` lo utiliza así:

```tsx
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
```

El hook devuelve dos tipos de datos:

- `gameState`: datos que la interfaz debe mostrar.
- Funciones de acción: callbacks que la interfaz llama cuando el usuario interactúa.

Los componentes no modifican el estado directamente. Por ejemplo, `RoundPanel` recibe `onPlayHand={playHand}` y llama esa función al pulsar el botón. El hook actualiza el estado, React vuelve a renderizar la interfaz y el componente recibe los datos actualizados.

## Barajas

Las barajas están definidas en `src/types/deck.ts`:

- `Red Deck`: una descarte adicional por nivel.
- `Blue Deck`: una mano adicional por nivel.
- `Yellow Deck`: 10 dólares adicionales al comenzar.

La selección visual se realiza en `DeckSelectPanel`. El `deckId` llega a `startNewGame`, donde se aplican sus bonuses al estado inicial.

## Cartas y puntuación

`logic/deck.ts` crea una baraja de 52 cartas, la baraja y permite robar cartas.

`logic/handEvaluator.ts` recibe las cartas seleccionadas y devuelve:

```ts
{
  handType: HandType;
  scoringCards: Card[];
}
```

`scoringCards` contiene solo las cartas que forman la mano que puntúa. Por ejemplo, en un par contiene las dos cartas del par; en una escalera contiene las cinco cartas de la escalera.

La puntuación utiliza la fórmula:

```text
(chips base de la mano + chips de las cartas) × multiplicador
```

Los jokers pueden añadir chips, añadir multiplicador o multiplicar el multiplicador.

## Jokers

El catálogo está en `src/logic/joker.ts`.

- `getShopJokers(count)`: baraja el catálogo y devuelve ofertas aleatorias.
- `getJokerById(id)`: busca un joker por su id fijo.
- Cada joker tiene un id estable, precio, rareza y efecto.

La tienda muestra ofertas reales y permite comprar si el jugador tiene suficiente dinero. Al comprar, el joker se añade a `gameState.jokers` y el precio se resta de `gameState.money`.

## Bosses sin repetición

Los bosses se guardan como una lista serializable en `bossNamesRemaining`.

1. Al comenzar una partida se baraja la lista de bosses.
2. Cada nuevo level extrae un boss de la lista.
3. El boss extraído se elimina del pool.
4. Cuando la lista queda vacía, se vuelve a barajar.

Así no se repite un boss hasta que todos los bosses disponibles han aparecido. Al estar guardado como `string[]`, el pool también puede persistirse en localStorage.

## Guardado en localStorage

`src/storage/localStorage.ts` proporciona:

- `saveGame(state)`: guarda el estado como JSON.
- `loadGame()`: recupera el estado guardado.
- `clearSavedGame()`: elimina la partida guardada.
- `hasSavedGame()`: comprueba si existe una partida.

El hook guarda automáticamente cuando la fase es una fase real de partida: `blindSelect`, `playing` o `shop`. No guarda el menú, las pantallas no implementadas ni `gameover`.

Al montar `Game`, el hook intenta cargar la partida guardada. Si no existe, crea un estado inicial con `status: "menu"`. Si la partida termina, se elimina del localStorage.

## Despliegue en Vercel

La aplicación usa `BrowserRouter`, por lo que las rutas de React necesitan un rewrite hacia `index.html`. El proyecto incluye `vercel.json` con esta configuración:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

En Vercel, si el directorio raíz del proyecto es `app`, utiliza:

```text
Build Command: npm run build
Output Directory: dist
```

## Estado actual

Implementado:

- Menú y navegación principal.
- Selección visual de baraja.
- Estado centralizado mediante `useGameState`.
- Guardado y carga con localStorage.
- Generación de niveles y blinds.
- Bosses aleatorios sin repetición dentro de cada ciclo.
- Creación, selección, juego y descarte de cartas.
- Evaluación de manos de poker.
- Cálculo de score con jokers.
- Tienda con ofertas y compra de jokers.
- Bonuses iniciales de las barajas Red, Blue y Yellow.

Pendiente o simplificado:

- Los efectos especiales de los Boss Blinds todavía son placeholders.
- La lista de bosses es reducida respecto al juego original.
- Los niveles Endless posteriores al 12 utilizan una aproximación.
- Las pantallas de Rules y Options todavía no tienen una vista propia.
- Faltan tests automatizados.
