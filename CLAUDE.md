# DevGourmet - Development Guide

## Project Overview

DevGourmet is an interactive recipe application that transforms cooking recipes into executable "code". It combines the aesthetics of a developer IDE with practical cooking functionality, allowing users to interact with recipes as if they were programming.

## Tech Stack

### Core Technologies
- **Package Manager**: Bun (exclusively)
- **Build Tool**: Vite
- **Framework**: React 18+
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4

### Key Libraries
- **Animations**: Framer Motion (to be added later)
- **State Management**: React hooks + Context API
- **Parsing**: Custom recipe DSL parser
- **Code Highlighting**: Custom syntax highlighter for DevScript

## Architecture Principles

### Code Quality
- **Clean Code**: Follow SOLID principles
- **Type Safety**: Comprehensive TypeScript types, no `any`
- **Maintainability**: Small, focused components with single responsibility
- **Documentation**: JSDoc comments for complex logic
- **Testing**: Unit tests for parser and core logic

### Project Structure
```
src/
├── components/          # React components
│   ├── RecipeEditor/   # Code editor component
│   ├── IngredientList/ # Dynamic ingredient display
│   ├── StepExecutor/   # Step-by-step execution UI
│   ├── Console/        # Execution log output
│   └── Timer/          # Interactive timer component
├── parser/             # DevScript language parser
│   ├── lexer.ts       # Tokenization
│   ├── parser.ts      # AST generation
│   └── interpreter.ts # Recipe execution logic
├── types/             # TypeScript definitions
├── utils/             # Helper functions
├── hooks/             # Custom React hooks
├── context/           # React context providers
├── recipes/           # Demo recipe files
└── styles/            # Global styles and Tailwind config
```

## Development Workflow

### Initial Setup
```bash
# Bootstrap project
bun create vite devgourmet --template react-ts

# Install dependencies
bun install

# Add Tailwind CSS v4
bun add tailwindcss@next @tailwindcss/vite@next

# Add development dependencies
bun add -d @types/node
```

### Development Commands
```bash
# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Type checking
bun run tsc --noEmit
```

## Core Concepts

### DevScript Language
A simple, readable recipe DSL that looks like JavaScript:
- Variables: `let servings = 4;`
- Math expressions: `200 * servings / 2`
- Function calls: `add("flour", 200, "grams")`
- Comments: `// Optional notes`
- Timers: `cook(7, "minutes")`

### Parser Architecture
1. **Lexer**: Converts raw text into tokens
2. **Parser**: Builds Abstract Syntax Tree (AST)
3. **Interpreter**: Executes AST and generates actions
4. **Reactive Updates**: Re-parses on variable changes

### State Management
- **Recipe State**: Current recipe code, variables, parsed AST
- **Execution State**: Current step, timer status, console output
- **UI State**: Theme, view mode, active tooltips

## Design System

### Theme
- **Primary**: Dark IDE theme (VS Code inspired)
- **Accent**: Syntax highlighting colors
- **Typography**: Monospace for code, sans-serif for UI
- **Colors**:
  - Background: `#1e1e1e`
  - Foreground: `#d4d4d4`
  - Keywords: `#569cd6`
  - Functions: `#dcdcaa`
  - Strings: `#ce9178`
  - Numbers: `#b5cea8`

### Component Patterns
- Composition over inheritance
- Controlled components for forms
- Custom hooks for complex logic
- Context for global state
- Props interfaces for all components

## Performance Considerations

- Memoize parser output
- Debounce editor updates
- Virtual scrolling for long recipes
- Code splitting for routes
- Lazy loading for demo recipes

## Accessibility

- Semantic HTML
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance (WCAG AA)

## Deployment

- Static build output
- Deploy to: Vercel, Netlify, or GitHub Pages
- No backend required
- Environment variables for future API integration

## Future Extensions

- AI recipe generation
- Voice commands
- Mobile cooking assistant
- Recipe validation
- Export functionality
- Multi-language support
- Recipe community/sharing
