/*
 * Pooh's Honey Kitchen - Game Canvas Renderer
 * Design: Hundred Acre Storybook - warm honey-gold watercolor aesthetic
 * Renders the tile map, player (Pooh), stations, items, and effects on a <canvas>.
 *
 * v3: Clearer station icons (no masking/clipping), stable crate labels
 */

import { useEffect, useRef } from "react";
import {
  INGREDIENTS,
  MAP_COLS,
  MAP_LAYOUT,
  MAP_ROWS,
  TILE,
  TILE_COLORS,
  TILE_SIZE,
  GAME_CONFIG,
} from "@/lib/gameConstants";
import { getVisibleCrateIngredient } from "@/lib/gameEngine";
import type { GameState, HeldIngredient, HeldPlate } from "@/lib/gameTypes";

interface GameCanvasProps {
  state: GameState;
}

const CANVAS_WIDTH = MAP_COLS * TILE_SIZE;
const CANVAS_HEIGHT = MAP_ROWS * TILE_SIZE;

// Pooh colors
const POOH_BODY = "#F5C842";
const POOH_SHIRT = "#CC3333";
const POOH_DARK = "#D4A520";
const POOH_EARS = "#E8B830";

// Draw a clear ingredient icon (no masking)
function drawIngredientIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  emoji: string,
  label: string,
  color: string,
  size: number = 28,
  showLabel: boolean = true
) {
  // Colored circle background
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(x, y, size / 2 + 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Border
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, size / 2 + 4, 0, Math.PI * 2);
  ctx.stroke();

  // Emoji (large and clear)
  ctx.font = `${size}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, x, y + 1);

  // Label below
  if (showLabel) {
    ctx.font = "bold 9px 'Nunito', sans-serif";
    ctx.fillStyle = "#5C3A1E";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(label, x, y + size / 2 + 5);
  }
}

// Draw a station tile with CLEAR icon - no clipping, no masking
function drawStation(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  tileType: number
) {
  const cx = x + TILE_SIZE / 2;
  const cy = y + TILE_SIZE / 2;

  // Station background
  ctx.fillStyle = TILE_COLORS[tileType] || "#C4A882";
  ctx.beginPath();
  ctx.roundRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4, 6);
  ctx.fill();

  // Border (distinct per station type)
  let borderColor = "#D4A520";
  if (tileType === TILE.STOVE) borderColor = "#FF6B35";
  else if (tileType === TILE.CHOPPING) borderColor = "#8B6914";
  else if (tileType === TILE.SINK) borderColor = "#4A90D9";
  else if (tileType === TILE.SERVE) borderColor = "#FFD700";
  else if (tileType === TILE.TRASH) borderColor = "#555555";
  else if (tileType === TILE.PLATE_STACK) borderColor = "#A0785A";
  else if (tileType === TILE.CRATE) borderColor = "#8B5E3C";
  else if (tileType === TILE.COUNTER) borderColor = "#6F4A2D";

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4, 6);
  ctx.stroke();

  // Draw station-specific icons CLEARLY (no masking)
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  switch (tileType) {
    case TILE.STOVE: {
      // Draw a clear flame icon
      ctx.font = "26px serif";
      ctx.fillText("🔥", cx, cy - 2);
      // Label
      ctx.font = "bold 8px 'Nunito', sans-serif";
      ctx.fillStyle = "#FFF";
      ctx.fillText("STOVE", cx, cy + 16);
      break;
    }
    case TILE.CHOPPING: {
      // Draw knife icon
      ctx.font = "26px serif";
      ctx.fillText("🔪", cx, cy - 2);
      // Label
      ctx.font = "bold 8px 'Nunito', sans-serif";
      ctx.fillStyle = "#5C3A1E";
      ctx.fillText("CHOP", cx, cy + 16);
      break;
    }
    case TILE.SINK: {
      // Draw water/tap icon
      ctx.font = "26px serif";
      ctx.fillText("🚰", cx, cy - 2);
      // Label
      ctx.font = "bold 8px 'Nunito', sans-serif";
      ctx.fillStyle = "#1565C0";
      ctx.fillText("WASH", cx, cy + 16);
      break;
    }
    case TILE.SERVE: {
      // Draw serving window
      ctx.font = "26px serif";
      ctx.fillText("🪟", cx, cy - 2);
      // Label
      ctx.font = "bold 8px 'Nunito', sans-serif";
      ctx.fillStyle = "#5C3A1E";
      ctx.fillText("SERVE", cx, cy + 16);
      break;
    }
    case TILE.PLATE_STACK: {
      // Draw plates
      ctx.font = "26px serif";
      ctx.fillText("🍽️", cx, cy - 2);
      // Label
      ctx.font = "bold 8px 'Nunito', sans-serif";
      ctx.fillStyle = "#5C3A1E";
      ctx.fillText("PLATES", cx, cy + 16);
      break;
    }
    case TILE.TRASH: {
      // Draw trash can
      ctx.font = "26px serif";
      ctx.fillText("🗑️", cx, cy - 2);
      // Label
      ctx.font = "bold 8px 'Nunito', sans-serif";
      ctx.fillStyle = "#FFF";
      ctx.fillText("TRASH", cx, cy + 16);
      break;
    }
    case TILE.COUNTER: {
      ctx.font = "24px serif";
      ctx.fillText("▤", cx, cy - 4);
      ctx.font = "bold 8px 'Nunito', sans-serif";
      ctx.fillStyle = "#5C3A1E";
      ctx.fillText("COUNTER", cx, cy + 16);
      break;
    }
    case TILE.CRATE: {
      // Draw crate box
      ctx.font = "22px serif";
      ctx.fillText("📦", cx, cy - 2);
      break;
    }
  }
}

export default function GameCanvas({ state }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // ─── DRAW TILES ─────────────────────────────────
      for (let r = 0; r < MAP_ROWS; r++) {
        for (let c = 0; c < MAP_COLS; c++) {
          const tile = MAP_LAYOUT[r][c];
          const x = c * TILE_SIZE;
          const y = r * TILE_SIZE;

          if (tile === TILE.WALL) {
            // Wood plank wall
            ctx.fillStyle = TILE_COLORS[TILE.WALL];
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = "#7A4E2D";
            ctx.fillRect(x + 2, y + TILE_SIZE / 3, TILE_SIZE - 4, 1.5);
            ctx.fillRect(x + 2, y + (TILE_SIZE * 2) / 3, TILE_SIZE - 4, 1.5);
            ctx.fillStyle = "rgba(92, 58, 30, 0.15)";
            ctx.fillRect(x + TILE_SIZE / 4, y + 4, 1, TILE_SIZE - 8);
            ctx.fillRect(x + (TILE_SIZE * 3) / 4, y + 4, 1, TILE_SIZE - 8);
            ctx.strokeStyle = "#5C3A1E";
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
          } else if (tile === TILE.FLOOR) {
            // Warm cream floor
            ctx.fillStyle = TILE_COLORS[TILE.FLOOR];
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = "rgba(200, 180, 140, 0.25)";
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
            if ((r + c) % 2 === 0) {
              ctx.fillStyle = "rgba(180, 160, 120, 0.1)";
              ctx.fillRect(x + TILE_SIZE / 2 - 1, y + TILE_SIZE / 2 - 1, 2, 2);
            }
          } else {
            // Station tiles - draw base floor first, then station on top
            ctx.fillStyle = TILE_COLORS[TILE.FLOOR];
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            drawStation(ctx, x, y, tile);
          }
        }
      }

      // ─── DRAW ITEMS ON STATIONS & CRATE LABELS ──────
      for (const station of state.stations) {
        const sx = station.col * TILE_SIZE + TILE_SIZE / 2;
        const sy = station.row * TILE_SIZE + TILE_SIZE / 2;

        // Show the same permanent ingredient that crate pickup provides.
        if (station.tileType === TILE.CRATE) {
          const pick = getVisibleCrateIngredient(state, station.crateIndex);
          const ingData = INGREDIENTS[pick];
          if (ingData) {
            // Draw ingredient label ABOVE the crate clearly
            const labelY = sy - TILE_SIZE / 2 - 12;
            
            // Background pill for label
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.beginPath();
            ctx.roundRect(sx - 22, labelY - 10, 44, 20, 10);
            ctx.fill();
            ctx.strokeStyle = ingData.color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(sx - 22, labelY - 10, 44, 20, 10);
            ctx.stroke();

            // Emoji + short name
            ctx.font = "14px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(ingData.emoji, sx - 8, labelY);
            ctx.font = "bold 8px 'Nunito', sans-serif";
            ctx.fillStyle = "#5C3A1E";
            ctx.fillText(ingData.label.length > 7 ? ingData.label.slice(0, 6) + "." : ingData.label, sx + 10, labelY);
          }
        }

        // Item on station (ingredient or plate)
        if (station.item) {
          if (station.item.type === "ingredient") {
            const ing = station.item as HeldIngredient;
            const ingData = INGREDIENTS[ing.name];
            const color = ingData?.color || "#888";
            drawIngredientIcon(ctx, sx + 14, sy - 14, ing.emoji, ing.state, color, 18, true);
          } else {
            // Plate
            ctx.font = "18px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const plate = station.item as HeldPlate;
            ctx.fillText(plate.dirty ? "🧽" : "🍽️", sx + 14, sy - 10);
          }
        }

        // Cooking progress bar
        if (station.isCooking && station.item && station.item.type === "ingredient") {
          const ing = INGREDIENTS[(station.item as HeldIngredient).name];
          if (ing) {
            const totalTime = ing.cookTime + ing.burnTime;
            const progress = Math.min(station.cookProgress / totalTime, 1);
            const cookRatio = station.cookProgress / ing.cookTime;

            const barX = station.col * TILE_SIZE + 4;
            const barY = station.row * TILE_SIZE - 8;
            const barW = TILE_SIZE - 8;
            const barH = 6;

            // Background
            ctx.fillStyle = "rgba(0,0,0,0.35)";
            ctx.beginPath();
            ctx.roundRect(barX, barY, barW, barH, 3);
            ctx.fill();

            // Progress color
            //  - blue   : still cooking
            //  - orange : about-to-cook (last 20% of cookTime)
            //  - green  : cooked, eat-window open
            //  - yellow : about-to-burn warning (last 35% of burn window)
            //  - red    : burned
            if (station.isBurning) {
              ctx.fillStyle = "#FF2222";
            } else if (cookRatio >= 1) {
              // We're in the cooked-to-burn window. Warn when close to burning.
              const burnRatio =
                (station.cookProgress - ing.cookTime) / Math.max(ing.burnTime, 1);
              if (burnRatio >= 0.65) {
                ctx.fillStyle = "#FFAA22"; // about to burn
              } else {
                ctx.fillStyle = "#44CC44"; // happy cooked window
              }
            } else if (cookRatio >= 0.8) {
              ctx.fillStyle = "#FFAA22";
            } else {
              ctx.fillStyle = "#4488FF";
            }
            ctx.beginPath();
            ctx.roundRect(barX, barY, barW * progress, barH, 3);
            ctx.fill();

            // Fire effect when burning
            if (station.isBurning) {
              const flicker = Math.sin(frameRef.current * 0.3) * 3;
              ctx.font = "16px serif";
              ctx.textAlign = "center";
              ctx.fillText("🔥", sx, sy - 22 + flicker);
            }
          }
        }

        // Chopping progress
        if (station.isChopping) {
          const progress = station.chopProgress / GAME_CONFIG.CHOP_TIME;
          const barX = station.col * TILE_SIZE + 4;
          const barY = station.row * TILE_SIZE - 8;
          const barW = TILE_SIZE - 8;
          const barH = 6;

          ctx.fillStyle = "rgba(0,0,0,0.35)";
          ctx.beginPath();
          ctx.roundRect(barX, barY, barW, barH, 3);
          ctx.fill();
          ctx.fillStyle = "#88CC44";
          ctx.beginPath();
          ctx.roundRect(barX, barY, barW * progress, barH, 3);
          ctx.fill();

          // Chopping animation
          const chop = Math.sin(frameRef.current * 0.5) > 0 ? "🔪" : "✂️";
          ctx.font = "14px serif";
          ctx.textAlign = "center";
          ctx.fillText(chop, sx + 16, sy - 18);
        }

        // Washing progress
        if (station.isWashing) {
          const progress = station.washProgress / GAME_CONFIG.WASH_TIME;
          const barX = station.col * TILE_SIZE + 4;
          const barY = station.row * TILE_SIZE - 8;
          const barW = TILE_SIZE - 8;
          const barH = 6;

          ctx.fillStyle = "rgba(0,0,0,0.35)";
          ctx.beginPath();
          ctx.roundRect(barX, barY, barW, barH, 3);
          ctx.fill();
          ctx.fillStyle = "#44AAFF";
          ctx.beginPath();
          ctx.roundRect(barX, barY, barW * progress, barH, 3);
          ctx.fill();

          const bubble = Math.sin(frameRef.current * 0.4) > 0 ? "🫧" : "💧";
          ctx.font = "14px serif";
          ctx.textAlign = "center";
          ctx.fillText(bubble, sx + 16, sy - 18);
        }
      }

      // ─── DRAW DIRTY PLATES INDICATOR AT SINK ────────
      const dirtyReady = state.dirtyPlatesTimer.filter((t) => t <= 0).length;
      if (dirtyReady > 0) {
        const sink = state.stations.find((s) => s.tileType === TILE.SINK);
        if (sink) {
          const sx = sink.col * TILE_SIZE + TILE_SIZE / 2;
          const sy = sink.row * TILE_SIZE - 16;
          const pulse = 0.7 + Math.sin(frameRef.current * 0.1) * 0.3;
          ctx.globalAlpha = pulse;
          ctx.fillStyle = "#CC3333";
          ctx.beginPath();
          ctx.roundRect(sx - 28, sy - 8, 56, 16, 8);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.font = "bold 10px Nunito, sans-serif";
          ctx.fillStyle = "#FFF";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`${dirtyReady} dirty 🧽`, sx, sy);
        }
      }

      // ─── DRAW PROXIMITY HIGHLIGHT ──────────────────
      const pr = state.player.y / TILE_SIZE;
      const pc = state.player.x / TILE_SIZE;
      let nearestDist = GAME_CONFIG.INTERACTION_RANGE;
      let nearestStation: { row: number; col: number } | null = null;
      for (const s of state.stations) {
        const sr = s.row + 0.5;
        const sc = s.col + 0.5;
        const dist = Math.sqrt((pr - sr) ** 2 + (pc - sc) ** 2);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestStation = { row: s.row, col: s.col };
        }
      }
      if (nearestStation) {
        const hx = nearestStation.col * TILE_SIZE;
        const hy = nearestStation.row * TILE_SIZE;
        const pulse = 0.5 + Math.sin(frameRef.current * 0.08) * 0.3;
        ctx.strokeStyle = `rgba(245, 200, 66, ${pulse})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(hx + 1, hy + 1, TILE_SIZE - 2, TILE_SIZE - 2, 8);
        ctx.stroke();
      }

      // ─── DRAW POOH (THE PLAYER) ─────────────────────
      const px = state.player.x;
      const py = state.player.y;
      const bounce = Math.sin(frameRef.current * 0.15) * 1.5;
      const drawY = py + bounce;

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.beginPath();
      ctx.ellipse(px, drawY + 16, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body (golden bear)
      ctx.fillStyle = POOH_BODY;
      ctx.beginPath();
      ctx.ellipse(px, drawY, 14, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = POOH_DARK;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Red shirt
      ctx.fillStyle = POOH_SHIRT;
      ctx.beginPath();
      ctx.ellipse(px, drawY + 4, 13, 10, 0, 0.2, Math.PI - 0.2);
      ctx.fill();

      // Head
      ctx.fillStyle = POOH_BODY;
      ctx.beginPath();
      ctx.arc(px, drawY - 12, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = POOH_DARK;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ears
      ctx.fillStyle = POOH_EARS;
      ctx.beginPath();
      ctx.arc(px - 8, drawY - 19, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px + 8, drawY - 19, 4, 0, Math.PI * 2);
      ctx.fill();

      // Eyes (direction-aware)
      const eyeOffsetX = state.player.direction === "left" ? -2 : state.player.direction === "right" ? 2 : 0;
      const eyeOffsetY = state.player.direction === "up" ? -2 : state.player.direction === "down" ? 1 : 0;
      ctx.fillStyle = "#222";
      ctx.beginPath();
      ctx.arc(px - 3 + eyeOffsetX, drawY - 13 + eyeOffsetY, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px + 3 + eyeOffsetX, drawY - 13 + eyeOffsetY, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.fillStyle = "#222";
      ctx.beginPath();
      ctx.ellipse(px + eyeOffsetX, drawY - 10 + eyeOffsetY, 2, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Smile
      ctx.strokeStyle = "#222";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(px + eyeOffsetX, drawY - 9 + eyeOffsetY, 3, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // ─── DRAW HELD ITEM ─────────────────────────────
      if (state.player.holding) {
        const heldY = drawY - 30;

        if (state.player.holding.type === "ingredient") {
          const ing = state.player.holding as HeldIngredient;
          const ingData = INGREDIENTS[ing.name];
          const color = ingData?.color || "#888";
          drawIngredientIcon(ctx, px, heldY, ing.emoji, ing.state, color, 20, true);
        } else if (state.player.holding.type === "plate") {
          const plate = state.player.holding as HeldPlate;
          if (plate.dirty) {
            ctx.font = "18px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🧽", px, heldY);
          } else if (plate.contents.length > 0) {
            ctx.font = "14px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🍽️", px - 10, heldY);
            const emojis = plate.contents.map((c) => c.emoji).join("");
            ctx.font = "12px serif";
            ctx.fillText(emojis, px + 8, heldY);
          } else {
            ctx.font = "18px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🍽️", px, heldY);
          }
        }
      }

      // ─── INTERACTION PROGRESS RING ──────────────────
      if (state.player.isInteracting) {
        const progress = state.player.interactionProgress / 100;
        ctx.strokeStyle = state.player.interactionType === "chop" ? "#88CC44" : "#44AAFF";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(px, drawY, 20, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
        ctx.stroke();
      }

      // ─── FLOATING BEES (ambient) ────────────────────
      const beeCount = 3;
      for (let i = 0; i < beeCount; i++) {
        const bx =
          100 +
          Math.sin(frameRef.current * 0.02 + i * 2.1) * 80 +
          i * 250;
        const by =
          50 +
          Math.cos(frameRef.current * 0.03 + i * 1.7) * 30 +
          i * 40;
        ctx.font = "10px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🐝", bx % CANVAS_WIDTH, (by % CANVAS_HEIGHT) + 20);
      }

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animRef.current);
  }, [state]);

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="rounded-xl shadow-lg"
        style={{
          imageRendering: "auto",
          maxWidth: "100%",
          height: "auto",
          border: "4px solid #8B5E3C",
          boxShadow: "0 4px 20px rgba(139, 94, 60, 0.3), inset 0 0 30px rgba(139, 94, 60, 0.05)",
        }}
      />
      {/* Corner decorations */}
      <div className="absolute -top-2 -left-2 text-lg">🌻</div>
      <div className="absolute -top-2 -right-2 text-lg">🌸</div>
      <div className="absolute -bottom-2 -left-2 text-lg">🍃</div>
      <div className="absolute -bottom-2 -right-2 text-lg">🍯</div>
    </div>
  );
}
