import { useState } from 'react';
import { RecipeProvider, useRecipe } from './context/index.js';
import { RecipeEditor } from './components/RecipeEditor/index.js';
import { IngredientList } from './components/IngredientList/index.js';
import { StepExecutor } from './components/StepExecutor/index.js';
import { Console } from './components/Console/index.js';
import { demoRecipes, pancakesRecipe, spaghettiRecipe, cookiesRecipe, broccoliFusilliRecipe } from './recipes/index.js';

function AppContent() {
  const [currentRecipe, setCurrentRecipe] = useState('pancakes');
  const { updateCode } = useRecipe();

  const loadRecipe = (recipeId: string) => {
    setCurrentRecipe(recipeId);
    let recipeCode = '';
    switch (recipeId) {
      case 'pancakes':
        recipeCode = pancakesRecipe;
        break;
      case 'spaghetti':
        recipeCode = spaghettiRecipe;
        break;
      case 'cookies':
        recipeCode = cookiesRecipe;
        break;
      case 'broccoli-fusilli':
        recipeCode = broccoliFusilliRecipe;
        break;
    }
    if (recipeCode) {
      updateCode(recipeCode);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--color-ide-bg)] text-[var(--color-ide-text)]">
      {/* Top Bar */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 gap-3 bg-[var(--color-ide-bg-lighter)] border-b border-[var(--color-ide-border)]">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">
            <span className="text-[var(--color-keyword)]">Dev</span>
            <span className="text-[var(--color-function)]">Gourmet</span>
          </h1>
          <span className="text-xs text-[var(--color-ide-text-muted)] font-mono hidden sm:inline">
            v1.0.0
          </span>
        </div>

        {/* Recipe Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-[var(--color-ide-text-muted)] hidden md:inline">Demo:</span>
          {demoRecipes.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => loadRecipe(recipe.id)}
              className={`
                px-2 sm:px-3 py-1 sm:py-1.5 rounded text-xs sm:text-sm font-mono transition-colors whitespace-nowrap
                ${
                  currentRecipe === recipe.id
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-ide-bg)] text-[var(--color-ide-text)] hover:bg-[var(--color-ide-border)]'
                }
              `}
              title={recipe.description}
            >
              {recipe.title}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-[var(--color-ide-border)] h-1/2 lg:h-full">
          <RecipeEditor />
        </div>

        {/* Right Panel - Output */}
        <div className="w-full lg:w-1/2 flex flex-col h-1/2 lg:h-full">
          {/* Top Right - Ingredients & Variables */}
          <div className="flex-1 lg:h-1/3 border-b border-[var(--color-ide-border)] overflow-auto">
            <IngredientList />
          </div>

          {/* Middle Right - Steps */}
          <div className="flex-1 lg:h-1/3 border-b border-[var(--color-ide-border)] overflow-auto">
            <StepExecutor />
          </div>

          {/* Bottom Right - Console */}
          <div className="flex-1 lg:h-1/3 overflow-auto">
            <Console />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <footer className="flex items-center justify-between px-4 py-1.5 bg-[var(--color-ide-bg-lighter)] border-t border-[var(--color-ide-border)] text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="text-[var(--color-ide-text-muted)]">
            DevScript v1.0
          </span>
          <span className="text-[var(--color-success)]">● Ready</span>
        </div>
        <div className="text-[var(--color-ide-text-muted)]">
          Cook recipes like you write code 👨‍💻🍳
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <RecipeProvider>
      <AppContent />
    </RecipeProvider>
  );
}

export default App
