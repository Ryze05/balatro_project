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
│   ├── blinds.ts            # Niveles, blinds, bosses y sus efectos
│   ├── deck.ts              # Creación, barajado y robo de cartas
│   ├── handEvaluator.ts     # Detección de manos de poker
│   ├── joker.ts             # Catálogo y ofertas de jokers
│   ├── consumables.ts       # Tarots, planetas y cartas espectrales
│   └── score.ts             # Cálculo de chips, multiplicador y score
├── pages/
│   ├── Game/                # Pantalla principal de la partida
│   ├── Landing/             # Pantalla inicial
│   └── NotFound/            # Ruta inexistente
├── storage/
│   └── localStorage.ts      # Guardado y carga de partidas
├── types/                   # Tipos TypeScript del dominio (card, deck, game, joker, boss)
└── utils/
    └── shuffle.ts           # Utilidad genérica para barajar arrays
```

### Capas principales

- **Interfaz:** `components/` contiene los elementos visuales reutilizables y `pages/` las pantallas asociadas a rutas.
- **Estado:** `hooks/useGameState.ts` coordina el estado y las acciones de la partida.
- **Dominio:** `logic/` contiene las reglas de cartas, puntuación, blinds, jokers, consumibles y vouchers.
- **Persistencia:** `storage/localStorage.ts` guarda y recupera partidas.
- **Contexto:** `context/` comparte preferencias globales como el tema visual.

### Rutas

```text
/       Landing
/game   Partida
*       NotFound
```

`App.tsx` también monta componentes globales como `RotatePrompt` y `BackgroundMusic`.

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
- `consumables`: tarots, planetas y cartas espectrales disponibles.
- `vouchers`: vouchers comprados.
- `shopOffers`: ofertas actuales de la tienda.
- `handLevels`: niveles de cada tipo de mano.
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
- `bossIdsRemaining`: bosses que todavía no han aparecido en el ciclo actual.
- `playedHandTypesThisRound`: tipos de mano jugados en la ronda actual.

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

### Contexto del tema

El tema utiliza React Context para compartir su estado con distintos componentes sin tener que pasar props manualmente.

```text
ThemeContext      Define qué datos se pueden compartir
ThemeProvider     Contiene el estado y la lógica del tema
useTheme          Facilita el acceso al contexto
```

`ThemeContext` define el contrato de los valores compartidos:

```tsx
export interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}
```

El contexto no contiene el estado real. `ThemeProvider` lo mantiene mediante `useState` y lo proporciona a sus componentes hijos mediante `value`:

```tsx
const [theme, setTheme] = useState<ThemeId>(getStoredTheme);

