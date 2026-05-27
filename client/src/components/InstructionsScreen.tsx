/*
 * Pooh's Honey Kitchen - Instructions Screen
 * Design: Hundred Acre Storybook - parchment paper with watercolor accents
 *
 * CONTROLS v2:
 *   Arrow keys = movement
 *   D = pick up / place items
 *   W = actions (chop, wash)
 *   ESC = pause
 */

import { ASSETS, RECIPES } from "@/lib/gameConstants";

interface InstructionsScreenProps {
  onBack: () => void;
  onStart: () => void;
}

export default function InstructionsScreen({ onBack, onStart }: InstructionsScreenProps) {
  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: `url(${ASSETS.INSTRUCTIONS_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="relative z-10 max-w-2xl w-full rounded-3xl p-8 overflow-y-auto max-h-[90vh]"
        style={{
          background: "linear-gradient(135deg, rgba(255,248,231,0.97) 0%, rgba(255,240,212,0.97) 100%)",
          border: "3px solid #D4A520",
          boxShadow: "0 8px 32px rgba(139, 94, 60, 0.25)",
        }}
      >
        <h2
          className="text-3xl font-bold text-[#5C3A1E] text-center mb-6"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          📖 How to Play
        </h2>

        {/* Controls */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#D4A520] mb-3" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            🎮 Controls
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F5E6C8]/50">
              <kbd className="px-2 py-1 rounded bg-[#E8DCC8] text-[#5C3A1E] font-bold text-sm border border-[#D4C4A8]">← ↑ ↓ →</kbd>
              <span className="text-sm text-[#5C3A1E]" style={{ fontFamily: "'Nunito', sans-serif" }}>Move Pooh</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F5E6C8]/50">
              <kbd className="px-3 py-1 rounded bg-[#F5C842] text-white font-bold text-sm border border-[#D4A520]">D</kbd>
              <span className="text-sm text-[#5C3A1E]" style={{ fontFamily: "'Nunito', sans-serif" }}>Pick up / Place items</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F5E6C8]/50">
              <kbd className="px-3 py-1 rounded bg-[#88CC44] text-white font-bold text-sm border border-[#66AA22]">W</kbd>
              <span className="text-sm text-[#5C3A1E]" style={{ fontFamily: "'Nunito', sans-serif" }}>Chop / Wash (actions)</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F5E6C8]/50">
              <kbd className="px-2 py-1 rounded bg-[#E8DCC8] text-[#5C3A1E] font-bold text-sm border border-[#D4C4A8]">ESC</kbd>
              <span className="text-sm text-[#5C3A1E]" style={{ fontFamily: "'Nunito', sans-serif" }}>Pause / Resume</span>
            </div>
          </div>
        </div>

        {/* Stations */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#D4A520] mb-3" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            🏪 Kitchen Stations
          </h3>
          <div className="space-y-2">
            {[
              { emoji: "📦", name: "Ingredient Crate", desc: "Press D to pick up the shown ingredient" },
              { emoji: "🔪", name: "Chopping Board", desc: "Press D to place, then W to chop" },
              { emoji: "🔥", name: "Stove", desc: "Press D to place. Cooks automatically — grab before it burns!" },
              { emoji: "🍽️", name: "Plate Stack", desc: "Press D to grab a clean plate" },
              { emoji: "🪟", name: "Serving Window", desc: "Press D to deliver a plated order" },
              { emoji: "🚰", name: "Sink", desc: "Press D to place dirty plate, then W to wash" },
              { emoji: "🗑️", name: "Trash", desc: "Press D to discard items" },
            ].map((station) => (
              <div key={station.name} className="flex items-center gap-3 p-2 rounded-lg bg-[#FFF8E7]/70">
                <span className="text-xl w-8 text-center">{station.emoji}</span>
                <div>
                  <span className="text-sm font-bold text-[#5C3A1E]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {station.name}
                  </span>
                  <span className="text-xs text-[#8B5E3C] ml-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    — {station.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gameplay Flow */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#D4A520] mb-3" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            🍳 How to Cook
          </h3>
          <ol className="space-y-2 list-decimal list-inside text-sm text-[#5C3A1E]" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <li><strong>Check orders</strong> at the top — each shows what recipe to make</li>
            <li><strong>Go to a Crate</strong> and press <kbd className="px-1 py-0.5 rounded bg-[#F5C842] text-white font-bold text-xs">D</kbd> to grab an ingredient</li>
            <li><strong>Process it</strong> — place on Chopping Board with <kbd className="px-1 py-0.5 rounded bg-[#F5C842] text-white font-bold text-xs">D</kbd>, then press <kbd className="px-1 py-0.5 rounded bg-[#88CC44] text-white font-bold text-xs">W</kbd> to chop</li>
            <li><strong>Cook it</strong> — place on Stove with <kbd className="px-1 py-0.5 rounded bg-[#F5C842] text-white font-bold text-xs">D</kbd> (cooks automatically, watch for burning!)</li>
            <li><strong>Grab a plate</strong> from the Plate Stack with <kbd className="px-1 py-0.5 rounded bg-[#F5C842] text-white font-bold text-xs">D</kbd></li>
            <li><strong>Add ingredients</strong> — walk to processed items and press <kbd className="px-1 py-0.5 rounded bg-[#F5C842] text-white font-bold text-xs">D</kbd> with plate in hand</li>
            <li><strong>Serve</strong> at the Serving Window with <kbd className="px-1 py-0.5 rounded bg-[#F5C842] text-white font-bold text-xs">D</kbd> when the plate matches an order</li>
            <li><strong>Wash dirty plates</strong> — pick up at Sink with <kbd className="px-1 py-0.5 rounded bg-[#F5C842] text-white font-bold text-xs">D</kbd>, place, then press <kbd className="px-1 py-0.5 rounded bg-[#88CC44] text-white font-bold text-xs">W</kbd></li>
          </ol>
        </div>

        {/* Recipes */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[#D4A520] mb-3" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            📋 Recipes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {RECIPES.map((recipe) => (
              <div
                key={recipe.name}
                className="p-3 rounded-xl"
                style={{
                  background: recipe.name === "Fruit Cake"
                    ? "linear-gradient(135deg, #FFE4E1 0%, #FFF0D4 100%)"
                    : "linear-gradient(135deg, #FFF8E7 0%, #FFF0D4 100%)",
                  border: recipe.name === "Fruit Cake" ? "2px solid #E53935" : "1px solid #E8DCC8",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{recipe.emoji}</span>
                  <span className="text-sm font-bold text-[#5C3A1E]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {recipe.name}
                  </span>
                  <span className="ml-auto text-xs font-bold text-[#D4A520]">+{recipe.points}pts</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {recipe.ingredients.map((ing, i) => (
                    <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-[#F5E6C8] text-[#5C3A1E]">
                      {ing.state !== "raw" && `${ing.state} `}{ing.name}
                    </span>
                  ))}
                </div>
                {recipe.name === "Fruit Cake" && (
                  <div className="mt-1 text-xs text-[#E53935] font-semibold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    ⭐ Final Challenge — appears late in the game!
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mb-6 p-4 rounded-xl bg-[#F5C842]/10 border border-[#F5C842]/30">
          <h3 className="text-lg font-bold text-[#D4A520] mb-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            💡 Tips
          </h3>
          <ul className="space-y-1 text-sm text-[#5C3A1E]" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <li>• Serve orders quickly for <strong>tip bonuses</strong>!</li>
            <li>• Chain deliveries for <strong>combo multipliers</strong> (up to x5)!</li>
            <li>• Watch the stove — food <strong>burns</strong> if left too long!</li>
            <li>• Keep washing plates — you can't serve without clean ones!</li>
            <li>• The trash bin lets you discard mistakes and start fresh.</li>
            <li>• The <strong>Fruit Cake</strong> order appears near the end — save time for it!</li>
            <li>• Press <strong>ESC</strong> to pause, restart, or end the game.</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-2.5 px-4 rounded-xl text-base font-semibold text-[#5C3A1E] transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              fontFamily: "'Fredoka', sans-serif",
              background: "linear-gradient(135deg, #FFF8E7 0%, #F5E6C8 100%)",
              border: "2px solid #D4C4A8",
            }}
          >
            ← Back
          </button>
          <button
            onClick={onStart}
            className="flex-1 py-2.5 px-4 rounded-xl text-base font-bold text-white transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              fontFamily: "'Fredoka', sans-serif",
              background: "linear-gradient(135deg, #F5C842 0%, #D4A520 100%)",
              border: "2px solid #C49520",
              boxShadow: "0 4px 12px rgba(212, 165, 32, 0.4)",
            }}
          >
            🍯 Let's Cook!
          </button>
        </div>
      </div>
    </div>
  );
}
