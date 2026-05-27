/*
 * Pooh's Honey Kitchen - Game Constants
 * Design: Hundred Acre Storybook - warm honey-gold watercolor aesthetic
 * All game configuration, recipes, and map data live here.
 *
 * CONTROLS (v2):
 *   Arrow keys = movement
 *   D = pick up / place items
 *   W = actions (chop, wash)
 *   ESC = pause
 */

// ─── TILE TYPES ─────────────────────────────────────────────
export const TILE = {
  FLOOR: 0,
  WALL: 1,
  CRATE: 2,       // Ingredient pickup
  CHOPPING: 3,    // Chopping board
  STOVE: 4,       // Cooking station
  SINK: 5,        // Wash dishes
  SERVE: 6,       // Serving window
  PLATE_STACK: 7, // Clean plates
  TRASH: 8,       // Discard items
  COUNTER: 9,     // Temporary plate/item drop-off
} as const;

export type TileType = (typeof TILE)[keyof typeof TILE];

// ─── MAP LAYOUT (shaped like "31" from top-down, CONNECTED) ─
// 22 cols x 14 rows
// The "3" is on the left, the "1" is on the right
// They share a connected corridor so the player can walk between them
export const MAP_COLS = 22;
export const MAP_ROWS = 14;
export const TILE_SIZE = 48;

// Connected "31" map:
// The "3" has three horizontal arms (top, middle, bottom) curving right
// The "1" is a vertical column on the right
// A corridor connects the "3" to the "1" through the middle
// FIX: Added walkable path at top of "3" so stoves are reachable
export const MAP_LAYOUT: number[][] = [
  // col: 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // row 0
  [1, 4, 0, 0, 4, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 1, 1],  // row 1 - top arm of "3" (stoves) + top of "1" (serve)
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 9, 1, 1, 1, 1, 1, 1, 7, 0, 0, 1, 1, 1],  // row 2 - walkable below stoves + counter + 2nd plate stack adjacent to serve
  [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],  // row 3 - connecting path top
  [1, 3, 0, 0, 0, 0, 3, 0, 0, 9, 1, 1, 1, 1, 1, 1, 9, 0, 0, 1, 1, 1],  // row 4 - middle arm of "3" (chopping boards + counters)
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],  // row 5 - walkable below chopping
  [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],  // row 6 - connecting path bottom
  [1, 5, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],  // row 7 - bottom arm of "3" (sink)
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 9, 1, 1, 1, 1, 1, 1, 9, 0, 0, 1, 1, 1],  // row 8 - walkable below sink + counters
  [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 0, 0, 1, 1, 1],  // row 9 - 2nd corridor (cols 4-5) + bottom plate stack
  [1, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 8, 1, 1],  // row 10 - bottom corridor (crates + trash)
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],  // row 11 - walkway
  [1, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2, 1, 1, 1],  // row 12 - extra crate row (now 5 crates: cols 1, 7, 10, 13, 18)
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // row 13
];

// ─── STATION LABELS ─────────────────────────────────────────
export const STATION_NAMES: Record<number, string> = {
  [TILE.CRATE]: "Ingredient Crate",
  [TILE.CHOPPING]: "Chopping Board",
  [TILE.STOVE]: "Stove",
  [TILE.SINK]: "Sink",
  [TILE.SERVE]: "Serving Window",
  [TILE.PLATE_STACK]: "Plate Stack",
  [TILE.TRASH]: "Trash Bin",
  [TILE.COUNTER]: "Counter",
};

// ─── STATION EMOJIS ─────────────────────────────────────────
export const STATION_EMOJI: Record<number, string> = {
  [TILE.CRATE]: "📦",
  [TILE.CHOPPING]: "🔪",
  [TILE.STOVE]: "🔥",
  [TILE.SINK]: "🚰",
  [TILE.SERVE]: "🪟",
  [TILE.PLATE_STACK]: "🍽️",
  [TILE.TRASH]: "🗑️",
  [TILE.COUNTER]: "▤",
};

// ─── INGREDIENTS ────────────────────────────────────────────
export type IngredientState =
  | "raw"
  | "chopped"
  | "cooked"
  | "chopped_cooked" // ingredient that was first chopped then cooked
  | "burned";

export interface Ingredient {
  name: string;
  emoji: string;
  label: string;       // clear display label
  color: string;       // color for canvas drawing
  state: IngredientState;
  requiresChopping: boolean;
  requiresCooking: boolean;
  cookTime: number; // ticks to cook
  burnTime: number; // ticks after cooked before burning
}

