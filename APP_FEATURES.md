# DevGourmet — Feature Breakdown

## 🎯 Core Idea

DevGourmet turns recipes into interactive developer-style code, where:

- Recipes look like a simple, readable programming language
- You can change variables like servings or spiciness
- Ingredient quantities, steps, and timers update automatically
- Every action (like `cook(7, "minutes")`) is interactive

---

## 🧠 Core Features

### 1. DevScript Recipe Format

A fun, readable "recipe language" inspired by JavaScript:

```javascript
let servings = 2;

add("flour", 200 * servings, "grams");
add("egg", 2 * servings);
mix("until smooth");
cook(7, "minutes"); // ▶️
serve("warm");
```

**Capabilities:**
- Declare variables (`let servings = 4;`)
- Perform simple math (e.g., `200 * servings / 2`)
- Use "functions" for actions (`add()`, `mix()`, `cook()`, `serve()`)
- Include comments (`// optional notes`)
- Use placeholders for optional flavor (e.g., `spiciness = 3`)

---

### 2. Live Variable System

- Variables like `servings`, `sweetness`, or `spiciness` can be edited interactively
- Adjusting a variable instantly updates:
  - Ingredient amounts
  - Timers
  - Step text where relevant
- Optional sliders or inputs appear automatically for numeric values

---

### 3. Dynamic Ingredient Calculation

- The app detects all `add("ingredient", amount, unit)` lines
- Computes the actual quantities based on current variable values
- Updates in real time as you change variables
- Displays ingredients in a clean list format:

```
🥚 4 eggs
🥛 600 ml milk
🌾 400 g flour
```

---

### 4. Step-by-Step Recipe Execution

Each recipe action behaves like a line of code being "executed":

**Example flow:**
```
> Adding 200g flour
> Adding 2 eggs
> Mixing until smooth
> Cooking for 7 minutes...
> Serving warm!
```

- User can "run" the recipe one line at a time (like stepping through a program)
- The current step highlights visually
- Supports manual step or auto-play (with timing for each step)

---

### 5. Timers and Playable Steps

When a recipe calls a time-based step (e.g. `cook(7, "minutes")`):

- A play button appears next to the code line
- Starting the timer shows:
  - Countdown (7:00 → 0:00)
  - Progress bar
  - Optional alert/sound at completion
- The console logs the event (`> Cooking complete!`)

---

### 6. Readable "Console Output"

A dynamic "execution log" shows every action as if the recipe were running:

```
> Variable change: servings = 4
> Added 400g flour
> Mixing until smooth...
> Timer started: 7 minutes
```

- Updates live as user interacts
- Reinforces the "developer + cooking" metaphor

---

### 7. Smart Tooltips / Explanations

Hovering over a function (or touching on mobile) reveals a friendly hint:

- `add()` → "Add an ingredient to the bowl."
- `mix()` → "Combine ingredients until even texture."
- `cook()` → "Start the cooking or baking process."
- `serve()` → "Presentation and plating step."

Makes the interface fun and educational, even for non-programmers.

---

### 8. Real-time Parsing and Feedback

- The system continuously interprets the written recipe code
- Detects syntax-like errors (e.g., missing parentheses or commas)
- Highlights or warns gracefully — not like a compiler, but like a cooking assistant
- Updates ingredient/step lists automatically whenever valid changes are detected

---

### 9. Ingredient Scaling Logic

- Recipes automatically adjust based on base amounts and variable scaling
- **Example:** If original `flour = 200 * servings` and `servings = 3` → `flour = 600g`
- Supports chained relationships (e.g., `batter_thickness = milk / flour`)

---

### 10. Theme & Aesthetic

- Dark "developer IDE" theme, light text
- Syntax highlighting for keywords and functions
- Option to toggle between **Dev Mode** (code view) and **Chef Mode** (clean summary)
- Subtle animations for code "execution" (lines glowing, small motion when a step runs)

---

### 11. Recipe Sharing / Loading

(Optional in static version, but useful for expansion)

- Recipes are stored as text (like `.devgourmet` files or JSON)
- Each recipe can be shared via URL or loaded from local storage
- "Fork this recipe" button copies it into the editor

---

### 12. Demo Recipes

Include a few predefined recipes that show off the format:

- 🥞 **Pancakes**
- 🍝 **Spaghetti**
- 🍪 **Cookies**

Each demonstrates:
- Variable scaling (servings)
- Timers (`cook(10, "minutes")`)
- Tooltips & steps
- Conditional logic (optional)

---

### 13. Accessibility & Non-Developer Friendliness

Even though it looks like code, it should feel approachable:

- Variables can be edited without typing (click → edit)
- Tooltips explain terms in plain English
- Steps and ingredients are always visible beside the "code"
- "Run Recipe" button lets non-coders follow along without editing

---

### 14. Offline & Static Functionality

- Everything runs in the browser
- Recipes, logic, and interactions work without a backend
- Works as a static build (can be deployed via GitHub Pages, Vercel, or Netlify)

---

### 15. Future-Ready Extensions (Optional)

For later development:

- **AI recipe generation** → auto-create DevScript code from a text prompt
- **Voice mode** ("Run next step" by voice command)
- **Mobile cooking assistant view** with big timer UI
- **Recipe validation** ("Missing ingredient: sugar")
- **Export as Markdown or PDF**

---

## 🎨 Animations & Polish

- **Framer Motion** for smooth transitions and interactions
- Line-by-line code execution animations
- Smooth variable slider interactions
- Timer progress animations
- Console output typing effect
- Hover effects on interactive elements
- Step highlighting with glow effects

*Note: Animations can be added incrementally after core functionality is implemented.*

---

## 📱 Responsive Design

- Desktop-first approach with full IDE experience
- Tablet: Side-by-side code and output
- Mobile: Stacked layout with swipeable views
- Touch-friendly controls for mobile cooking

---

## 🔧 Technical Implementation Priority

### Phase 1: Foundation
1. Project setup (Vite + React + TypeScript + Tailwind v4)
2. DevScript parser (lexer, parser, interpreter)
3. Basic recipe editor component
4. Variable system and reactive updates

### Phase 2: Core Features
5. Ingredient list with dynamic calculations
6. Step-by-step execution UI
7. Console output component
8. Timer functionality

### Phase 3: Polish
9. Syntax highlighting
10. Tooltips and help system
11. Theme system (Dev/Chef mode toggle)
12. Demo recipes

### Phase 4: Enhancement
13. Animations (Framer Motion)
14. Recipe sharing/loading
15. Accessibility improvements
16. Mobile optimization

---

## 🎯 Success Metrics

- **Usability**: Non-developers can follow recipes
- **Interactivity**: All variables and timers work smoothly
- **Performance**: Parser updates in <100ms
- **Aesthetics**: Looks professional and polished
- **Maintainability**: Clean, documented, testable code
