/*
 * Pooh's Honey Kitchen - Title Screen
 * Design: Hundred Acre Storybook - warm honey-gold watercolor aesthetic
 * Beautiful title screen with the 3Pooh logo and difficulty selection.
 */

import { useState } from "react";
import { ASSETS, DIFFICULTY_CONFIGS } from "@/lib/gameConstants";
import type { Difficulty } from "@/lib/gameConstants";

interface TitleScreenProps {
  highScore: number;
  onStart: (difficulty: Difficulty) => void;
  onInstructions: () => void;
}

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

export default function TitleScreen({ highScore, onStart, onInstructions }: TitleScreenProps) {
  const [selected, setSelected] = useState<Difficulty>("medium");

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, rgba(255,248,231,0.3), rgba(255,240,212,0.7)), url(${ASSETS.TITLE_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Floating bees decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="absolute text-2xl"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 20}%`,
              animation: `float-bee ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            🐝
          </span>
        ))}
      </div>

      {/* Main content card */}
      <div
        className="relative z-10 flex flex-col items-center px-8 py-8 rounded-3xl max-w-lg w-full mx-4"
        style={{
          background: "linear-gradient(135deg, rgba(255,248,231,0.95) 0%, rgba(255,240,212,0.95) 100%)",
          border: "3px solid #D4A520",
          boxShadow: "0 8px 32px rgba(139, 94, 60, 0.25), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        {/* Logo */}
        <img
          src={ASSETS.LOGO}
          alt="3Pooh - Pooh's Honey Kitchen"
          className="w-56 h-auto mb-1 drop-shadow-lg"
        />

        <h1
          className="text-2xl font-bold text-[#5C3A1E] mb-1"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          Honey Kitchen
        </h1>

        <p
          className="text-sm text-[#8B5E3C] mb-4 text-center"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Cook delicious recipes in the Hundred Acre Wood!
        </p>

        {/* High Score */}
        {highScore > 0 && (
          <div className="flex items-center gap-2 mb-3 px-4 py-1.5 rounded-xl bg-[#F5C842]/20">
            <img src={ASSETS.HONEY_POT} alt="" className="w-5 h-5" />
            <span className="text-sm font-semibold text-[#D4A520]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Best: {highScore} pts
            </span>
          </div>
        )}

        {/* Difficulty Selection */}
        <div className="w-full mb-4">
          <p
            className="text-xs font-semibold text-[#8B5E3C] mb-2 text-center uppercase tracking-wider"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Select Difficulty
          </p>
          <div className="flex gap-2 w-full">
            {difficulties.map((diff) => {
              const config = DIFFICULTY_CONFIGS[diff];
              const isSelected = selected === diff;
              const minutes = Math.floor(config.gameDuration / 60);
              const seconds = config.gameDuration % 60;
              const timeStr = diff === "easy"
                ? "Untimed"
                : `${minutes}:${seconds.toString().padStart(2, "0")}`;

              return (
                <button
                  key={diff}
                  onClick={() => setSelected(diff)}
                  className="flex-1 flex flex-col items-center py-3 px-2 rounded-xl transition-all duration-150 hover:scale-[1.03] active:scale-[0.97]"
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    background: isSelected
                      ? diff === "easy"
                        ? "linear-gradient(135deg, #A8E6CF 0%, #88D8A8 100%)"
                        : diff === "medium"
                        ? "linear-gradient(135deg, #F5C842 0%, #D4A520 100%)"
                        : "linear-gradient(135deg, #FF6B6B 0%, #CC4444 100%)"
                      : "rgba(255,248,231,0.6)",
                    border: isSelected
                      ? diff === "easy"
                        ? "2px solid #66BB6A"
                        : diff === "medium"
                        ? "2px solid #C49520"
                        : "2px solid #CC3333"
                      : "2px solid #E8DCC8",
                    boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                    color: isSelected
                      ? diff === "hard" ? "#FFF" : "#5C3A1E"
                      : "#8B5E3C",
                  }}
                >
                  <span className="text-xl mb-0.5">{config.emoji}</span>
                  <span className="text-sm font-bold">{config.label}</span>
                  <span
                    className="text-[10px] mt-0.5 opacity-80"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    {diff === "easy" ? "∞" : "⏱"} {timeStr}
                  </span>
                  <span
                    className="text-[9px] mt-0.5 opacity-70 text-center leading-tight"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    {config.description.split(",")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={() => onStart(selected)}
          className="w-full py-3 px-6 rounded-xl text-lg font-bold text-white mb-3 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            background: "linear-gradient(135deg, #F5C842 0%, #D4A520 100%)",
            boxShadow: "0 4px 12px rgba(212, 165, 32, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
            border: "2px solid #C49520",
          }}
        >
          🍯 Start Cooking!
        </button>

        <button
          onClick={onInstructions}
          className="w-full py-2.5 px-6 rounded-xl text-base font-semibold text-[#5C3A1E] transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            background: "linear-gradient(135deg, #FFF8E7 0%, #F5E6C8 100%)",
            border: "2px solid #D4C4A8",
            boxShadow: "0 2px 8px rgba(139, 94, 60, 0.1)",
          }}
        >
          📖 How to Play
        </button>

        <p
          className="mt-3 text-xs text-[#A08060] text-center"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Press <kbd className="px-1.5 py-0.5 rounded bg-[#E8DCC8] text-[#5C3A1E] font-bold text-xs">ENTER</kbd> to start
        </p>
      </div>

      {/* Honey pots decoration at bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 opacity-40">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="text-3xl" style={{ animation: `honey-drip ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}>
            🍯
          </span>
        ))}
      </div>
    </div>
  );
}
