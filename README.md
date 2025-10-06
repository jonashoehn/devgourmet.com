# 👨‍💻🍳 DevGourmet

**Cook recipes like you write code.**

DevGourmet is an interactive recipe application that transforms cooking into an IDE-like experience. Write recipes in a simple, readable "DevScript" language, adjust variables dynamically, and execute steps like running a program.

---

## ✨ Features

- 📝 **DevScript Language**: Write recipes that look like clean, readable code with full parser support (lexer, parser, interpreter)
- 🔢 **Bidirectional Variable Sync**: Change servings or spice level via sliders—updates ingredients AND code in real-time
- ⏱️ **Interactive Timers**: Every `cook()` step becomes a playable countdown with play/pause/stop controls
- 📊 **Dynamic Calculations**: Ingredient amounts scale automatically based on variables
- 🎯 **Step-by-Step Execution**: Navigate through recipe steps with visual progress tracking
- 💬 **Console Output**: See every action logged in real-time with color-coded messages
- 🎨 **IDE Theme**: Beautiful VS Code Dark+ inspired theme with syntax colors
- 📱 **Fully Responsive**: Optimized layouts for mobile, tablet, and desktop
- 🍽️ **Smart Ingredients**: Automatic emoji detection for 40+ common ingredients
- ✏️ **Live Editing**: Code editor with 500ms debounce and tab key support
- 🎛️ **Dual Controls**: Adjust variables with both sliders (1-20 range) and number inputs

---

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) (v1.0+)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd devgourmet

# Install dependencies
bun install

# Start development server
bun run dev
```

The app will be available at `http://localhost:5173`

### Demo Recipes

Try out these included recipes:
- 🥞 **Classic Pancakes** - Simple breakfast with adjustable servings and sweetness
- 🍝 **Spaghetti Marinara** - Italian pasta with customizable servings and spice level
- 🍪 **Chocolate Chip Cookies** - Classic cookies with batch size control
- 🥦 **Creamy Broccoli Fusilli** - Pasta with broccoli, anchovies, and adjustable spice

---

## 📖 DevScript Example

```javascript
// Simple Pancakes Recipe
let servings = 4;
let sweetness = 2; // 1-5 scale

add("flour", 200 * servings, "grams");
add("milk", 300 * servings, "ml");
add("egg", 2 * servings);
add("sugar", 10 * sweetness, "grams");

mix("until smooth");
rest(5, "minutes");
cook(3, "minutes"); // ▶️ Play button appears
flip();
cook(2, "minutes");
serve("warm with syrup");
```

**What happens:**
- Change `servings` slider from 4 to 8 → all ingredients double AND code updates automatically
- Adjust `sweetness` → sugar amount changes in real-time in both ingredients list and calculations
- Click ▶️ next to `cook(3, "minutes")` → timer starts with visual countdown and progress bar
- Each step logs to the console with color-coded messages (info, success, error, variable changes)
- Edit code directly → ingredients and steps re-parse instantly with 500ms debounce

---

## 🎯 Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Vite + React + TypeScript
- [x] Tailwind CSS v4 configuration
- [x] Basic project structure
- [x] DevScript parser (lexer, parser, interpreter)
- [x] Core type definitions

### Phase 2: Core Features ✅
- [x] Recipe editor with live code editing
- [x] Live variable system with bidirectional sync
- [x] Ingredient list with dynamic calculations
- [x] Step-by-step execution engine
- [x] Console output component
- [x] Timer functionality with play/pause/stop

### Phase 3: UI/UX Polish ✅
- [x] IDE-style theme implementation (VS Code Dark+)
- [x] Responsive design (mobile/tablet/desktop)
- [x] Error display and validation
- [x] Interactive variable controls (sliders + number inputs)

### Phase 4: Content & Enhancement ✅
- [x] Demo recipes (Pancakes, Spaghetti, Cookies, Broccoli Fusilli)
- [x] Recipe loading system
- [x] Real-time ingredient emoji mapping
- [ ] Recipe sharing/loading from localStorage
- [ ] Framer Motion animations
- [ ] Accessibility improvements (ARIA labels, keyboard nav)

