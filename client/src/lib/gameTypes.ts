/*
 * Pooh's Honey Kitchen - Game Types
 * All TypeScript interfaces for the game state machine.
 *
 * CONTROLS v2:
 *   Arrow keys = movement
 *   D = pick up / place (PICKUP action)
 *   W = actions like chop, wash (ACTION action)
 *   ESC = pause
 */

import type { Difficulty, IngredientState, Recipe } from "./gameConstants";

// ─── PLAYER ─────────────────────────────────────────────────
export interface Player {
  x: number;
  y: number;
  direction: "up" | "down" | "left" | "right";
  holding: HeldItem | null;
  isInteracting: boolean;
  interactionProgress: number; // 0-100
  interactionType: "chop" | "wash" | "cook" | null;
}

// ─── HELD ITEMS ─────────────────────────────────────────────
export interface HeldIngredient {
  type: "ingredient";
  name: string;
  emoji: string;
  state: IngredientState;
}

export interface HeldPlate {
  type: "plate";
  contents: HeldIngredient[];
  dirty: boolean;
}

export type HeldItem = HeldIngredient | HeldPlate;

// ─── STATION STATE ──────────────────────────────────────────
export interface StationState {
  row: number;
  col: number;
  tileType: number;
  item: HeldItem | null;
  cookProgress: number;    // 0 to cookTime+burnTime
  isCooking: boolean;
  isBurning: boolean;
  chopProgress: number;
  isChopping: boolean;
  washProgress: number;
  isWashing: boolean;
  crateIndex: number;      // for crates: which crate in the list
}

// ─── ORDER ──────────────────────────────────────────────────
export interface Order {
  id: string;
  recipe: Recipe;
  timeRemaining: number;
  maxTime: number;
}

// ─── GAME STATE ─────────────────────────────────────────────
export type GameScreen = "title" | "instructions" | "playing" | "gameover";

export interface GameState {
  screen: GameScreen;
  player: Player;
  stations: StationState[];
  orders: Order[];
  score: number;
  timeRemaining: number;
  elapsedTime: number;
  cleanPlates: number;
  dirtyPlatesTimer: number[];
  combo: number;
  lastServeTick: number; // game clock value at last successful serve; combo expires after 12 ticks of inactivity
  message: string | null;
  messageTimer: number;
  isPaused: boolean;
  highScore: number;
  fruitCakeSpawned: boolean;
  difficulty: Difficulty;
}

// ─── GAME ACTIONS ───────────────────────────────────────────
export type GameAction =
  | { type: "MOVE"; dx: number; dy: number }
  | { type: "PICKUP" }       // D key - pick up / place items
  | { type: "ACTION" }       // W key - chop, wash, interact with active stations
  | { type: "INTERACT" }     // legacy - maps to PICKUP for backward compat
  | { type: "TICK" }
  | { type: "START_GAME"; difficulty: Difficulty }
  | { type: "SHOW_INSTRUCTIONS" }
  | { type: "BACK_TO_TITLE" }
  | { type: "TOGGLE_PAUSE" }
  | { type: "RESTART_GAME" }
  | { type: "END_GAME" }
  | { type: "DISMISS_MESSAGE" }
  | { type: "SPAWN_ORDER" };
