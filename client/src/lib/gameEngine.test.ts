import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { INGREDIENTS, RECIPES } from "./gameConstants";
import { createInitialState, gameReducer, getVisibleCrateIngredients } from "./gameEngine";
import type { GameState } from "./gameTypes";

beforeEach(() => {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function playingStateWithOrders(recipeIndexes: number[]): GameState {
  const state = createInitialState();
  return {
    ...state,
    screen: "playing",
    orders: recipeIndexes.map((recipeIndex, index) => {
      const recipe = RECIPES[recipeIndex];
      return {
        id: `order_${index}`,
        recipe,
        timeRemaining: recipe.timeLimit,
        maxTime: recipe.timeLimit,
      };
    }),
  };
}

describe("ingredient crate availability", () => {
  test("visible crate ingredients include every ingredient required by active orders", () => {
    const state = playingStateWithOrders([2, 5]);
    const visibleIngredients = new Set(getVisibleCrateIngredients(state));
    const requiredIngredients = new Set(
      state.orders.flatMap((order) =>
        order.recipe.ingredients.map((ingredient) => ingredient.name),
      ),
    );

    for (const ingredient of requiredIngredients) {
      expect(visibleIngredients.has(ingredient)).toBe(true);
    }
  });

  test("serving a matching order keeps the remaining order ingredients visible", () => {
    vi.spyOn(Date, "now").mockReturnValue(1000);
    const state = playingStateWithOrders([0, 3]);
    const servedRecipe = state.orders[0].recipe;
    const nextState = gameReducer(
      {
        ...state,
        player: {
          ...state.player,
          holding: {
            type: "plate",
            dirty: false,
            contents: servedRecipe.ingredients.map((ingredient) => ({
              type: "ingredient" as const,
              name: ingredient.name,
              emoji: "",
              state: ingredient.state,
            })),
          },
          x: 16.5 * 48,
          y: 1.5 * 48,
        },
      },
      { type: "PICKUP" },
    );

    const visibleIngredients = new Set(getVisibleCrateIngredients(nextState));
    const requiredIngredients = new Set(
      nextState.orders.flatMap((order) =>
        order.recipe.ingredients.map((ingredient) => ingredient.name),
      ),
    );

    for (const ingredient of requiredIngredients) {
      expect(visibleIngredients.has(ingredient)).toBe(true);
    }
  });

  test("holding a plate can add a raw ingredient from a crate", () => {
    const state = playingStateWithOrders([0]); // Honey Toast: bread cooked + honey raw
    const nextState = gameReducer(
      {
        ...state,
        player: {
          ...state.player,
          holding: {
            type: "plate",
            dirty: false,
            contents: [
              {
                type: "ingredient",
                name: "bread",
                emoji: "🍞",
                state: "cooked",
              },
            ],
          },
          // Crate 0 is honey (stable mapping). Position: row 10, col 1.
          x: 1.5 * 48,
          y: 10.5 * 48,
        },
      },
      { type: "PICKUP" },
    );

    expect(nextState.player.holding).toMatchObject({
      type: "plate",
      dirty: false,
      contents: [
        { type: "ingredient", name: "bread", state: "cooked" },
        { type: "ingredient", name: "honey", state: "raw" },
      ],
    });
  });
});

describe("plate refund behavior", () => {
  test("wrong serve refunds the plate as dirty so plate supply does not leak", () => {
    const state = playingStateWithOrders([1]); // Salad
    const wrongPlate = {
      type: "plate" as const,
      dirty: false,
      contents: [
        { type: "ingredient" as const, name: "honey", emoji: "🍯", state: "raw" as const },
      ],
    };
    const next = gameReducer(
      {
        ...state,
        cleanPlates: 0,
        dirtyPlatesTimer: [],
        player: {
          ...state.player,
          holding: wrongPlate,
          x: 16.5 * 48,
          y: 1.5 * 48, // at serve window
        },
      },
      { type: "PICKUP" },
    );

    // Player loses the plate and points, but the plate must come back as dirty.
    expect(next.player.holding).toBeNull();
    expect(next.dirtyPlatesTimer.length).toBe(1);
    expect(next.dirtyPlatesTimer[0]).toBeGreaterThan(0);
  });

  test("trashing a plate refunds it as dirty instead of destroying it", () => {
    const state = playingStateWithOrders([0]);
    // Trash bin is at row 10, col 19 per MAP_LAYOUT.
    const next = gameReducer(
      {
        ...state,
        dirtyPlatesTimer: [],
        player: {
          ...state.player,
          holding: { type: "plate", dirty: false, contents: [] },
          x: 19.5 * 48,
          y: 10.5 * 48,
        },
      },
      { type: "PICKUP" },
    );

    expect(next.player.holding).toBeNull();
    expect(next.dirtyPlatesTimer.length).toBe(1);
  });

  test("pressing D away from any station does NOT destroy the held item", () => {
    const state = playingStateWithOrders([0]);
    const held = {
      type: "plate" as const,
      dirty: false,
      contents: [
        { type: "ingredient" as const, name: "bread", emoji: "🍞", state: "cooked" as const },
      ],
    };
    const next = gameReducer(
      {
        ...state,
        player: {
          ...state.player,
          holding: held,
          // Standing in open floor at row 11, col 11 (away from any station).
          x: 11.5 * 48,
          y: 11.5 * 48,
        },
      },
      { type: "PICKUP" },
    );

    expect(next.player.holding).not.toBeNull();
    expect(next.player.holding).toMatchObject(held);
  });
});

describe("difficulty timing", () => {
  test("medium mode uses a 6 minute game timer and scaled order timers", () => {
    const state = gameReducer(createInitialState(), { type: "START_GAME", difficulty: "medium" });

    expect(state.timeRemaining).toBe(360);
    expect(state.orders[0].timeRemaining).toBe(Math.round(RECIPES[0].timeLimit * 2.4));
    expect(state.orders[0].maxTime).toBe(Math.round(RECIPES[0].timeLimit * 2.4));
  });

  test("hard mode uses a 4 minute game timer and scaled order timers", () => {
    const state = gameReducer(createInitialState(), { type: "START_GAME", difficulty: "hard" });

    expect(state.timeRemaining).toBe(240);
    expect(state.orders[0].timeRemaining).toBe(RECIPES[0].timeLimit * 2);
    expect(state.orders[0].maxTime).toBe(RECIPES[0].timeLimit * 2);
  });
});

describe("easy mode timing", () => {
  test("easy mode counts elapsed time without decreasing the game countdown", () => {
    const state = gameReducer(createInitialState(), { type: "START_GAME", difficulty: "easy" });
    const next = gameReducer({ ...state, timeRemaining: 1 }, { type: "TICK" });

    expect(next.screen).toBe("playing");
    expect(next.elapsedTime).toBe(1);
    expect(next.timeRemaining).toBe(1);
  });

  test("ending easy mode shows game over while preserving elapsed time", () => {
    const state = gameReducer(createInitialState(), { type: "START_GAME", difficulty: "easy" });
    const next = gameReducer({ ...state, elapsedTime: 123, score: 50 }, { type: "END_GAME" });

    expect(next.screen).toBe("gameover");
    expect(next.elapsedTime).toBe(123);
    expect(next.score).toBe(50);
  });
});

describe("counter stations", () => {
  test("holding a food plate can place it on a counter", () => {
    const state = playingStateWithOrders([0]);
    const held = {
      type: "plate" as const,
      dirty: false,
      contents: [
        { type: "ingredient" as const, name: "bread", emoji: "🍞", state: "cooked" as const },
      ],
    };

    const next = gameReducer(
      {
        ...state,
        player: {
          ...state.player,
          holding: held,
          // Counter at row 2, col 9.
          x: 8.5 * 48,
          y: 2.5 * 48,
        },
      },
      { type: "PICKUP" },
    );

    expect(next.player.holding).toBeNull();
    const counter = next.stations.find((s) => s.row === 2 && s.col === 9);
    expect(counter?.item).toMatchObject(held);
  });

  test("empty hands can pick up a plate from a counter", () => {
    const state = playingStateWithOrders([0]);
    const held = {
      type: "plate" as const,
      dirty: false,
      contents: [
        { type: "ingredient" as const, name: "honey", emoji: "🍯", state: "raw" as const },
      ],
    };
    const counterIndex = state.stations.findIndex((s) => s.row === 2 && s.col === 9);
    const stations = state.stations.map((s, index) =>
      index === counterIndex ? { ...s, item: held } : s,
    );

    const next = gameReducer(
      {
        ...state,
        stations,
        player: {
          ...state.player,
          holding: null,
          x: 8.5 * 48,
          y: 2.5 * 48,
        },
      },
      { type: "PICKUP" },
    );

    expect(next.player.holding).toMatchObject(held);
    const counter = next.stations.find((s) => s.row === 2 && s.col === 9);
    expect(counter?.item).toBeNull();
  });
});

describe("stove gating", () => {
  test("stove rejects a raw ingredient that still needs chopping", () => {
    // Use Carrot Soup (recipeIndex 4) so an order requires chopped_cooked carrot.
    const state = playingStateWithOrders([4]);
    const next = gameReducer(
      {
        ...state,
        player: {
          ...state.player,
          holding: { type: "ingredient", name: "carrot", emoji: "🥕", state: "raw" },
          // Stove at row 1, col 1.
          x: 1.5 * 48,
          y: 2.5 * 48, // approach from below
        },
      },
      { type: "PICKUP" },
    );

    // Carrot still in hand; nothing placed on stove.
    expect(next.player.holding).toMatchObject({ name: "carrot", state: "raw" });
    const stove = next.stations.find((s) => s.row === 1 && s.col === 1);
    expect(stove?.item).toBeNull();
  });

  test("holding a plate at a stove with a cooked item adds it to the plate", () => {
    // Honey Toast: bread cooked + honey raw.
    const state = playingStateWithOrders([0]);
    const stoveIdx = state.stations.findIndex((s) => s.row === 1 && s.col === 1);
    const stations = state.stations.map((s, i) =>
      i === stoveIdx
        ? {
            ...s,
            item: { type: "ingredient" as const, name: "bread", emoji: "🍞", state: "cooked" as const },
            isCooking: true,
            cookProgress: 3,
          }
        : s,
    );

    const next = gameReducer(
      {
        ...state,
        stations,
        player: {
          ...state.player,
          holding: { type: "plate", dirty: false, contents: [] },
          x: 1.5 * 48,
          y: 2.5 * 48, // standing just below stove
        },
      },
      { type: "PICKUP" },
    );

    expect(next.player.holding).toMatchObject({
      type: "plate",
      contents: [{ name: "bread", state: "cooked" }],
    });
    const stoveAfter = next.stations.find((s) => s.row === 1 && s.col === 1);
    expect(stoveAfter?.item).toBeNull();
    expect(stoveAfter?.isCooking).toBe(false);
  });
});

describe("stable crate ingredient mapping", () => {
  test("all configured ingredients are always visible, regardless of active orders", () => {
    const state: GameState = { ...createInitialState(), screen: "playing", orders: [] };
    const visible = getVisibleCrateIngredients(state);
    const expected = Object.keys(INGREDIENTS);

    expect(visible).toEqual(expected);
  });

  test("each ingredient appears exactly once in the crate list", () => {
    const state: GameState = { ...createInitialState(), screen: "playing", orders: [] };
    const visible = getVisibleCrateIngredients(state);
    const unique = new Set(visible);

    expect(unique.size).toBe(Object.keys(INGREDIENTS).length);
    expect(unique.size).toBe(visible.length);
  });

  test("crate ingredient assignment does not change when active orders change", () => {
    const first = getVisibleCrateIngredients(playingStateWithOrders([0, 3]));
    const second = getVisibleCrateIngredients(playingStateWithOrders([5, 2, 4]));

    expect(second).toEqual(first);
  });

  test("crate ingredient assignment does not change after a serve", () => {
    vi.spyOn(Date, "now").mockReturnValue(1000);
    const state = playingStateWithOrders([0, 3]);
    const before = getVisibleCrateIngredients(state);

    const served = state.orders[0].recipe;
    const after = getVisibleCrateIngredients(
      gameReducer(
        {
          ...state,
          player: {
            ...state.player,
            holding: {
              type: "plate",
              dirty: false,
              contents: served.ingredients.map((i) => ({
                type: "ingredient" as const,
                name: i.name,
                emoji: "",
                state: i.state,
              })),
            },
            x: 16.5 * 48,
            y: 1.5 * 48,
          },
        },
        { type: "PICKUP" },
      ),
    );

    expect(after).toEqual(before);
  });
});
