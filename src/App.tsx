import {useState} from 'react';
import {RecipeProvider, useRecipe} from './context';
import {RecipeEditor} from './components/RecipeEditor';
import {IngredientList} from './components/IngredientList';
import {StepExecutor} from './components/StepExecutor';
import {Console} from './components/Console';
import {broccoliFusilliRecipe, cookiesRecipe, demoRecipes, pancakesRecipe, spaghettiRecipe} from './recipes';

function AppContent() {
    const [currentRecipe, setCurrentRecipe] = useState('pancakes');
    const {updateCode} = useRecipe();

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
            <header
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between pr-4 py-3  bg-[var(--color-ide-bg-lighter)] border-b border-[var(--color-ide-border)]">
                <div className="flex items-center gap-2">
                    <img src="/white_knife.svg" alt="DevGourmet Logo" className="w-10 h-10" style={{marginLeft: '12px'}}/>
                    <h1 className="text-xl font-bold">
                        <span className="text-[var(--color-keyword)]">Dev</span>
                        <span className="text-[var(--color-function)]">Gourmet</span>
                    </h1>
                    <span className="text-xs text-[var(--color-ide-text-muted)] font-mono hidden sm:inline">
            v0.0.1
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
                <div
                    className="w-full lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-[var(--color-ide-border)] h-1/2 lg:h-full">
                    <RecipeEditor/>
                </div>

                {/* Right Panel - Output */}
                <div className="w-full lg:w-1/2 flex flex-col h-1/2 lg:h-full">
                    {/* Top Right - Ingredients & Variables */}
                    <div className="flex-1 lg:h-1/3 border-b border-[var(--color-ide-border)] overflow-auto">
                        <IngredientList/>
                    </div>

                    {/* Middle Right - Steps */}
                    <div className="flex-1 lg:h-1/3 border-b border-[var(--color-ide-border)] overflow-auto">
                        <StepExecutor/>
                    </div>

                    {/* Bottom Right - Console */}
                    <div className="flex-1 lg:h-1/3 overflow-auto">
                        <Console/>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <footer
                className="flex items-center justify-between px-4 py-1.5 bg-[var(--color-ide-bg-lighter)] border-t border-[var(--color-ide-border)] text-xs font-mono">
                <div className="flex items-center gap-4">
          <span className="text-[var(--color-ide-text-muted)]">
            GourmetScript v1.0
          </span>
                    <div className="flex items-center gap-x-2">
                            <span className="relative flex h-2 w-2">
                              <span
                                  className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75"></span>
                              <span
                                  className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-success)]"></span>
                            </span>
                        <span className="text-[var(--color-success)]">Ready</span>
                    </div>
                </div>
                <div className="text-[var(--color-ide-text-muted)]">
                    Cook & Code 🍳👨‍💻
                </div>
            </footer>
        </div>
    );
}

function App() {
    return (
        <RecipeProvider>
            <AppContent/>
        </RecipeProvider>
    );
}

export default App
