/*
 * Pooh's Honey Kitchen - Game Engine
 * Core game logic: reducer, collision, interactions, cooking, serving.
 *
 * CONTROLS v2:
 *   Arrow keys = movement
 *   D = pick up / place items (PICKUP)
 *   W = actions: chop, wash (ACTION)
 *   ESC = pause
 */

import {
  CRATE_INGREDIENTS,
  CRATE_TILE_COUNT,
  DIFFICULTY_CONFIGS,
  GAME_CONFIG,
  INGREDIENTS,
  MAP_COLS,
  MAP_LAYOUT,
  MAP_ROWS,
  POOH_QUOTES,
  RECIPES,
  TILE,
  TILE_SIZE,
} from "./gameConstants";
import type { Difficulty, IngredientState } from "./gameConstants";
import type {
  GameAction,
  GameState,
  HeldIngredient,
  HeldPlate,
  Order,
  Player,
  StationState,
} from "./gameTypes";

// ─── HELPERS ────────────────────────────────────────────────
let orderIdCounter = 0;
function genOrderId() {
  return `order_${++orderIdCounter}`;
}

function randomQuote(): string {
  return POOH_QUOTES[Math.floor(Math.random() * POOH_QUOTES.length)];
}

function randomRecipe(excludeFruitCake = true) {
  const pool = excludeFruitCake ? RECIPES.filter(r => r.name !== "Fruit Cake") : RECIPES;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getScaledOrderTime(recipe: (typeof RECIPES)[number], difficulty: Difficulty): number {
  const scale = DIFFICULTY_CONFIGS[difficulty].orderTimeScale;
  return Math.round(recipe.timeLimit * scale);
}

function createOrder(recipe: (typeof RECIPES)[number], difficulty: Difficulty): Order {
  const scaledTime = getScaledOrderTime(recipe, difficulty);
  return {
    id: genOrderId(),
    recipe,
    timeRemaining: scaledTime,
    maxTime: scaledTime,
  };
}

// ─── MAP HELPERS ────────────────────────────────────────────
export function getTile(row: number, col: number): number {
  if (row < 0 || row >= MAP_ROWS || col < 0 || col >= MAP_COLS) return TILE.WALL;
  return MAP_LAYOUT[row][col];
}

export function isWalkable(row: number, col: number): boolean {
  const tile = getTile(row, col);
  return tile === TILE.FLOOR;
}

export function pixelToTile(px: number): number {
  return Math.floor(px / TILE_SIZE);
}

export function tileToPixel(tile: number): number {
  return tile * TILE_SIZE + TILE_SIZE / 2;
}

// ─── FIND STATIONS ──────────────────────────────────────────
function findStations(): StationState[] {
  const stations: StationState[] = [];
  let crateIdx = 0;
  for (let r = 0; r < MAP_ROWS; r++) {
    for (let c = 0; c < MAP_COLS; c++) {
      const t = MAP_LAYOUT[r][c];
      if (t !== TILE.FLOOR && t !== TILE.WALL) {
        stations.push({
          row: r,
          col: c,
          tileType: t,
          item: null,
          cookProgress: 0,
          isCooking: false,
          isBurning: false,
          chopProgress: 0,
          isChopping: false,
          washProgress: 0,
          isWashing: false,
          crateIndex: t === TILE.CRATE ? crateIdx++ : 0,
        });
      }
    }
  }
  return stations;
}

// ─── INITIAL STATE ──────────────────────────────────────────
export function createInitialState(): GameState {
  const highScore = parseInt(localStorage.getItem("pooh_highscore") || "0", 10);
  return {
    screen: "title",
    player: {
      x: tileToPixel(9),
      y: tileToPixel(11),
      direction: "down",
      holding: null,
      isInteracting: false,
      interactionProgress: 0,
      interactionType: null,
    },
    stations: findStations(),
    orders: [],
    score: 0,
    timeRemaining: GAME_CONFIG.GAME_DURATION,
    elapsedTime: 0,
    cleanPlates: GAME_CONFIG.INITIAL_CLEAN_PLATES,
    dirtyPlatesTimer: [],
    combo: 0,
    // Sentinel: very high so combo expiry never fires until first serve.
    lastServeTick: 0,
    message: null,
    messageTimer: 0,
    isPaused: false,
    highScore,
    fruitCakeSpawned: false,
    difficulty: "medium",
  };
}

// ─── COLLISION CHECK ────────────────────────────────────────
function canMoveTo(x: number, y: number): boolean {
  const halfSize = 14; // player collision box half-size
  const corners = [
    { r: pixelToTile(y - halfSize), c: pixelToTile(x - halfSize) },
    { r: pixelToTile(y - halfSize), c: pixelToTile(x + halfSize) },
    { r: pixelToTile(y + halfSize), c: pixelToTile(x - halfSize) },
    { r: pixelToTile(y + halfSize), c: pixelToTile(x + halfSize) },
  ];
  return corners.every(({ r, c }) => isWalkable(r, c));
}

// ─── FIND NEAREST STATION ───────────────────────────────────
function findNearestStation(
  player: Player,
  stations: StationState[],
  filter?: number
): StationState | null {
  const pr = player.y / TILE_SIZE;
  const pc = player.x / TILE_SIZE;
  let best: StationState | null = null;
  let bestDist = GAME_CONFIG.INTERACTION_RANGE;

  for (const s of stations) {
    if (filter !== undefined && s.tileType !== filter) continue;
    const sr = s.row + 0.5;
    const sc = s.col + 0.5;
    const dist = Math.sqrt((pr - sr) ** 2 + (pc - sc) ** 2);
    if (dist < bestDist) {
      bestDist = dist;
      best = s;
    }
  }
  return best;
}

// ─── CHECK RECIPE MATCH ─────────────────────────────────────
function checkRecipeMatch(plate: HeldPlate, order: Order): boolean {
  const required = order.recipe.ingredients;
  const have = plate.contents;
  if (have.length !== required.length) return false;
  const reqSorted = [...required].sort((a, b) => a.name.localeCompare(b.name));
  const haveSorted = [...have].sort((a, b) => a.name.localeCompare(b.name));
  return reqSorted.every(
    (r, i) => r.name === haveSorted[i].name && r.state === haveSorted[i].state
  );
}

// ─── GET CRATE INGREDIENTS (stable per-crate assignment) ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// Every ingredient must remain available at all times. Orders never affect crate contents.
function assertCrateCapacity(crateCount: number): void {
  if (crateCount < CRATE_INGREDIENTS.length) {
    throw new Error(
      `Map has ${crateCount} ingredient crates, but ${CRATE_INGREDIENTS.length} ingredients must be available.`,
    );
  }
}

export function getVisibleCrateIngredients(
  state: Pick<GameState, "orders" | "stations">
): string[] {
  const crateCount = state.stations.filter((s) => s.tileType === TILE.CRATE).length;
  assertCrateCapacity(crateCount);
  return [...CRATE_INGREDIENTS];
}

export function getVisibleCrateIngredient(
  _state: Pick<GameState, "orders" | "stations">,
  crateIndex: number
): string {
  assertCrateCapacity(CRATE_TILE_COUNT);
  return CRATE_INGREDIENTS[crateIndex] ?? "honey";
}

// ─── GAME REDUCER ───────────────────────────────────────────
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      orderIdCounter = 0;
      const difficulty = action.difficulty || "medium";
      const config = DIFFICULTY_CONFIGS[difficulty];
      const fresh = createInitialState();
      fresh.screen = "playing";
      fresh.difficulty = difficulty;
      fresh.timeRemaining = config.gameDuration;
      fresh.cleanPlates = config.initialCleanPlates;
      fresh.orders = [
        createOrder(RECIPES[0], difficulty),
        createOrder(RECIPES[3], difficulty),
      ];
      fresh.message = "Welcome to Pooh's Kitchen! D = pick/place, W = chop/wash. Cook fast!";
      fresh.messageTimer = 4;
      return fresh;
    }

    case "RESTART_GAME": {
      orderIdCounter = 0;
      const config = DIFFICULTY_CONFIGS[state.difficulty];
      const fresh = createInitialState();
      fresh.screen = "playing";
      fresh.difficulty = state.difficulty;
      fresh.highScore = state.highScore;
      fresh.timeRemaining = config.gameDuration;
      fresh.cleanPlates = config.initialCleanPlates;
      fresh.orders = [
        createOrder(RECIPES[0], state.difficulty),
        createOrder(RECIPES[3], state.difficulty),
      ];
      fresh.message = "Restarting! Let's go, Pooh!";
      fresh.messageTimer = 3;
      return fresh;
    }

    case "END_GAME": {
      if (state.score > state.highScore) {
        localStorage.setItem("pooh_highscore", String(state.score));
      }
      return {
        ...state,
        screen: "gameover",
        isPaused: false,
        highScore: Math.max(state.highScore, state.score),
      };
    }

    case "SHOW_INSTRUCTIONS":
      return { ...state, screen: "instructions" };

    case "BACK_TO_TITLE":
      return { ...state, screen: "title" };

    case "TOGGLE_PAUSE":
      return { ...state, isPaused: !state.isPaused };

    case "DISMISS_MESSAGE":
      return { ...state, message: null, messageTimer: 0 };

    // ─── MOVEMENT (Arrow keys only now) ───────────────────
    case "MOVE": {
      if (state.screen !== "playing" || state.isPaused) return state;
      if (state.player.isInteracting) return state;

      const speed = GAME_CONFIG.PLAYER_SPEED;
      const dx = action.dx * speed;
      const dy = action.dy * speed;
      let newX = state.player.x + dx;
      let newY = state.player.y + dy;

      // Try full movement first
      if (!canMoveTo(newX, newY)) {
        // Try sliding along axes
        if (canMoveTo(newX, state.player.y)) {
          newY = state.player.y;
        } else if (canMoveTo(state.player.x, newY)) {
          newX = state.player.x;
        } else {
          return state;
        }
      }

      let dir = state.player.direction;
      if (action.dy < 0) dir = "up";
      else if (action.dy > 0) dir = "down";
      else if (action.dx < 0) dir = "left";
      else if (action.dx > 0) dir = "right";

      return {
        ...state,
        player: { ...state.player, x: newX, y: newY, direction: dir },
      };
    }

    // ─── PICKUP (D key) - Pick up / Place items ───────────
    case "PICKUP":
    case "INTERACT": {
      if (state.screen !== "playing" || state.isPaused) return state;

      const player = state.player;
      const station = findNearestStation(player, state.stations);

      if (!station) {
        // Holding something but not adjacent to a station: do NOT silently destroy
        // the item. Just hint the player to find a station. This protects players
        // from losing half-built plates to a stray keypress.
        if (player.holding) {
          return {
            ...state,
            message: "Find a station to place this!",
            messageTimer: 1.5,
          };
        }
        return state;
      }

      const newStations = state.stations.map((s) =>
        s.row === station.row && s.col === station.col ? { ...s } : s
      );
      const stationRef = newStations.find(
        (s) => s.row === station.row && s.col === station.col
      )!;

      // ── CRATE: Pick up ingredient from permanent crate assignment ──
      if (station.tileType === TILE.CRATE) {
        const pick = getVisibleCrateIngredient(state, station.crateIndex);
        const ing = INGREDIENTS[pick];
        if (!ing) return state;

        // If holding a plate, add this ingredient (raw) directly to the plate,
        // but only when at least one active order wants this ingredient in raw state.
        // This lets the player assemble multi-ingredient recipes (e.g. bread + honey)
        // without dropping the plate, while preventing accidental adds of items
        // that still need to be cooked or chopped (e.g. raw bread, raw meat).
        if (player.holding && player.holding.type === "plate") {
          const plate = player.holding as HeldPlate;
          if (plate.dirty) {
            return {
              ...state,
              message: "Can't add ingredients to a dirty plate!",
              messageTimer: 2,
            };
          }
          const wantedRaw = state.orders.some((o) =>
            o.recipe.ingredients.some(
              (req) => req.name === pick && req.state === "raw"
            )
          );
          if (!wantedRaw) {
            const needsCook = ing.requiresCooking ? " Cook it first!" : "";
            const needsChop = ing.requiresChopping ? " Chop it first!" : "";
            return {
              ...state,
              message: `${ing.label} ${ing.emoji} can't go on the plate raw.${needsCook}${needsChop}`,
              messageTimer: 2,
            };
          }
          const rawItem: HeldIngredient = {
            type: "ingredient",
            name: pick,
            emoji: ing.emoji,
            state: "raw",
          };
          const newPlate: HeldPlate = {
            ...plate,
            contents: [...plate.contents, rawItem],
          };
          return {
            ...state,
            stations: newStations,
            player: { ...player, holding: newPlate },
            message: `Added ${ing.label} ${ing.emoji} to plate!`,
            messageTimer: 1.5,
          };
        }

        // Already holding an ingredient: can't pick another one up bare-handed.
        if (player.holding) {
          return {
            ...state,
            message: "Hands full! Drop or place your item first.",
            messageTimer: 2,
          };
        }

        const item: HeldIngredient = {
          type: "ingredient",
          name: pick,
          emoji: ing.emoji,
          state: "raw",
        };
        return {
          ...state,
          stations: newStations,
          player: { ...player, holding: item },
          message: `Picked up ${ing.label} ${ing.emoji}`,
          messageTimer: 1.5,
        };
      }

      // ── PLATE STACK: Pick up clean plate ──
      if (station.tileType === TILE.PLATE_STACK) {
        if (player.holding) {
          // If holding ingredient, place on a plate
          if (player.holding.type === "ingredient") {
            if (state.cleanPlates <= 0) {
              return {
                ...state,
                message: "No clean plates! Wash some at the sink.",
                messageTimer: 2,
              };
            }
            const plate: HeldPlate = {
              type: "plate",
              contents: [player.holding as HeldIngredient],
              dirty: false,
            };
            return {
              ...state,
              player: { ...player, holding: plate },
              cleanPlates: state.cleanPlates - 1,
              message: `Plated ${(player.holding as HeldIngredient).emoji}`,
              messageTimer: 1.5,
            };
          }
          return state;
        }
        if (state.cleanPlates <= 0) {
          return {
            ...state,
            message: "No clean plates! Wash some at the sink.",
            messageTimer: 2,
          };
        }
        const plate: HeldPlate = { type: "plate", contents: [], dirty: false };
        return {
          ...state,
          player: { ...player, holding: plate },
          cleanPlates: state.cleanPlates - 1,
          message: "Picked up a clean plate 🍽️",
          messageTimer: 1.5,
        };
      }

      // ── CHOPPING BOARD: Place ingredient / pick up / add chopped to plate ──
      if (station.tileType === TILE.CHOPPING) {
        // If holding a clean plate, try to add the chopped item to the plate.
        if (player.holding && player.holding.type === "plate") {
          const plate = player.holding as HeldPlate;
          if (plate.dirty) {
            return {
              ...state,
              message: "Can't add to a dirty plate!",
              messageTimer: 2,
            };
          }
          if (!stationRef.item) {
            return {
              ...state,
              message: "Nothing on the board to add.",
              messageTimer: 1.5,
            };
          }
          if (stationRef.isChopping) {
            return {
              ...state,
              message: "Still chopping... wait!",
              messageTimer: 1.5,
            };
          }
          const ing = stationRef.item as HeldIngredient;
          if (ing.state !== "chopped") {
            return {
              ...state,
              message: "Press W to chop it first!",
              messageTimer: 2,
            };
          }
          const newPlate: HeldPlate = {
            ...plate,
            contents: [...plate.contents, ing],
          };
          stationRef.item = null;
          return {
            ...state,
            stations: newStations,
            player: { ...player, holding: newPlate },
            message: `Added chopped ${ing.emoji} to plate!`,
            messageTimer: 1.5,
          };
        }
        // Place ingredient on board (D = place)
        if (player.holding && player.holding.type === "ingredient") {
          const ing = player.holding as HeldIngredient;
          if (!INGREDIENTS[ing.name]?.requiresChopping) {
            return {
              ...state,
              message: `${ing.emoji} doesn't need chopping!`,
              messageTimer: 2,
            };
          }
          if (ing.state !== "raw") {
            return {
              ...state,
              message: `Already processed!`,
              messageTimer: 2,
            };
          }
          if (stationRef.item) {
            return {
              ...state,
              message: "Board is occupied!",
              messageTimer: 2,
            };
          }
          stationRef.item = ing;
          return {
            ...state,
            stations: newStations,
            player: { ...player, holding: null },
            message: `Placed ${ing.emoji} on board. Press W to chop!`,
            messageTimer: 2,
          };
        }
        // Pick up item from board (D = pick up)
        if (stationRef.item && !player.holding && !stationRef.isChopping) {
          const item = stationRef.item;
          stationRef.item = null;
          return {
            ...state,
            stations: newStations,
            player: { ...player, holding: item },
            message: `Picked up ${(item as HeldIngredient).emoji}`,
            messageTimer: 1.5,
          };
        }
        return state;
      }

      // ── STOVE: Place ingredient / pick up / add cooked to plate ──
      if (station.tileType === TILE.STOVE) {
        // If holding a clean plate, try to add the cooked item to the plate.
        if (player.holding && player.holding.type === "plate") {
          const plate = player.holding as HeldPlate;
          if (plate.dirty) {
            return {
              ...state,
              message: "Can't add to a dirty plate!",
              messageTimer: 2,
            };
          }
          if (!stationRef.item) {
            return {
              ...state,
              message: "Stove is empty.",
              messageTimer: 1.5,
            };
          }
          const ing = stationRef.item as HeldIngredient;
          if (ing.state === "burned") {
            return {
              ...state,
              message: "Burned! Trash it first.",
              messageTimer: 2,
            };
          }
          if (ing.state !== "cooked" && ing.state !== "chopped_cooked") {
            return {
              ...state,
              message: "Still cooking... wait!",
              messageTimer: 1.5,
            };
          }
          const newPlate: HeldPlate = {
            ...plate,
            contents: [...plate.contents, ing],
          };
          stationRef.item = null;
          stationRef.isCooking = false;
          stationRef.isBurning = false;
          stationRef.cookProgress = 0;
          return {
            ...state,
            stations: newStations,
            player: { ...player, holding: newPlate },
            message: `Added ${ing.emoji} to plate!`,
            messageTimer: 1.5,
          };
        }
        // Place ingredient on stove (D = place)
        if (player.holding && player.holding.type === "ingredient") {
          const ing = player.holding as HeldIngredient;
          if (!INGREDIENTS[ing.name]?.requiresCooking) {
            return {
              ...state,
              message: `${ing.emoji} doesn't need cooking!`,
              messageTimer: 2,
            };
          }
          // Block raw items that must be chopped first.
          if (INGREDIENTS[ing.name]?.requiresChopping && ing.state === "raw") {
            return {
              ...state,
              message: `Chop the ${INGREDIENTS[ing.name].label} 🔪 before cooking!`,
              messageTimer: 2,
            };
          }
          if (ing.state === "cooked" || ing.state === "chopped_cooked" || ing.state === "burned") {
            return {
              ...state,
              message: "Already cooked!",
              messageTimer: 2,
            };
          }
          if (stationRef.item) {
            return {
              ...state,
              message: "Stove is occupied!",
              messageTimer: 2,
            };
          }
          stationRef.item = ing;
          stationRef.isCooking = true;
          stationRef.cookProgress = 0;
          return {
            ...state,
            stations: newStations,
            player: { ...player, holding: null },
            message: `Cooking ${ing.emoji}... Watch the stove!`,
            messageTimer: 2,
          };
        }
        // Pick up from stove (D = pick up)
        if (stationRef.item && !player.holding) {
          const item = stationRef.item;
          const wasBurning = stationRef.isBurning;
          stationRef.item = null;
          stationRef.isCooking = false;
          stationRef.isBurning = false;
          stationRef.cookProgress = 0;
          return {
            ...state,
            stations: newStations,
            player: { ...player, holding: item },
            message: wasBurning
              ? `Grabbed burned ${(item as HeldIngredient).emoji}! 🔥`
              : `Picked up ${(item as HeldIngredient).emoji}`,
            messageTimer: 1.5,
          };
        }
        return state;
      }

      // ── SINK: Place dirty plate (D = place) ──
      if (station.tileType === TILE.SINK) {
        if (player.holding && player.holding.type === "plate" && (player.holding as HeldPlate).dirty) {
          stationRef.item = player.holding;
          return {
            ...state,
            stations: newStations,
            player: { ...player, holding: null },
            message: "Placed dirty plate. Press W to wash!",
            messageTimer: 2,
          };
        }
        // Pick up dirty plate from sink area if no plate in hand
        if (!player.holding) {
          const dirtyReady = state.dirtyPlatesTimer.filter((t) => t <= 0).length;
          if (dirtyReady > 0) {
            const newTimers = [...state.dirtyPlatesTimer];
            const idx = newTimers.findIndex((t) => t <= 0);
            if (idx >= 0) {
              newTimers.splice(idx, 1);
              const dirtyPlate: HeldPlate = { type: "plate", contents: [], dirty: true };
              return {
                ...state,
                dirtyPlatesTimer: newTimers,
                player: { ...player, holding: dirtyPlate },
                message: "Picked up dirty plate 🧽. Place at sink and press W!",
                messageTimer: 2,
              };
            }
          }
        }
        return state;
      }

      // ── SERVE: Deliver plate ──
      if (station.tileType === TILE.SERVE) {
        if (!player.holding || player.holding.type !== "plate") {
          return {
            ...state,
            message: "Need a plate with food to serve!",
            messageTimer: 2,
          };
        }
        const plate = player.holding as HeldPlate;
        if (plate.dirty) {
          return {
            ...state,
            message: "Can't serve on a dirty plate!",
            messageTimer: 2,
          };
        }
        if (plate.contents.length === 0) {
          return {
            ...state,
            message: "Plate is empty!",
            messageTimer: 2,
          };
        }

        // Check if plate matches any active order
        const matchedOrder = state.orders.find((o) => checkRecipeMatch(plate, o));
        const newOrders = matchedOrder
          ? state.orders.filter((o) => o.id !== matchedOrder.id)
          : state.orders;

        const config = DIFFICULTY_CONFIGS[state.difficulty];

        if (matchedOrder) {
          const basePoints = matchedOrder.recipe.points;
          const timeRatio = matchedOrder.timeRemaining / matchedOrder.maxTime;
          const tipBonus = timeRatio >= GAME_CONFIG.TIP_THRESHOLD ? config.tipBonus : 0;
          const newCombo = state.combo + 1;
          const comboMultiplier = Math.min(newCombo, 5);
          const totalPoints = (basePoints + tipBonus) * comboMultiplier;

          const newScore = state.score + totalPoints;
          if (newScore > state.highScore) {
            localStorage.setItem("pooh_highscore", String(newScore));
          }

          return {
            ...state,
            player: { ...player, holding: null },
            orders: newOrders,
            score: newScore,
            combo: newCombo,
            lastServeTick: state.difficulty === "easy" ? state.elapsedTime : state.timeRemaining,
            dirtyPlatesTimer: [...state.dirtyPlatesTimer, GAME_CONFIG.DIRTY_PLATE_RETURN_TIME],
            message: `Served ${matchedOrder.recipe.name}! +${totalPoints} pts ${tipBonus > 0 ? "(+ tip!)" : ""} ${newCombo > 1 ? `x${comboMultiplier} combo!` : ""}`,
            messageTimer: 3,
            highScore: Math.max(state.highScore, newScore),
          };
        } else {
          return {
            ...state,
            player: { ...player, holding: null },
            // Plate is consumed by the wrong delivery, but refund it as dirty
            // so the plate supply doesn't silently leak on every misfire.
            dirtyPlatesTimer: [...state.dirtyPlatesTimer, GAME_CONFIG.DIRTY_PLATE_RETURN_TIME],
            score: state.score + GAME_CONFIG.PENALTY_WRONG,
            combo: 0,
            message: "Wrong order! " + randomQuote(),
            messageTimer: 2,
          };
        }
      }

      // ── COUNTER: Drop or pick up plates/items ──
      if (station.tileType === TILE.COUNTER) {
        if (player.holding) {
          if (stationRef.item) {
            return {
              ...state,
              message: "Counter is occupied!",
              messageTimer: 1.5,
            };
          }
          stationRef.item = player.holding;
          return {
            ...state,
            stations: newStations,
            player: { ...player, holding: null },
            message: player.holding.type === "plate" ? "Set plate on counter." : "Set item on counter.",
            messageTimer: 1.5,
          };
        }

        if (stationRef.item) {
          const item = stationRef.item;
          stationRef.item = null;
          return {
            ...state,
            stations: newStations,
            player: { ...player, holding: item },
            message: item.type === "plate" ? "Picked up plate." : `Picked up ${(item as HeldIngredient).emoji}`,
            messageTimer: 1.5,
          };
        }

        return {
          ...state,
          message: "Counter is empty.",
          messageTimer: 1.5,
        };
      }

      // ── TRASH: Discard items (plates are refunded as dirty so we don't lose plate supply) ──
      if (station.tileType === TILE.TRASH) {
        if (player.holding) {
          // Refund plates into the dirty-plate timer so they cycle back through the sink.
          // This prevents Hard mode soft-locks where every trashed plate vanishes forever.
          const wasPlate = player.holding.type === "plate";
          return {
            ...state,
            player: { ...player, holding: null },
            dirtyPlatesTimer: wasPlate
              ? [...state.dirtyPlatesTimer, GAME_CONFIG.DIRTY_PLATE_RETURN_TIME]
              : state.dirtyPlatesTimer,
            message: wasPlate
              ? "Tossed plate 🗑️ - it'll come back dirty."
              : "Tossed in the trash 🗑️",
            messageTimer: 1.5,
          };
        }
        return state;
      }

      // (Station-specific branches above handle every "holding a plate" case
      //  with clear messages. No generic fallthrough needed.)

      return state;
    }

    // ─── ACTION (W key) - Chop / Wash ─────────────────────
    case "ACTION": {
      if (state.screen !== "playing" || state.isPaused) return state;
      if (state.player.isInteracting) return state;

      const player = state.player;
      const station = findNearestStation(player, state.stations);
      if (!station) return state;

      const newStations = state.stations.map((s) =>
        s.row === station.row && s.col === station.col ? { ...s } : s
      );
      const stationRef = newStations.find(
        (s) => s.row === station.row && s.col === station.col
      )!;

      // ── CHOPPING BOARD: Start chopping ──
      if (station.tileType === TILE.CHOPPING) {
        if (stationRef.item && stationRef.item.type === "ingredient" && !stationRef.isChopping) {
          const ing = stationRef.item as HeldIngredient;
          if (ing.state === "raw" && INGREDIENTS[ing.name]?.requiresChopping) {
            stationRef.isChopping = true;
            stationRef.chopProgress = 0;
            return {
              ...state,
              stations: newStations,
              player: {
                ...player,
                isInteracting: true,
                interactionProgress: 0,
                interactionType: "chop",
              },
              message: "Chopping... 🔪",
              messageTimer: 2,
            };
          }
        }
        return state;
      }

      // ── SINK: Start washing (with auto-load if a dirty plate is ready) ──
      if (station.tileType === TILE.SINK) {
        // Fast path: empty hands + nothing on sink + a dirty plate ready in the
        // queue → grab it onto the sink and start washing immediately. This
        // collapses the old D-D-W triple-tap into a single W press.
        if (
          !player.holding &&
          !stationRef.item &&
          state.dirtyPlatesTimer.some((t) => t <= 0)
        ) {
          const newTimers = [...state.dirtyPlatesTimer];
          const idx = newTimers.findIndex((t) => t <= 0);
          if (idx >= 0) {
            newTimers.splice(idx, 1);
            stationRef.item = { type: "plate", contents: [], dirty: true };
            stationRef.isWashing = true;
            stationRef.washProgress = 0;
            return {
              ...state,
              dirtyPlatesTimer: newTimers,
              stations: newStations,
              player: {
                ...player,
                isInteracting: true,
                interactionProgress: 0,
                interactionType: "wash",
              },
              message: "Washing plate... 🫧",
              messageTimer: 2,
            };
          }
        }
        // Standard path: an already-placed dirty plate on the sink.
        if (stationRef.item && stationRef.item.type === "plate" && (stationRef.item as HeldPlate).dirty) {
          stationRef.isWashing = true;
          stationRef.washProgress = 0;
          return {
            ...state,
            stations: newStations,
            player: {
              ...player,
              isInteracting: true,
              interactionProgress: 0,
              interactionType: "wash",
            },
            message: "Washing plate... 🫧",
            messageTimer: 2,
          };
        }
        return state;
      }

      return state;
    }

    // ─── SPAWN ORDER ────────────────────────────────
    case "SPAWN_ORDER": {
      const config = DIFFICULTY_CONFIGS[state.difficulty];

      // The fruit cake gets a guaranteed slot inside its narrow spawn window.
      // Bypass the maxOrders cap and the random-recipe path so the "final challenge"
      // is never silently skipped because the queue happened to be full.
      const fruitCakeRecipe = RECIPES.find((r) => r.name === "Fruit Cake");
      const fruitCakeRemainingThreshold = Math.round(
        config.gameDuration * (GAME_CONFIG.FRUIT_CAKE_SPAWN_TIME / GAME_CONFIG.GAME_DURATION),
      );
      const fruitCakeWindowOpen =
        !state.fruitCakeSpawned &&
        !!fruitCakeRecipe &&
        state.difficulty !== "easy" &&
        state.timeRemaining <= fruitCakeRemainingThreshold &&
        // Make sure the player gets enough time to finish it (recipe limit + small buffer).
        state.timeRemaining > getScaledOrderTime(fruitCakeRecipe, state.difficulty) - 5;

      if (fruitCakeWindowOpen && fruitCakeRecipe) {
        const newOrder = createOrder(fruitCakeRecipe, state.difficulty);
        return {
          ...state,
          orders: [...state.orders, newOrder],
          fruitCakeSpawned: true,
          message: "🎂 FRUIT CAKE ORDER! The final challenge!",
          messageTimer: 4,
        };
      }

      // Standard order spawn respects the maxOrders cap.
      if (state.orders.length >= config.maxOrders) return state;

      const recipe = randomRecipe(true);
      const newOrder = createOrder(recipe, state.difficulty);
      return {
        ...state,
        orders: [...state.orders, newOrder],
      };
    }

    // ─── GAME TICK (every second) ─────────────────────────
    case "TICK": {
      if (state.screen !== "playing" || state.isPaused) return state;

      const config = DIFFICULTY_CONFIGS[state.difficulty];
      let newState = { ...state };

      // Easy mode is untimed: count upward and only end when the player chooses End Game.
      newState.elapsedTime = state.elapsedTime + 1;
      if (state.difficulty !== "easy") {
        newState.timeRemaining = Math.max(0, state.timeRemaining - 1);
        if (newState.timeRemaining <= 0) {
          if (newState.score > newState.highScore) {
            localStorage.setItem("pooh_highscore", String(newState.score));
          }
          return {
            ...newState,
            screen: "gameover",
            highScore: Math.max(newState.highScore, newState.score),
          };
        }
      }

      // Easy mode is pressure-free: orders stay open until completed.
      if (state.difficulty !== "easy") {
        let newOrders = state.orders.map((o) => ({
          ...o,
          timeRemaining: o.timeRemaining - 1,
        }));
        // Remove expired orders with penalty
        const expired = newOrders.filter((o) => o.timeRemaining <= 0);
        if (expired.length > 0) {
          newState.score += expired.length * config.penaltyExpired;
          newState.combo = 0;
          newState.message = "Order expired! " + randomQuote();
          newState.messageTimer = 2;
        }
        newOrders = newOrders.filter((o) => o.timeRemaining > 0);
        newState.orders = newOrders;
      }

      // Update dirty plate timers
      let newDirtyTimers = state.dirtyPlatesTimer.map((t) => t - 1);
      const readyDirty = newDirtyTimers.filter((t) => t <= 0).length;
      newDirtyTimers = newDirtyTimers.filter((t) => t > 0);
      for (let i = 0; i < readyDirty; i++) {
        newDirtyTimers.push(0);
      }
      newState.dirtyPlatesTimer = newDirtyTimers;

      // Update stations (cooking progress)
      const newStations = state.stations.map((s) => {
        const ns = { ...s };

        // Stove cooking
        if (ns.isCooking && ns.item && ns.item.type === "ingredient") {
          const heldIng = ns.item as HeldIngredient;
          const ing = INGREDIENTS[heldIng.name];
          if (ing) {
            ns.cookProgress += 1;
            // Preserve chopped-ness: a chopped ingredient becomes chopped_cooked instead of plain cooked.
            const cookedTarget: IngredientState =
              heldIng.state === "chopped" ? "chopped_cooked" : "cooked";
            if (ns.cookProgress >= ing.cookTime && !ns.isBurning) {
              ns.item = {
                ...heldIng,
                state: cookedTarget,
              };
            }
            if (ns.cookProgress >= ing.cookTime + ing.burnTime) {
              ns.item = {
                ...(ns.item as HeldIngredient),
                state: "burned",
              };
              ns.isBurning = true;
            }
          }
        }

        // Chopping progress
        if (ns.isChopping && ns.item && ns.item.type === "ingredient") {
          ns.chopProgress += 1;
          if (ns.chopProgress >= GAME_CONFIG.CHOP_TIME) {
            ns.item = {
              ...(ns.item as HeldIngredient),
              state: "chopped",
            };
            ns.isChopping = false;
            ns.chopProgress = 0;
          }
        }

        // Washing progress
        if (ns.isWashing) {
          ns.washProgress += 1;
          if (ns.washProgress >= GAME_CONFIG.WASH_TIME) {
            ns.item = null;
            ns.isWashing = false;
            ns.washProgress = 0;
          }
        }

        return ns;
      });
      newState.stations = newStations;

      // Update player interaction progress
      if (state.player.isInteracting) {
        const player = { ...state.player };
        if (player.interactionType === "chop") {
          player.interactionProgress += (100 / GAME_CONFIG.CHOP_TIME);
          if (player.interactionProgress >= 100) {
            player.isInteracting = false;
            player.interactionProgress = 0;
            player.interactionType = null;
            newState.message = "Chopped! ✂️";
            newState.messageTimer = 1.5;
          }
        } else if (player.interactionType === "wash") {
          player.interactionProgress += (100 / GAME_CONFIG.WASH_TIME);
          if (player.interactionProgress >= 100) {
            player.isInteracting = false;
            player.interactionProgress = 0;
            player.interactionType = null;
            newState.cleanPlates = (newState.cleanPlates || state.cleanPlates) + 1;
            newState.message = "Plate washed! 🧼";
            newState.messageTimer = 1.5;
          }
        }
        newState.player = player;
      }

      // Decrease message timer
      if (state.messageTimer > 0) {
        newState.messageTimer = state.messageTimer - 1;
        if (newState.messageTimer <= 0) {
          newState.message = null;
        }
      }

      // Reset combo if no serve in 12 ticks (game-time, respects pause)
      const currentServeClock = state.difficulty === "easy" ? newState.elapsedTime : newState.timeRemaining;
      const serveAge = state.difficulty === "easy"
        ? currentServeClock - state.lastServeTick
        : state.lastServeTick - currentServeClock;
      if (state.combo > 0 && serveAge > 12) {
        newState.combo = 0;
      }

      return newState;
    }

    default:
      return state;
  }
}
