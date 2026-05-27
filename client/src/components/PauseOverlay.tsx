/*
 * Pooh's Honey Kitchen - Pause Overlay
 * Design: Hundred Acre Storybook
 * Now includes Resume, Restart, and End Game options.
 */

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onEndGame: () => void;
  score: number;
  timeValue: number;
  timeLabel: string;
}

export default function PauseOverlay({ onResume, onRestart, onEndGame, score, timeValue, timeLabel }: PauseOverlayProps) {
  const minutes = Math.floor(timeValue / 60);
  const seconds = timeValue % 60;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="flex flex-col items-center px-8 py-8 rounded-3xl min-w-[320px]"
        style={{
          background: "linear-gradient(135deg, rgba(255,248,231,0.97) 0%, rgba(255,240,212,0.97) 100%)",
          border: "3px solid #D4A520",
          boxShadow: "0 8px 32px rgba(139, 94, 60, 0.3)",
        }}
      >
        <h2
          className="text-3xl font-bold text-[#5C3A1E] mb-2"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          ⏸️ Paused
        </h2>
        <p className="text-sm text-[#8B5E3C] mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
          "Think, think, think..." — Pooh
        </p>

        {/* Current game stats */}
        <div className="flex gap-4 mb-6 px-4 py-2 rounded-xl bg-[#F5E6C8]/50">
          <div className="text-center">
            <div className="text-xs text-[#8B5E3C] font-semibold" style={{ fontFamily: "'Fredoka', sans-serif" }}>Score</div>
            <div className="text-lg font-bold text-[#D4A520]" style={{ fontFamily: "'Fredoka', sans-serif" }}>{score}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-[#8B5E3C] font-semibold" style={{ fontFamily: "'Fredoka', sans-serif" }}>{timeLabel}</div>
            <div className="text-lg font-bold text-[#5C3A1E]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Resume Button */}
        <button
          onClick={onResume}
          className="w-full py-3 px-8 rounded-xl text-lg font-bold text-white transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] mb-2"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            background: "linear-gradient(135deg, #F5C842 0%, #D4A520 100%)",
            border: "2px solid #C49520",
            boxShadow: "0 4px 12px rgba(212, 165, 32, 0.4)",
          }}
        >
          ▶️ Resume
        </button>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full py-2.5 px-8 rounded-xl text-base font-semibold text-[#5C3A1E] transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] mb-2"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            background: "linear-gradient(135deg, #FFF8E7 0%, #F5E6C8 100%)",
            border: "2px solid #D4C4A8",
          }}
        >
          🔄 Restart Game
        </button>

        {/* End Game Button */}
        <button
          onClick={onEndGame}
          className="w-full py-2.5 px-8 rounded-xl text-base font-semibold text-white transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            background: "linear-gradient(135deg, #CC3333 0%, #AA2222 100%)",
            border: "2px solid #992222",
            boxShadow: "0 4px 12px rgba(204, 51, 51, 0.3)",
          }}
        >
          🏠 End Game
        </button>

        <p className="mt-3 text-xs text-[#A08060]" style={{ fontFamily: "'Nunito', sans-serif" }}>
          Press <kbd className="px-1.5 py-0.5 rounded bg-[#E8DCC8] text-[#5C3A1E] font-bold text-xs">ESC</kbd> to resume
        </p>
      </div>
    </div>
  );
}