export const INGREDIENTS: Record<string, Omit<Ingredient, "state">> = {
  honey:      { name: "honey",      emoji: "🍯", label: "Honey",      color: "#F5C842", requiresChopping: false, requiresCooking: false, cookTime: 0, burnTime: 0 },
  bread:      { name: "bread",      emoji: "🍞", label: "Bread",      color: "#D4A520", requiresChopping: false, requiresCooking: true,  cookTime: 3, burnTime: 20 },
  lettuce:    { name: "lettuce",    emoji: "🥬", label: "Lettuce",    color: "#66BB6A", requiresChopping: true,  requiresCooking: false, cookTime: 0, burnTime: 0 },
  tomato:     { name: "tomato",     emoji: "🍅", label: "Tomato",     color: "#EF5350", requiresChopping: true,  requiresCooking: false, cookTime: 0, burnTime: 0 },
  meat:       { name: "meat",       emoji: "🥩", label: "Meat",       color: "#A1544B", requiresChopping: false, requiresCooking: true,  cookTime: 4, burnTime: 20 },
  carrot:     { name: "carrot",     emoji: "🥕", label: "Carrot",     color: "#FF8A65", requiresChopping: true,  requiresCooking: true,  cookTime: 3, burnTime: 20 },
  berry:      { name: "berry",      emoji: "🫐", label: "Blueberry",  color: "#5C6BC0", requiresChopping: false, requiresCooking: false, cookTime: 0, burnTime: 0 },
  watermelon: { name: "watermelon", emoji: "🍉", label: "Watermelon", color: "#4CAF50", requiresChopping: true,  requiresCooking: false, cookTime: 0, burnTime: 0 },
  strawberry: { name: "strawberry", emoji: "🍓", label: "Strawberry", color: "#E53935", requiresChopping: true,  requiresCooking: false, cookTime: 0, burnTime: 0 },
};

// ─── RECIPES ────────────────────────────────────────────────
export interface Recipe {
  name: string;
  emoji: string;
  ingredients: { name: string; state: IngredientState }[];
  points: number;
  timeLimit: number; // seconds to complete order
}

export const RECIPES: Recipe[] = [
  {
    name: "Honey Toast",
    emoji: "🍯🍞",
    ingredients: [
      { name: "bread", state: "cooked" },
      { name: "honey", state: "raw" },
    ],
    points: 50,
    timeLimit: 35,
  },
  {
    name: "Salad",
    emoji: "🥗",
    ingredients: [
      { name: "lettuce", state: "chopped" },
      { name: "tomato", state: "chopped" },
    ],
    points: 60,
    timeLimit: 30,
  },
  {
    name: "Honey Burger",
    emoji: "🍔",
    ingredients: [
      { name: "bread", state: "cooked" },
      { name: "meat", state: "cooked" },
      { name: "lettuce", state: "chopped" },
    ],
    points: 120,
    timeLimit: 50,
  },
  {
    name: "Berry Bowl",
    emoji: "🫐🍯",
    ingredients: [
      { name: "berry", state: "raw" },
      { name: "honey", state: "raw" },
    ],
    points: 40,
    timeLimit: 25,
  },
  {
    name: "Carrot Soup",
    emoji: "🥣",
    ingredients: [
      // carrot must be chopped THEN cooked. The chopped_cooked state proves both steps were done.
      { name: "carrot", state: "chopped_cooked" },
      { name: "tomato", state: "chopped" },
    ],
    points: 80,
    timeLimit: 40,
  },
  {
    name: "Fruit Cake",
    emoji: "🎂",
    ingredients: [
      { name: "watermelon", state: "chopped" },
      { name: "berry", state: "raw" },
      { name: "strawberry", state: "chopped" },
    ],
    points: 150,
    timeLimit: 55,
  },
];

// ─── DIFFICULTY LEVELS ──────────────────────────────────────
export type Difficulty = "easy" | "medium" | "hard";

