# 👨‍💻🍳 DevGourmet

**Cook recipes like you write code. Save, share, and collaborate.**

DevGourmet is an interactive recipe application that transforms cooking into an IDE-like experience. Write recipes in a simple, readable "DevScript" language, adjust variables dynamically, execute steps like running a program, and now—save, share, and manage your recipes with authentication and cloud persistence.

---

## ✨ Features

### Core Features
- 📝 **DevScript Language**: Write recipes that look like clean, readable code with full parser support (lexer, parser, interpreter)
- 🔢 **Bidirectional Variable Sync**: Change servings or spice level via sliders—updates ingredients AND code in real-time
- ⏱️ **Interactive Timers**: Every `cook()` step becomes a playable countdown with play/pause/stop controls
- 📊 **Dynamic Calculations**: Ingredient amounts scale automatically based on variables
- 🎯 **Step-by-Step Execution**: Navigate through recipe steps with visual progress tracking
- 🎨 **IDE Theme**: Beautiful VS Code Dark+ inspired theme with syntax colors
- 📱 **Fully Responsive**: Optimized layouts for mobile, tablet, and desktop
- 🍽️ **Smart Ingredients**: Automatic emoji detection for 40+ common ingredients
- 📁 **Media Resources**: Add images, videos, and links to your recipes
- 🎭 **Welcome Overlay**: Animated welcome screen with cookie consent

### New: Recipe Management & Authentication 🔐
- 👤 **User Accounts**: Sign up and sign in with email/password
- 💾 **Cloud Persistence**: Save your recipes to the cloud
- 🔒 **Private Recipes**: Keep your recipes private or share them publicly
- 🔗 **Recipe Sharing**: Generate shareable links for your public recipes
- 📚 **Recipe Library**: Browse and manage all your saved recipes
- ✏️ **Full CRUD**: Create, read, update, and delete your recipes

---

## 🏗️ Architecture

DevGourmet is built as a **monorepo** with a clean separation between frontend and backend:

```
devgourmet/
├── apps/
│   ├── web/              # React frontend (Vite + TypeScript + Tailwind)
│   └── server/           # Hono backend (Bun + tRPC + Drizzle + BetterAuth)
├── packages/
│   └── shared/           # Shared TypeScript types
└── ...
```

### Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS v4
- tRPC client (type-safe API calls)
- Motion (animations)
- Phosphor Icons
- shadcn/ui components

**Backend:**
- Bun (runtime)
- Hono (web framework)
- tRPC (type-safe API layer)
- BetterAuth (authentication)
- Drizzle ORM (database)
- SQLite (database)

---

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.0+

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd devgourmet

# Install dependencies (installs all workspace packages)
bun install

# Set up environment variables
# Backend:
cd apps/server
cp .env.example .env
# Edit .env and add your configuration:
# - DATABASE_URL (SQLite file path)
# - BETTER_AUTH_SECRET (random secret for JWT)
# - BETTER_AUTH_URL (your backend URL)

# Frontend:
cd ../web
cp .env.example .env
# Edit .env and add:
# - VITE_API_URL (backend URL, e.g., http://localhost:3000)

# Run database migrations
cd ../../
bun run db:migrate

# Start development servers (from root)
bun run dev
```

This will start:
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:3000`

### First Time Setup

1. Open `http://localhost:5173` in your browser
2. Accept the welcome overlay cookie consent
3. Sign up for an account (or browse demo recipes without signing in)
4. Start creating, saving, and sharing recipes!

---

## 📖 DevScript Example

```javascript
// Simple Pancakes Recipe
let servings = 4;
let sweetness = 2; // 1-5 scale

// Add ingredients
ingredient("flour", 200 * servings, "grams");
ingredient("milk", 300 * servings, "ml");
ingredient("egg", 2 * servings);
ingredient("sugar", 10 * sweetness, "grams");

// Add visual reference
image("Pancake Batter", "https://example.com/batter.jpg", "Smooth consistency");

// Cooking steps
mix("until smooth");
rest(5, "minutes");
cook(3, "minutes"); // ▶️ Play button appears
flip();
cook(2, "minutes");
serve("warm with syrup");
```

### Available Functions

**Ingredients:**
- `add(name, amount, unit?)` or `ingredient(name, amount, unit?)` - Add an ingredient