### Phase 5: Future Extensions
- [ ] Syntax highlighting in editor
- [ ] AI recipe generation
- [ ] Voice commands
- [ ] Recipe validation and suggestions
- [ ] Export to Markdown/PDF
- [ ] Dev Mode / Chef Mode toggle
- [ ] Recipe comments and notes

---

## 🏗️ Project Structure

```
devgourmet/
├── src/
│   ├── components/          # React components
│   │   ├── RecipeEditor/   # Live code editor with debounce
│   │   ├── IngredientList/ # Dynamic ingredients with variable controls
│   │   ├── StepExecutor/   # Step-by-step navigation UI
│   │   ├── Console/        # Execution log with message filtering
│   │   └── Timer/          # Interactive timer with play/pause/stop
│   ├── parser/             # DevScript language implementation
│   │   ├── lexer.ts       # Tokenization (22 token types)
│   │   ├── parser.ts      # AST generation with expression parsing
│   │   └── interpreter.ts # Recipe execution with 15+ built-in functions
│   ├── types/             # TypeScript definitions
│   │   ├── tokens.ts      # Token and TokenType definitions
│   │   ├── ast.ts         # AST node types
│   │   └── recipe.ts      # Recipe state and execution types
│   ├── context/           # State management
│   │   └── RecipeContext.tsx  # Global recipe state with React Context
│   ├── recipes/           # Demo recipe collection
│   │   ├── pancakes.ts
│   │   ├── spaghetti.ts
│   │   ├── cookies.ts
│   │   ├── broccoli-fusilli.ts
│   │   └── index.ts
│   ├── App.tsx            # Main app with responsive layout
│   └── index.css          # Tailwind imports + CSS variables
├── CLAUDE.md              # Development guide for AI assistants
├── APP_FEATURES.md        # Complete feature specifications
└── README.md              # This file
```

---

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh) v1.0+ (package manager & runtime)
- **Build Tool**: [Vite](https://vitejs.dev/) 6.0+ (fast dev server & build)
- **Framework**: [React 19](https://react.dev/) (with hooks & context)
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.6+ (strict mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (with @tailwindcss/vite plugin)
- **State Management**: React Context API (RecipeContext)
- **Parser**: Custom implementation (Lexer → Parser → Interpreter)
- **Animations**: CSS transitions + Tailwind utilities

### Key Implementation Details

- **Debounced Updates**: 500ms debounce on code editor changes to optimize re-parsing
- **Bidirectional Sync**: Variable changes update both code and UI via regex-based line replacement
- **Timer System**: Client-side countdown with start/pause/resume/stop controls
- **Responsive Layout**: Flexbox with Tailwind breakpoints (mobile: stacked, desktop: split-pane)
- **Error Handling**: Comprehensive try-catch with user-friendly error messages

---

## 📜 Available Scripts

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Type check
bun run tsc --noEmit

# Lint code
bun run lint
```

---

## 🎨 Design System

### Color Palette

The app uses a VS Code Dark+ inspired theme:

- **Background**: `#1e1e1e` (IDE dark)
- **Foreground**: `#d4d4d4` (Light text)
- **Accent**: `#007acc` (Blue)
- **Syntax Colors**:
  - Keywords: `#569cd6` (Blue)
  - Functions: `#dcdcaa` (Yellow)
  - Strings: `#ce9178` (Orange)
  - Numbers: `#b5cea8` (Light green)
  - Comments: `#6a9955` (Green)

---

## 🤝 Contributing

Contributions are welcome! Please read the development guide in `CLAUDE.md` for coding standards and architecture details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🙏 Acknowledgments

- Inspired by developer tools and IDEs
- Built with modern web technologies
- Designed for both developers and home cooks

---

**Happy Cooking! 👨‍💻🍳**

*Turn your recipes into code, and your kitchen into an IDE.*
