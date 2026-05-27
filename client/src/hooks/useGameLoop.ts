/*
 * Pooh's Honey Kitchen - Game Loop Hook
 * Handles keyboard input, game tick, and order spawning.
 *
 * CONTROLS v2:
 *   Arrow keys = movement
 *   D = pick up / place (PICKUP)
 *   W = actions: chop, wash (ACTION)
 *   ESC = pause
 */

import { useCallback, useEffect, useReducer, useRef } from "react";
import { DIFFICULTY_CONFIGS, GAME_CONFIG } from "@/lib/gameConstants";
import type { Difficulty } from "@/lib/gameConstants";
import { createInitialState, gameReducer } from "@/lib/gameEngine";

export function useGameLoop() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const keysRef = useRef<Set<string>>(new Set());
  const animFrameRef = useRef<number>(0);

  // ─── KEYBOARD INPUT ───────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current.add(key);

      // Prevent scrolling with arrow keys
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) {
        e.preventDefault();
      }

      // D = pick up / place items
      if (key === "d") {
        e.preventDefault();
        dispatch({ type: "PICKUP" });
      }

      // W = action (chop, wash)
      if (key === "w") {
        e.preventDefault();
        dispatch({ type: "ACTION" });
      }

      // Escape = pause
      if (key === "escape") {
        dispatch({ type: "TOGGLE_PAUSE" });
      }

      // Enter on title/gameover
      if (key === "enter") {
        if (state.screen === "title") {
          dispatch({ type: "START_GAME", difficulty: "medium" });
        } else if (state.screen === "gameover") {
          dispatch({ type: "BACK_TO_TITLE" });
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [state.screen]);

  // ─── GAME LOOP (RAF for movement, setInterval for 1Hz tick + order spawns) ─────────────
  useEffect(() => {
    if (state.screen !== "playing" || state.isPaused) return;

    const config = DIFFICULTY_CONFIGS[state.difficulty];

    // Movement is per-frame; we keep RAF for smoothness.
    const moveLoop = () => {
      const keys = keysRef.current;
      let dx = 0;
      let dy = 0;

      if (keys.has("arrowup")) dy -= 1;
      if (keys.has("arrowdown")) dy += 1;
      if (keys.has("arrowleft")) dx -= 1;
      if (keys.has("arrowright")) dx += 1;

      // Normalize diagonal movement
      if (dx !== 0 && dy !== 0) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx /= len;
        dy /= len;
      }

      if (dx !== 0 || dy !== 0) {
        dispatch({ type: "MOVE", dx, dy });
      }

      animFrameRef.current = requestAnimationFrame(moveLoop);
    };

    // Game time and order spawns run on setInterval so a backgrounded tab does
    // NOT silently pause the simulation (RAF is throttled when the tab is
    // hidden). The 1Hz tick is independent of frame rate.
    const tickHandle = setInterval(() => {
      dispatch({ type: "TICK" });
    }, GAME_CONFIG.TICK_INTERVAL);

    const spawnHandle = setInterval(() => {
      dispatch({ type: "SPAWN_ORDER" });
    }, config.orderSpawnInterval * 1000);

    animFrameRef.current = requestAnimationFrame(moveLoop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearInterval(tickHandle);
      clearInterval(spawnHandle);
    };
  }, [state.screen, state.isPaused, state.difficulty]);

  const startGame = useCallback((difficulty: Difficulty) => dispatch({ type: "START_GAME", difficulty }), []);
  const restartGame = useCallback(() => dispatch({ type: "RESTART_GAME" }), []);
  const endGame = useCallback(() => dispatch({ type: "END_GAME" }), []);
  const showInstructions = useCallback(() => dispatch({ type: "SHOW_INSTRUCTIONS" }), []);
  const backToTitle = useCallback(() => dispatch({ type: "BACK_TO_TITLE" }), []);
  const togglePause = useCallback(() => dispatch({ type: "TOGGLE_PAUSE" }), []);

  return {
    state,
    startGame,
    restartGame,
    endGame,
    showInstructions,
    backToTitle,
    togglePause,
    dispatch,
  };
}
