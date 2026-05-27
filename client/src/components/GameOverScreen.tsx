/*
 * Pooh's Honey Kitchen - Game Over Screen
 * Design: Hundred Acre Storybook - warm honey-gold watercolor aesthetic
 */

import { ASSETS } from "@/lib/gameConstants";

interface GameOverScreenProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onTitle: () => void;
  elapsedTime?: number;
  showElapsedTime?: boolean;
}

function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function GameOverScreen({ score, highScore, onRestart, onTitle, elapsedTime = 0, showElapsedTime = false }: GameOverScreenProps) {
  const isNewHighScore = score >= highScore && score > 0;

  // Rating based on score
  let rating = "🍯";
  let ratingText = "Beginner Cook";
  if (score >= 500) { rating = "🍯🍯🍯🍯🍯"; ratingText = "Master Chef Pooh!"; }
  else if (score >= 350) { rating = "🍯🍯🍯🍯"; ratingText = "Expert Cook!"; }
  else if (score >= 200) { rating = "🍯🍯🍯"; ratingText = "Great Cook!"; }
  else if (score >= 100) { rating = "🍯🍯"; ratingText = "Good Cook!"; }

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: `linear-gradient(to bottom, rgba(255,248,231,0.5), rgba(255,240,212,0.8)), url(${ASSETS.TITLE_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="relative z-10 flex flex-col items-center px-8 py-10 rounded-3xl max-w-md w-full mx-4"
        style={{
          background: "linear-gradient(135deg, rgba(255,248,231,0.97) 0%, rgba(255,240,212,0.97) 100%)",
          border: "3px solid #D4A520",
          boxShadow: "0 8px 32px rgba(139, 94, 60, 0.25), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
      >
        <h2
          className="text-3xl font-bold text-[#5C3A1E] mb-2"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          {showElapsedTime ? "Kitchen Closed!" : "Time's Up!"}
        </h2>

        <p className="text-sm text-[#8B5E3C] mb-4" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {showElapsedTime ? "Practice session complete." : "The kitchen is closing for today..."}
        </p>

        {/* Score Display */}
        <div className="flex items-center gap-3 mb-2">
          <img src={ASSETS.HONEY_POT} alt="" className="w-12 h-12" />
          <div>
            <div className="text-xs font-semibold text-[#8B5E3C] uppercase" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Final Score
            </div>
            <div
              className="text-4xl font-bold text-[#D4A520]"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              {score}
            </div>
          </div>
        </div>

        {/* Total Time */}
        {showElapsedTime && (
          <div
            className="px-4 py-2 rounded-xl mb-3 text-center"
            style={{
              background: "rgba(136, 204, 68, 0.16)",
              border: "2px solid #88CC44",
            }}
          >
            <div className="text-xs font-semibold text-[#5C3A1E] uppercase" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Total Time
            </div>
            <div className="text-2xl font-bold text-[#5C3A1E]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              {formatClock(elapsedTime)}
            </div>
          </div>
        )}

        {/* New High Score */}
        {isNewHighScore && (
          <div
            className="px-4 py-2 rounded-xl mb-3 text-center"
            style={{
              background: "linear-gradient(135deg, #F5C842 0%, #FFD700 100%)",
              border: "2px solid #D4A520",
              animation: "score-pop 1s ease infinite",
            }}
          >
            <span className="text-sm font-bold text-white" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              ⭐ New High Score! ⭐
            </span>
          </div>
        )}

        {/* Rating */}
        <div className="text-center mb-4">
          <div className="text-2xl mb-1">{rating}</div>
          <div className="text-sm font-semibold text-[#5C3A1E]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            {ratingText}
          </div>
        </div>

        {/* Best Score */}
        <div className="text-xs text-[#A08060] mb-6" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Best Score: {highScore} pts
        </div>

        {/* Buttons */}
        <button
          onClick={onRestart}
          className="w-full py-3 px-6 rounded-xl text-lg font-bold text-white mb-3 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            background: "linear-gradient(135deg, #F5C842 0%, #D4A520 100%)",
            boxShadow: "0 4px 12px rgba(212, 165, 32, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
            border: "2px solid #C49520",
          }}
        >
          🍯 Play Again!
        </button>

        <button
          onClick={onTitle}
          className="w-full py-2.5 px-6 rounded-xl text-base font-semibold text-[#5C3A1E] transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            background: "linear-gradient(135deg, #FFF8E7 0%, #F5E6C8 100%)",
            border: "2px solid #D4C4A8",
          }}
        >
          🏠 Back to Title
        </button>

        <p className="mt-3 text-xs text-[#A08060]" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Press <kbd className="px-1.5 py-0.5 rounded bg-[#E8DCC8] text-[#5C3A1E] font-bold text-xs">ENTER</kbd> to continue
        </p>
      </div>
    </div>
  );
}
