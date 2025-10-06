# 👨‍💻🍳 DevGourmet

**Cook recipes like you write code.**

DevGourmet is an interactive recipe application that transforms cooking into an IDE-like experience. Write recipes in a simple, readable "DevScript" language, adjust variables dynamically, and execute steps like running a program.

---

## ✨ Features

- 📝 **DevScript Language**: Write recipes that look like clean, readable code
- 🔢 **Live Variables**: Change servings, spiciness, or any value—ingredients update instantly
- ⏱️ **Interactive Timers**: Every `cook()` step becomes a playable countdown
- 📊 **Dynamic Calculations**: Ingredient amounts scale automatically
- 🎯 **Step-by-Step Execution**: Run recipes line by line like debugging code
- 💬 **Console Output**: See every action logged in real-time
- 🎨 **IDE Theme**: Beautiful dark theme inspired by VS Code
- ♿ **Accessible**: Works for both developers and non-technical users

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
- Change `servings` from 4 to 8 → all ingredients double automatically
- Click ▶️ next to `cook(3, "minutes")` → timer starts with countdown
- Each line logs to the console as it "executes"

---

## 🎯 Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Vite + React + TypeScript
- [x] Tailwind CSS v4 configuration
- [x] Basic project structure
- [ ] DevScript parser (lexer, parser, interpreter)
- [ ] Core type definitions

### Phase 2: Core Features
- [ ] Recipe editor with syntax highlighting
- [ ] Live variable system
- [ ] Ingredient list with dynamic calculations
- [ ] Step-by-step execution engine
- [ ] Console output component
- [ ] Timer functionality

### Phase 3: UI/UX Polish
- [ ] IDE-style theme implementation
- [ ] Tooltips and help system
- [ ] Dev Mode / Chef Mode toggle
- [ ] Responsive design (mobile/tablet)

### Phase 4: Content & Enhancement
- [ ] Demo recipes (Pancakes, Spaghetti, Cookies)
- [ ] Recipe sharing/loading from localStorage
- [ ] Framer Motion animations
- [ ] Accessibility improvements

### Phase 5: Future Extensions
- [ ] AI recipe generation
- [ ] Voice commands
- [ ] Recipe validation
- [ ] Export to Markdown/PDF

---

## 🏗️ Project Structure

```
devgourmet/
├── src/
│   ├── components/          # React components
│   │   ├── RecipeEditor/   # Code editor
│   │   ├── IngredientList/ # Dynamic ingredients
│   │   ├── StepExecutor/   # Step-by-step UI
│   │   ├── Console/        # Execution log
│   │   └── Timer/          # Interactive timer
│   ├── parser/             # DevScript language
│   │   ├── lexer.ts       # Tokenization
│   │   ├── parser.ts      # AST generation
│   │   └── interpreter.ts # Recipe execution
│   ├── types/             # TypeScript definitions
│   ├── utils/             # Helper functions
│   ├── hooks/             # Custom React hooks
│   ├── context/           # React context
│   ├── recipes/           # Demo recipes
│   └── App.tsx            # Main app component
├── CLAUDE.md              # Development guide
├── APP_FEATURES.md        # Feature specifications
└── README.md              # This file
```

---

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) *(coming soon)*

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
