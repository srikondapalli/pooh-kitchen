/*
 * Pooh's Honey Kitchen - Main Game Page
 * Design: Hundred Acre Storybook - warm honey-gold watercolor aesthetic
 * Orchestrates title, instructions, gameplay, and game over screens.
 */

import GameCanvas from "@/components/GameCanvas";
import GameHUD from "@/components/GameHUD";
import GameOverScreen from "@/components/GameOverScreen";
import InstructionsScreen from "@/components/InstructionsScreen";
import PauseOverlay from "@/components/PauseOverlay";
import TitleScreen from "@/components/TitleScreen";
import { useGameLoop } from "@/hooks/useGameLoop";
import { DIFFICULTY_CONFIGS } from "@/lib/gameConstants";

export default function Home() {
  const { state, startGame, restartGame, endGame, showInstructions, backToTitle, togglePause } = useGameLoop();

  // ─── TITLE SCREEN ───────────────────────────────────
  if (state.screen === "title") {
    return (
      <TitleScreen
        highScore={state.highScore}
        onStart={startGame}
        onInstructions={showInstructions}
      />
    );
  }

  // ─── INSTRUCTIONS SCREEN ────────────────────────────
  if (state.screen === "instructions") {
    return (
      <InstructionsScreen
        onBack={backToTitle}
        onStart={() => startGame("medium")}
      />
    );
  }

  // ─── GAME OVER SCREEN ──────────────────────────────
  if (state.screen === "gameover") {
    return (
      <GameOverScreen
        score={state.score}
        highScore={state.highScore}
        onRestart={() => startGame(state.difficulty)}
        onTitle={backToTitle}
        elapsedTime={state.elapsedTime}
        showElapsedTime={state.difficulty === "easy"}
      />
    );
  }

  // ─── GAMEPLAY SCREEN ───────────────────────────────
  const diffConfig = DIFFICULTY_CONFIGS[state.difficulty];

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center py-3 px-2"
      style={{
        background: "linear-gradient(180deg, #FFF8E7 0%, #F5E6C8 50%, #E8DCC8 100%)",
      }}
    >
      {/* Game HUD */}
      <GameHUD state={state} onPause={togglePause} />

      {/* Game Canvas */}
      <div className="relative mt-3">
        <GameCanvas state={state} />

        {/* Pause Overlay */}
        {state.isPaused && (
          <PauseOverlay
            onResume={togglePause}
            onRestart={restartGame}
            onEndGame={endGame}
            score={state.score}
            timeValue={state.difficulty === "easy" ? state.elapsedTime : state.timeRemaining}
            timeLabel={state.difficulty === "easy" ? "Elapsed" : "Time Left"}
          />
        )}
      </div>

      {/* Station Legend (mini) */}
      <div
        className="mt-3 flex flex-wrap gap-2 justify-center px-4 py-2 rounded-xl max-w-[1060px]"
        style={{
          background: "rgba(255, 248, 231, 0.8)",
          border: "1px solid #E8DCC8",
        }}
      >
        {[
          { emoji: "📦", label: "Crate" },
          { emoji: "🔪", label: "Chop" },
          { emoji: "🔥", label: "Stove" },
          { emoji: "🍽️", label: "Plates" },
          { emoji: "🪟", label: "Serve" },
          { emoji: "🚰", label: "Sink" },
          { emoji: "🗑️", label: "Trash" },
        ].map((s) => (
          <span
            key={s.label}
            className="text-xs text-[#5C3A1E] flex items-center gap-1"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {s.emoji} {s.label}
          </span>
        ))}
        <span className="text-xs text-[#A08060] ml-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
          | ← ↑ ↓ → = move | D = pick/place | W = chop/wash | ESC = pause
        </span>
        <span className="text-xs text-[#D4A520] ml-2 font-semibold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          {diffConfig.emoji} {diffConfig.label}
        </span>
      </div>
    </div>
  );
}