return (
  <ThemeContext.Provider value={{ theme, setTheme }}>
    {children}
  </ThemeContext.Provider>
);
```

En este caso, `value` comparte el tema actual y la función para cambiarlo. El provider se monta en `main.tsx`, envolviendo toda la aplicación:

```tsx
<ThemeProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</ThemeProvider>
```

Los componentes consumidores acceden a esos valores mediante `useTheme()`:

```tsx
const { theme, setTheme } = useTheme();
```

El hook encapsula `useContext` y comprueba que se utilice dentro de `ThemeProvider`. Al cambiar el tema, el provider actualiza `data-theme` en el documento y guarda la selección en `localStorage`.

## Barajas

Las barajas están definidas en `src/types/deck.ts`:

- `Baraja Roja`: un descarte adicional por nivel.
- `Baraja Azul`: una mano adicional por nivel.
- `Baraja Amarilla`: 10 dólares adicionales al comenzar.

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

## Consumibles y Spectral Packs

El catálogo de consumibles está en `src/logic/consumables.ts` y sus tipos en `src/types/consumable.ts`.

- Los tarots pueden modificar cartas, destruirlas o dar dinero.
- Los planetas suben el nivel de un tipo de mano.
- El `Spectral Pack` ofrece 2 cartas espectrales y permite elegir 1.
- Las cartas espectrales no aparecen en las ofertas normales de consumibles.

Cartas espectrales implementadas:

- **Grim**: mejora una carta seleccionada con +20 chips permanentes.
- **Sigil**: convierte todas las cartas de la mano a un palo aleatorio.
- **Ectoplasm**: destruye el joker seleccionado.
- **Ankh**: duplica el joker seleccionado y coloca la copia junto al original.
- **The Soul**: añade un joker aleatorio gratis.

Los consumibles que requieren objetivo distinguen entre carta, joker o ningún objetivo mediante `getConsumableTargetKind`. El modo de selección se cancela al cambiar de fase sin consumir la carta.

## Bosses y sus efectos

Cada boss se define en `types/boss.ts` (`BossDefinition`) y el catálogo está en `logic/blinds.ts` (`BOSS_CATALOG`). Cada uno declara un `anteMinimo` y un `effect`:

- **The Wall**: objetivo ×2 (total ×4).
- **The Needle**: solo 1 mano.
- **The Water**: empiezas sin descartes.
- **The Manacle**: una carta menos en la mano.
- **The Hook**: descarta 2 cartas al azar cada vez que juegas una mano.
- **The Plant**: las figuras (J, Q, K) no puntúan.
- **The Goad / The Head / The Window / The Club**: un palo no puntúa.
- **The Eye**: no se puede repetir tipo de jugada en la ronda.
- **The Mouth**: solo se puede jugar el tipo de la primera mano.

Los bosses se guardan como una lista serializable en `bossIdsRemaining`.

1. Al comenzar una partida se barajan los bosses disponibles para el Ante (`anteMinimo <= level`).
2. Cada nuevo level extrae un boss de la lista.
3. El boss extraído se elimina del pool.
4. Cuando la lista queda vacía, se vuelve a barajar.

Así no se repite un boss hasta que todos los disponibles han aparecido, y los bosses de Antes altos no salen antes de tiempo. Al estar guardado como `string[]`, el pool también puede persistirse en localStorage.

## Guardado en localStorage

`src/storage/localStorage.ts` proporciona:

- `saveGame(state)`: guarda el estado como JSON.
- `loadGame()`: recupera el estado guardado.
- `clearSavedGame()`: elimina la partida guardada.
- `hasSavedGame()`: comprueba si existe una partida.

El hook guarda automáticamente cuando la fase es una fase real de partida: `blindSelect`, `playing` o `shop`. No guarda el menú, las pantallas no implementadas ni `gameover`.

Al montar `Game`, el hook intenta cargar la partida guardada. Si no existe, crea un estado inicial con `status: "menu"`. Si la partida termina, se elimina del localStorage.

## Estado actual

Implementado:

- Menú y navegación principal.
- Selección visual de baraja.
- Estado centralizado mediante `useGameState`.
- Guardado y carga con localStorage.
- Generación de niveles y blinds.
- Bosses aleatorios sin repetición, con efectos propios y filtrado por Ante.
- Creación, selección, juego y descarte de cartas.
- Evaluación de manos de poker.
- Cálculo de score con jokers.
- Cálculo de score con cartas debuffeadas por el Boss.
- Tienda con ofertas y compra de jokers.
- Tarots, planetas y Spectral Packs con selección de cartas.
- Efectos espectrales sobre cartas, jokers y la mano completa.
- Selección de objetivos para consumibles y duplicación ordenada de jokers.
- Bonuses iniciales de las barajas Red, Blue y Yellow.

Pendiente o simplificado:

- La lista de bosses es reducida respecto al juego original.
- Los niveles Endless posteriores al 12 utilizan una aproximación.
- Las pantallas de Rules y Options todavía no tienen una vista propia.
- La rotación aleatoria de packs de la tienda todavía está pendiente.
- Faltan tests automatizados.

## Verificación actual

La build y el análisis estático se ejecutan correctamente:

```bash
npm run build
npm run lint
```

Actualmente no existe una suite de tests automatizados.