export interface DifficultyConfig {
  label: string;
  emoji: string;
  description: string;
  gameDuration: number;      // seconds
  maxOrders: number;
  orderSpawnInterval: number; // seconds between new orders
  orderTimeScale: number;    // multiplier applied to recipe order timers
  initialCleanPlates: number;
  tipBonus: number;
  penaltyExpired: number;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: "Easy",
    emoji: "🌼",
    description: "Untimed practice, slower orders, gentle pace",
    gameDuration: 210,
    maxOrders: 3,
    orderSpawnInterval: 14,
    orderTimeScale: 1,
    initialCleanPlates: 6,
    tipBonus: 20,
    penaltyExpired: -15,
  },
  medium: {
    label: "Medium",
    emoji: "🍯",
    description: "6:00 timer, balanced challenge",
    gameDuration: 360,
    maxOrders: 4,
    orderSpawnInterval: 10,
    orderTimeScale: 2.4,
    initialCleanPlates: 4,
    tipBonus: 15,
    penaltyExpired: -30,
  },
  hard: {
    label: "Hard",
    emoji: "🔥",
    description: "4:00 timer, rapid orders, high pressure",
    gameDuration: 240,
    maxOrders: 5,
    orderSpawnInterval: 7,
    orderTimeScale: 2,
    initialCleanPlates: 3,
    tipBonus: 25,
    penaltyExpired: -40,
  },
};

// ─── GAME CONFIG (base values, overridden by difficulty) ─────
export const GAME_CONFIG = {
  GAME_DURATION: 150,       // default medium
  TICK_INTERVAL: 1000,
  MAX_ORDERS: 4,
  ORDER_SPAWN_INTERVAL: 10,
  INITIAL_CLEAN_PLATES: 4,
  DIRTY_PLATE_RETURN_TIME: 4,
  WASH_TIME: 3,
  CHOP_TIME: 2,
  PLAYER_SPEED: 4,
  INTERACTION_RANGE: 1.6,
  TIP_BONUS: 15,
  TIP_THRESHOLD: 0.5,
  PENALTY_EXPIRED: -30,
  PENALTY_WRONG: -15,
  FRUIT_CAKE_SPAWN_TIME: 90,
};

// ─── TILE COLORS (for canvas rendering) ─────────────────────
export const TILE_COLORS: Record<number, string> = {
  [TILE.FLOOR]: "#FFF8E7",
  [TILE.WALL]: "#8B5E3C",
  [TILE.CRATE]: "#A0785A",
  [TILE.CHOPPING]: "#C4A882",
  [TILE.STOVE]: "#6B4226",
  [TILE.SINK]: "#87CEEB",
  [TILE.SERVE]: "#F5C842",
  [TILE.PLATE_STACK]: "#E8DCC8",
  [TILE.TRASH]: "#7A7A7A",
  [TILE.COUNTER]: "#B8895B",
};

// ─── ASSET URLS ─────────────────────────────────────────────
export const ASSETS = {
  LOGO: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369295621/YCjK2TMPfMWiT2ZV4tBA6K/3pooh-logo-v2-75ukgeokY6AVJqQVGVrPTA.webp",
  TITLE_BG: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369295621/YCjK2TMPfMWiT2ZV4tBA6K/pooh-title-bg-ZMfYXNyS5fkSC3LrmWCF7k.webp",
  HONEY_POT: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369295621/YCjK2TMPfMWiT2ZV4tBA6K/honey-pot-icon-mbZHMqzqhVyhKBz8ce5LmK.webp",
  INSTRUCTIONS_BG: "https://d2xsxph8kpxj0f.cloudfront.net/310519663369295621/YCjK2TMPfMWiT2ZV4tBA6K/game-instructions-bg-E4zQcbady8oVtj7izcfcvP.webp",
};

// ─── POOH QUOTES ────────────────────────────────────────────
export const POOH_QUOTES = [
  "Oh bother, more orders!",
  "Time for a little smackerel...",
  "Think, think, think...",
  "I am a bear of very little brain...",
  "Any honey left?",
  "Where's my hunny pot?",
  "A day without honey is a day wasted!",
  "Oh my, that was close!",
];

// ─── CRATE INGREDIENT ASSIGNMENTS (stable, one-to-one) ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// Crates must expose the complete ingredient registry at all times.
// Ingredient order follows the registry above, so adding an ingredient automatically adds a crate assignment.
export const INGREDIENT_NAMES = Object.freeze(Object.keys(INGREDIENTS));
export const CRATE_INGREDIENTS: readonly string[] = INGREDIENT_NAMES;
export const CRATE_TILE_COUNT = MAP_LAYOUT.flat().filter((tile) => tile === TILE.CRATE).length;
