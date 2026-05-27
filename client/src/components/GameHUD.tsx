/*
 * Pooh's Honey Kitchen - Game HUD
 * Design: Hundred Acre Storybook - warm honey-gold watercolor aesthetic
 * Shows orders, score, timer, inventory, and game messages.
 */

import { ASSETS, DIFFICULTY_CONFIGS, INGREDIENTS } from "@/lib/gameConstants";
import type { GameState, HeldIngredient, HeldPlate } from "@/lib/gameTypes";

interface GameHUDProps {
  state: GameState;
  onPause: () => void;
}

export default function GameHUD({ state, onPause }: GameHUDProps) {
  const isEasyMode = state.difficulty === "easy";
  const displayTime = isEasyMode ? state.elapsedTime : state.timeRemaining;
  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const config = DIFFICULTY_CONFIGS[state.difficulty];
  const timePercent = isEasyMode ? 1 : state.timeRemaining / config.gameDuration;
  const isLowTime = !isEasyMode && state.timeRemaining <= 30;

  return (
    <div className="w-full max-w-[1060px] mx-auto space-y-3">
      {/* Top Bar: Score + Timer + Plates */}
      <div className="flex items-center justify-between gap-4 px-4 py-2 rounded-xl"
        style={{
          background: "linear-gradient(135deg, #FFF8E7 0%, #F5E6C8 100%)",
          border: "2px solid #D4A520",
          boxShadow: "0 2px 8px rgba(139, 94, 60, 0.15)",
        }}
      >
        {/* Score */}
        <div className="flex items-center gap-2">
          <img src={ASSETS.HONEY_POT} alt="score" className="w-8 h-8 object-contain" />
          <div>
            <div className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wide" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Score
            </div>
            <div
              className="text-2xl font-bold text-[#D4A520]"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {state.score}
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wide" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            {isEasyMode ? "Elapsed" : "Time"}
          </div>
          <div
            className={`text-3xl font-bold ${isLowTime ? "text-red-500" : "text-[#5C3A1E]"}`}
            style={{
              fontFamily: "'Fredoka', sans-serif",
              animation: isLowTime ? "score-pop 0.5s ease infinite" : undefined,
            }}
          >
            {timeStr}
          </div>
          {/* Timer bar */}
          <div className="w-32 h-2 rounded-full bg-[#D4C4A8] mt-1 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${timePercent * 100}%`,
                background: isEasyMode
                  ? "linear-gradient(90deg, #88CC44, #F5C842)"
                  : isLowTime
                    ? "linear-gradient(90deg, #FF4444, #FF8844)"
                    : "linear-gradient(90deg, #F5C842, #88CC44)",
              }}
            />
          </div>
        </div>

        {/* Plates + Combo */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-xs font-semibold text-[#8B5E3C] uppercase tracking-wide" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Plates
            </div>
            <div className="text-xl font-bold text-[#5C3A1E]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              🍽️ {state.cleanPlates}
            </div>
          </div>
          {state.combo > 1 && (
            <div className="text-center px-2 py-1 rounded-lg bg-[#F5C842]/30">
              <div className="text-xs font-semibold text-[#D4A520]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Combo
              </div>
              <div className="text-lg font-bold text-[#CC3333]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                x{Math.min(state.combo, 5)}{state.combo >= 5 ? " MAX" : ""}
              </div>
            </div>
          )}
          <button
            onClick={onPause}
            className="p-2 rounded-lg hover:bg-[#F5C842]/30 transition-colors text-[#8B5E3C]"
            title="Pause (ESC)"
          >
            ⏸️
          </button>
        </div>
      </div>

      {/* Orders Bar */}
      <div className="flex gap-2 overflow-x-auto px-1">
        {state.orders.length === 0 && (
          <div
            className="flex-1 text-center py-3 rounded-xl text-[#8B5E3C] italic"
            style={{
              background: "rgba(255, 248, 231, 0.8)",
              border: "1px dashed #D4A520",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            No orders yet... enjoy the calm!
          </div>
        )}
        {state.orders.map((order) => {
          const urgency = isEasyMode ? 1 : order.timeRemaining / order.maxTime;
          const borderColor = isEasyMode
            ? "#88CC44"
            : urgency < 0.25 ? "#FF2222" : urgency < 0.5 ? "#FFAA22" : "#88CC44";
          const isFruitCake = order.recipe.name === "Fruit Cake";
          return (
            <div
              key={order.id}
              className="flex-shrink-0 px-3 py-2 rounded-xl min-w-[140px]"
              style={{
                background: isFruitCake
                  ? "linear-gradient(135deg, #FFE4E1 0%, #FFF0D4 100%)"
                  : "linear-gradient(135deg, #FFF8E7 0%, #FFF0D4 100%)",
                border: `2px solid ${isFruitCake ? "#E53935" : borderColor}`,
                boxShadow: `0 0 8px ${borderColor}40`,
                animation: !isEasyMode && urgency < 0.25 ? "score-pop 0.8s ease infinite" : undefined,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-[#5C3A1E]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  {order.recipe.emoji} {order.recipe.name}
                </span>
                <span
                  className="text-xs font-bold ml-2"
                  style={{ color: borderColor, fontFamily: "'Fredoka', sans-serif" }}
                >
                  {isEasyMode ? "No limit" : `${order.timeRemaining}s`}
                </span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {order.recipe.ingredients.map((ing, i) => {
                  const ingData = INGREDIENTS[ing.name];
                  return (
                    <span
                      key={i}
                      className="text-xs px-1.5 py-0.5 rounded text-[#5C3A1E] flex items-center gap-0.5"
                      style={{
                        fontFamily: "'Nunito', sans-serif",
                        background: ingData ? `${ingData.color}20` : "#F5E6C8",
                        border: ingData ? `1px solid ${ingData.color}40` : "1px solid #E8DCC8",
                      }}
                    >
                      {ingData?.emoji} {ing.state === "raw" ? "raw " : ing.state.replace("_", "+") + " "}{ing.name}
                    </span>
                  );
                })}
              </div>
              {/* Timer bar */}
              {!isEasyMode && (
                <div className="w-full h-1.5 rounded-full bg-[#E8DCC8] mt-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${urgency * 100}%`,
                      background: borderColor,
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Inventory / Holding Display */}
      <div
        className="flex items-center gap-3 px-4 py-2 rounded-xl"
        style={{
          background: "rgba(255, 248, 231, 0.9)",
          border: "1px solid #D4C4A8",
        }}
      >
        <span className="text-xs font-semibold text-[#8B5E3C] uppercase" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          Holding:
        </span>
        {!state.player.holding && (
          <span className="text-sm text-[#A08060] italic" style={{ fontFamily: "'Nunito', sans-serif" }}>
            Nothing - go to a crate and press D to pick up ingredients!
          </span>
        )}
        {state.player.holding?.type === "ingredient" && (
          <span className="text-sm font-semibold text-[#5C3A1E] flex items-center gap-1" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {(state.player.holding as HeldIngredient).emoji}{" "}
            <span className="px-1.5 py-0.5 rounded text-xs" style={{
              background: `${INGREDIENTS[(state.player.holding as HeldIngredient).name]?.color || "#888"}20`,
              border: `1px solid ${INGREDIENTS[(state.player.holding as HeldIngredient).name]?.color || "#888"}40`,
            }}>
              {(state.player.holding as HeldIngredient).state}
            </span>{" "}
            {INGREDIENTS[(state.player.holding as HeldIngredient).name]?.label || (state.player.holding as HeldIngredient).name}
          </span>
        )}
        {state.player.holding?.type === "plate" && (
          <span className="text-sm font-semibold text-[#5C3A1E] flex items-center gap-1" style={{ fontFamily: "'Nunito', sans-serif" }}>
            🍽️ Plate
            {(state.player.holding as HeldPlate).dirty && " (dirty - place at sink, press W to wash)"}
            {(state.player.holding as HeldPlate).contents.length > 0 && (
              <> with {(state.player.holding as HeldPlate).contents.map((c) => c.emoji + " " + (INGREDIENTS[c.name]?.label || c.name)).join(", ")}</>
            )}
          </span>
        )}

        {/* Dirty plates waiting */}
        {state.dirtyPlatesTimer.filter((t) => t <= 0).length > 0 && (
          <span className="ml-auto text-xs font-semibold text-red-500 animate-pulse" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            🧽 {state.dirtyPlatesTimer.filter((t) => t <= 0).length} dirty plate(s) at sink!
          </span>
        )}
      </div>

      {/* Game Message Toast */}
      {state.message && (
        <div
          className="text-center py-2 px-4 rounded-xl text-[#5C3A1E] font-semibold"
          style={{
            background: "linear-gradient(135deg, #FFF8E7 0%, #F5E6C8 100%)",
            border: "2px solid #F5C842",
            fontFamily: "'Fredoka', sans-serif",
            animation: "slide-in-right 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          {state.message}
        </div>
      )}
    </div>
  );
}