**Actions:**
- `mix(description)` - Mix ingredients
- `cook(duration, unit)` - Cook with timer
- `bake(duration, unit)` - Bake with timer
- `rest(duration, unit)` - Rest/wait with timer
- `flip()` - Flip item
- `heat(description)` - Heat something
- `cool(description)` - Cool something
- `stir(description)` - Stir ingredients
- `whisk(description)` - Whisk ingredients
- `blend(description)` - Blend ingredients
- `chop(description)` - Chop ingredients
- `dice(description)` - Dice ingredients
- `slice(description)` - Slice ingredients
- `preheat(temp, unit)` - Preheat oven
- `boil(description)` - Boil ingredients
- `simmer(duration, unit)` - Simmer with timer
- `fry(description)` - Fry ingredients
- `sauté(description)` - Sauté ingredients
- `grill(description)` - Grill ingredients
- `roast(description)` - Roast ingredients
- `steam(description)` - Steam ingredients
- `knead(description)` - Knead dough
- `fold(description)` - Fold ingredients
- `season(description)` - Season food
- `pour(description)` - Pour liquid
- `serve(description)` - Serve dish
- `step(description)` - Generic custom step

**Resources:**
- `resource(name, url, description?)` - Add a link resource
- `image(name, url, description?)` - Add an image
- `video(name, url, description?)` - Add a video link

**Help:**
- `help()` - Show syntax guide in console

---

## 🗄️ Database Schema

```typescript
// users (managed by BetterAuth)
- id: uuid (primary key)
- email: string (unique)
- password: string (hashed)
- emailVerified: boolean
- createdAt: timestamp
- updatedAt: timestamp

// recipes
- id: uuid (primary key)
- userId: uuid (nullable, foreign key to users.id)
- title: string (max 200 chars)
- recipeCode: text (DevScript code)
- isPublic: boolean (default: false)
- createdAt: timestamp
- updatedAt: timestamp
- deletedAt: timestamp (nullable, soft delete)
```

**Demo Recipes:** Recipes with `userId = null` are public demo recipes visible to everyone.

---

## 📜 Available Scripts

### Root (Monorepo)

```bash
# Start both frontend and backend dev servers
bun run dev

# Build all apps for production
bun run build

# Run database migrations
bun run db:migrate

# Generate database migrations
bun run db:generate

# Open Drizzle Studio (database GUI)
bun run db:studio
```

### Frontend Only (`apps/web`)

```bash
cd apps/web

# Start dev server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Type check
bun run tsc --noEmit
```

### Backend Only (`apps/server`)

```bash
cd apps/server

# Start dev server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

---

## 🚀 Production Deployment

### Prerequisites

- VPS or cloud server with Docker installed
- Domain name configured (optional but recommended)
- SSL certificate (via Let's Encrypt/Certbot)

### Build the Application

```bash
# Build both frontend and backend
bun run build
```

### Deploy with Docker Compose

The project includes Docker Compose configuration for easy deployment.

**1. Prepare the server:**

```bash
# On your server, create directory structure
mkdir -p /www/devgourmet.com/{web,server,data}
```

**2. Sync files to server:**

```bash
# Sync frontend build
rsync -avz --delete \
  apps/web/dist/ \
  user@your-server:/www/devgourmet.com/web/

# Sync backend
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude 'dist' \
  apps/server/ \
  user@your-server:/www/devgourmet.com/server/

# Sync Docker configuration
rsync -avz \
  docker-compose.yml \
  nginx.conf \
  user@your-server:/www/devgourmet.com/
```

**3. Configure environment variables on server:**

```bash
# SSH into server
ssh user@your-server

cd /www/devgourmet.com

# Create .env files
cat > server/.env << EOF
DATABASE_URL=file:../data/devgourmet.db
BETTER_AUTH_SECRET=<generate-random-secret>
BETTER_AUTH_URL=https://api.yourdomain.com
NODE_ENV=production
EOF

cat > web/.env << EOF
VITE_API_URL=https://api.yourdomain.com
EOF
```

**4. Start services:**

```bash
# Start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

**5. Configure nginx reverse proxy (on host):**

```nginx
# /etc/nginx/sites-available/devgourmet

# Frontend
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Backend API
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Update Deployment

```bash
# Rebuild locally
bun run build

# Sync to server
rsync -avz --delete apps/web/dist/ user@your-server:/www/devgourmet.com/web/
rsync -avz --delete --exclude 'node_modules' apps/server/ user@your-server:/www/devgourmet.com/server/

