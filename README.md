# Pooh's Honey Kitchen

A top-down cooking game inspired by Overcooked, themed around Winnie the Pooh. Cook orders for Pooh's Hundred Acre Wood kitchen, manage ingredients across multiple stations, and chase the high score before time runs out.

**Play it now:** [srikondapalli.github.io/pooh-kitchen](https://srikondapalli.github.io/pooh-kitchen/)

---

## Controls

| Key | Action |
|-----|--------|
| Arrow keys | Move Pooh |
| `D` | Pick up / place / serve / add to plate (context-sensitive) |
| `W` | Chop (at chopping board) or wash (at sink) |
| `Esc` | Pause |

---

## How to Play

You move Pooh around a kitchen shaped like the number **31**. Orders appear at the top of the screen — each order shows which dish is needed and a countdown timer. Serve the right plate before time runs out to earn points.

### The Basic Loop

1. Grab an ingredient from a **crate**
2. Process it (chop or cook) if the recipe requires it
3. Grab a **plate** and add ingredients to it
4. Carry the finished plate to the **serve window**

### Stations

| Station | Key | What it Does |
|---------|-----|--------------|
| Crate 📦 | `D` | Pick up a raw ingredient. If you're already holding a plate, raw-edible items (honey, blueberry) go directly onto the plate. |
| Chopping Board 🔪 | `D` to place, `W` to chop | Place a raw ingredient that needs chopping, then press `W` to chop it. Press `D` while holding a plate to move the chopped ingredient onto the plate. |
| Stove 🔥 | `D` to place, wait, `D` to collect | Place a raw ingredient that needs cooking. It cooks automatically — watch the progress bar. Press `D` while holding a plate to move the cooked ingredient onto the plate. |
| Plate Stack 🍽️ | `D` (empty hands) | Pick up a clean plate. There are two stacks — one near the serve window for fast pickups. |
| Sink 🚰 | `W` | Wash dirty plates. Plates automatically enter the dirty queue a few seconds after each serve. |
| Serve Window 🪟 | `D` | Serve a finished plate. Matched orders earn points (with a tip bonus if served quickly). Wrong orders lose points but the plate comes back as dirty. |
| Counter ▤ | `D` | Temporary drop-off spot. Put an item down to free your hands. |
| Trash 🗑️ | `D` | Discard a held item. Plates come back as dirty — they are never destroyed. |

### The Stove Progress Bar

| Colour | Meaning |
|--------|---------|
| Blue | Cooking in progress |
| Green | Ready to collect — ideal window |
| Yellow | About to burn — collect quickly |
| Red | Burned — must be trashed |

---

## Ingredients and Where to Find Them

The kitchen has **9 ingredient crates**. Their positions never change during a run.

| Ingredient | Location |
|------------|----------|
| 🍯 Honey | Row 10, column 1 |
| 🍞 Bread | Row 10, column 5 |
| 🥬 Lettuce | Row 10, column 9 |
| 🍅 Tomato | Row 10, column 13 |
| 🥩 Meat | Row 12, column 1 |
| 🥕 Carrot | Row 12, column 7 |
| 🫐 Blueberry | Row 12, column 10 |
| 🍉 Watermelon | Row 12, column 13 |
| 🍓 Strawberry | Row 12, column 18 |

---

## Recipes

### Honey Toast 🍯🍞 — 50 points (35 s)

> Cooked bread + raw honey

1. Press `D` at the **Bread** crate (row 10, col 5) — you now hold raw bread
2. Press `D` at any **Stove** — bread starts cooking
3. Wait until the bar turns **green**
4. Press `D` at the **Plate Stack** — hold a clean plate
5. Press `D` at the Stove — cooked bread loads onto your plate
6. Press `D` at the **Honey** crate (row 10, col 1) — honey goes straight onto the plate
7. Press `D` at the **Serve Window** — done!

---

### Salad 🥗 — 60 points (30 s)

> Chopped lettuce + chopped tomato

1. Press `D` at the **Lettuce** crate — hold raw lettuce
2. Press `D` at a **Chopping Board** — place it
3. Press `W` to chop
4. Press `D` at the **Plate Stack** — hold a plate
5. Press `D` at the Chopping Board — chopped lettuce goes on the plate
6. Press `D` at the **Tomato** crate — hold raw tomato
7. Press `D` at a Chopping Board — place it
8. Press `W` to chop
9. Press `D` at the Chopping Board — chopped tomato goes on the plate
10. Press `D` at the **Serve Window** — done!

**Tip:** Chop both ingredients before grabbing a plate to save steps.

---

### Honey Burger 🍔 — 120 points (50 s)

> Cooked bread + cooked meat + chopped lettuce

This is the most complex 3-ingredient order. Start cooking bread and meat first, then handle lettuce while they cook.

1. Press `D` at **Bread** — hold raw bread → place on a Stove
2. Press `D` at **Meat** (row 12, col 1) — hold raw meat → place on a second Stove
3. While both cook, go to **Lettuce** — hold raw lettuce → Chopping Board → press `W` to chop
4. Press `D` at the **Plate Stack** — hold a plate
5. When the bread bar turns green: press `D` at that Stove — bread on plate
6. When the meat bar turns green: press `D` at that Stove — meat on plate
7. Press `D` at the Chopping Board — chopped lettuce on plate
8. Press `D` at the **Serve Window** — done!

---

### Berry Bowl 🫐🍯 — 40 points (25 s)

> Raw blueberry + raw honey

The fastest order — no cooking or chopping needed.

1. Press `D` at the **Plate Stack** — hold a plate
2. Press `D` at the **Blueberry** crate (row 12, col 10) — goes straight onto plate
3. Press `D` at the **Honey** crate — goes straight onto plate
4. Press `D` at the **Serve Window** — done!

---

### Carrot Soup 🥣 — 80 points (40 s)

> Chopped-then-cooked carrot + chopped tomato

Carrot is the only ingredient that requires **both** steps — it must be chopped first, then cooked. The stove will refuse a raw carrot and tell you to chop it first.

1. Press `D` at **Carrot** (row 12, col 7) — hold raw carrot
2. Press `D` at a **Chopping Board** — place it
3. Press `W` to chop
4. Press `D` at the Chopping Board — hold chopped carrot
5. Press `D` at a **Stove** — place chopped carrot to cook
6. While the carrot cooks, go to **Tomato** → Chopping Board → press `W` to chop
7. Press `D` at the **Plate Stack** — hold a plate
8. When the carrot bar turns green: press `D` at the Stove — carrot on plate
9. Press `D` at the Chopping Board — chopped tomato on plate
10. Press `D` at the **Serve Window** — done!

---

### Fruit Cake 🎂 — 150 points (55 s)

> Chopped watermelon + raw blueberry + chopped strawberry

This is the final challenge order. It only appears in the last 90 seconds of a game. Worth the most points of any dish.

1. Press `D` at **Watermelon** (row 12, col 13) — hold raw watermelon
2. Press `D` at a **Chopping Board** → press `W` to chop
3. Press `D` at **Strawberry** (row 12, col 18) — hold raw strawberry
4. Press `D` at a **Chopping Board** → press `W` to chop
5. Press `D` at the **Plate Stack** — hold a plate
6. Press `D` at the Chopping Board with watermelon — on plate
7. Press `D` at the Chopping Board with strawberry — on plate
8. Press `D` at the **Blueberry** crate — goes straight onto plate
9. Press `D` at the **Serve Window** — done!

---

## Scoring

- **Matched order** → full points (see recipe table above)
- **Quick serve bonus** → extra tip if served with more than 50% of the order timer remaining
- **Wrong serve** → −15 points, plate returns as dirty
- **Expired order** → points penalty (varies by difficulty)

---

## Difficulty

| Mode | Time | Max Orders | Order Rate | Starting Plates |
|------|------|------------|------------|-----------------|
| Easy 🌼 | 3:30 | 3 | every 14 s | 6 |
| Medium 🍯 | 6:00 | 4 | every 10 s | 4 |
| Hard 🔥 | 4:00 | 5 | every 7 s | 3 |

Plates are never permanently lost — trashed plates and wrong serves both return to the dirty queue.

---

## Running Locally

```bash
# Requires Node.js 20+ and pnpm
pnpm install
pnpm dev
```

Open the URL Vite prints (usually `http://localhost:3000`). See [instructions.md](instructions.md) for full setup details, Windows/Ubuntu steps, and build commands.