# On server: restart containers
ssh user@your-server "cd /www/devgourmet.com && docker-compose restart"
```

---

## 🎯 Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Vite + React + TypeScript
- [x] Tailwind CSS v4 configuration
- [x] DevScript parser (lexer, parser, interpreter)
- [x] Core type definitions

### Phase 2: Core Features ✅
- [x] Recipe editor with live code editing
- [x] Live variable system with bidirectional sync
- [x] Ingredient list with dynamic calculations
- [x] Step-by-step execution engine
- [x] Timer functionality with play/pause/stop

### Phase 3: UI/UX Polish ✅
- [x] IDE-style theme implementation (VS Code Dark+)
- [x] Responsive design (mobile/tablet/desktop)
- [x] Error display and validation
- [x] Interactive variable controls (sliders + number inputs)
- [x] Media resources (images, videos, links)
- [x] Welcome overlay with cookie consent
- [x] Phosphor icons integration

### Phase 4: Backend & Authentication 🚧
- [x] Monorepo structure with Better T Stack
- [x] Hono backend with tRPC
- [x] BetterAuth email/password authentication
- [x] Drizzle ORM + SQLite database
- [x] Recipe CRUD API endpoints
- [x] Recipe Management UI (replacing Console)
- [x] Public/private recipe sharing
- [ ] Recipe discovery (browse public recipes)
- [ ] User profiles

### Phase 5: Future Extensions
- [ ] OAuth providers (Google, GitHub)
- [ ] Recipe forking/remixing
- [ ] Recipe comments and ratings
- [ ] AI recipe generation
- [ ] Voice commands
- [ ] Recipe validation and suggestions
- [ ] Export to Markdown/PDF
- [ ] Recipe collections/cookbooks
- [ ] Collaborative editing

---

## 🏗️ Project Structure

```
devgourmet/
├── apps/
│   ├── web/                    # Frontend React application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── RecipeEditor/     # Code editor
│   │   │   │   ├── IngredientList/   # Dynamic ingredients
│   │   │   │   ├── StepExecutor/     # Step execution
│   │   │   │   ├── Resources/        # Media gallery
│   │   │   │   ├── RecipeManagement/ # Recipe CRUD UI
│   │   │   │   ├── WelcomeOverlay/   # Welcome screen
│   │   │   │   └── ui/               # shadcn/ui components
│   │   │   ├── parser/
│   │   │   │   ├── lexer.ts          # Tokenization
│   │   │   │   ├── parser.ts         # AST generation
│   │   │   │   └── interpreter.ts    # Recipe execution
│   │   │   ├── context/              # React context
│   │   │   ├── lib/                  # Utilities
│   │   │   ├── types/                # TypeScript types
│   │   │   ├── recipes/              # Demo recipes
│   │   │   └── App.tsx
│   │   └── package.json
│   │
│   └── server/                 # Backend Hono application
│       ├── src/
│       │   ├── index.ts              # Main server
│       │   ├── db/
│       │   │   ├── schema.ts         # Drizzle schema
│       │   │   └── migrations/       # Database migrations
│       │   ├── auth/
│       │   │   └── config.ts         # BetterAuth setup
│       │   └── api/
│       │       ├── trpc.ts           # tRPC setup
│       │       └── routers/
│       │           ├── auth.ts       # Auth routes
│       │           └── recipes.ts    # Recipe CRUD routes
│       └── package.json
│
├── packages/
│   └── shared/                 # Shared code
│       ├── types/                    # Shared TypeScript types
│       └── package.json
│
├── docker-compose.yml          # Docker deployment
├── nginx.conf                  # nginx configuration
├── CLAUDE.md                   # Development guide
├── APP_FEATURES.md             # Feature specifications
└── README.md                   # This file
```

---

## 🔐 Authentication Flow

1. **Unauthenticated User:**
   - Can view and interact with demo recipes
   - Can write recipes but cannot save them
   - Prompted to sign up to save recipes

2. **Sign Up:**
   - Enter email and password
   - BetterAuth creates account with hashed password
   - Auto-login after signup

3. **Sign In:**
   - Enter email and password
   - Receive session token (stored in httpOnly cookie)
   - Access to personal recipe library

4. **Authenticated User:**
   - View own recipes + demo recipes
   - Create new recipes (auto-saved to database)
   - Edit and delete own recipes
   - Toggle recipes public/private
   - Generate shareable links for public recipes

5. **Sign Out:**
   - Session invalidated
   - Redirected to demo recipes view

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

- Built with [Better T Stack](https://github.com/Snazzah/create-better-t-stack)
- Icons by [Phosphor Icons](https://phosphoricons.com/)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Inspired by developer tools and IDEs
- Designed for both developers and home cooks

---

**Happy Cooking! 👨‍💻🍳**

*Turn your recipes into code, save them to the cloud, and share them with the world.*
