import {useState} from 'react';
import {RecipeProvider, useRecipe} from './context';
import {RecipeEditor} from './components/RecipeEditor';
import {IngredientList} from './components/IngredientList';
import {StepExecutor} from './components/StepExecutor';
import {Console} from './components/Console';
import {Resources} from './components/Resources';
import {broccoliFusilliRecipe, cookiesRecipe, demoRecipes, pancakesRecipe, spaghettiRecipe} from './recipes';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

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
                className="flex items-center justify-between px-4 py-3 bg-[var(--color-ide-bg-lighter)] border-b border-[var(--color-ide-border)]">
                <div className="flex items-center gap-3">
                    <img src="/white_knife.svg" alt="DevGourmet Logo" className="w-8 h-8" />
                    <h1 className="text-lg font-bold">
                        <span className="text-[var(--color-keyword)]">Dev</span>
                        <span className="text-[var(--color-function)]">Gourmet</span>
                    </h1>
                    <span className="text-xs text-[var(--color-ide-text-muted)] font-mono hidden md:inline">
                        v0.0.1
                    </span>
                </div>

                {/* Recipe Selector Dropdown */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-ide-text-muted)] font-mono hidden sm:inline">Recipe:</span>
                    <Select value={currentRecipe} onValueChange={loadRecipe}>
                        <SelectTrigger className="w-[180px] sm:w-[200px] h-8 rounded-none bg-[var(--color-ide-bg)] border-[var(--color-ide-border)] text-[var(--color-ide-text)] font-mono text-xs focus:ring-0 focus:ring-offset-0 focus:outline-none focus:border-[var(--color-accent)]">
                            <SelectValue placeholder="Select recipe" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none bg-[var(--color-ide-bg-lighter)] border-[var(--color-ide-border)]">
                            {demoRecipes.map((recipe) => (
                                <SelectItem
                                    key={recipe.id}
                                    value={recipe.id}
                                    className="rounded-none text-[var(--color-ide-text)] font-mono text-xs focus:bg-[var(--color-accent)] focus:text-white cursor-pointer"
                                >
                                    {recipe.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
                {/* Mobile/Tablet View - Tabs */}
                <div className="flex-1 flex flex-col lg:hidden min-h-0">
                    <Tabs defaultValue="editor" className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <TabsList className="w-full justify-start rounded-none border-b border-[var(--color-ide-border)] bg-[var(--color-ide-bg-lighter)] p-0 h-auto">
                            <TabsTrigger
                                value="editor"
                                className="rounded-none border-r border-[var(--color-ide-border)] text-[var(--color-ide-text-muted)] data-[state=active]:bg-[var(--color-ide-bg)] data-[state=active]:text-[var(--color-keyword)] px-4 py-2.5 font-mono text-sm hover:text-[var(--color-ide-text)] transition-colors"
                            >
                                📝 Editor
                            </TabsTrigger>
                            <TabsTrigger
                                value="ingredients"
                                className="rounded-none border-r border-[var(--color-ide-border)] text-[var(--color-ide-text-muted)] data-[state=active]:bg-[var(--color-ide-bg)] data-[state=active]:text-[var(--color-keyword)] px-4 py-2.5 font-mono text-sm hover:text-[var(--color-ide-text)] transition-colors"
                            >
                                🥘 Ingredients
                            </TabsTrigger>
                            <TabsTrigger
                                value="steps"
                                className="rounded-none border-r border-[var(--color-ide-border)] text-[var(--color-ide-text-muted)] data-[state=active]:bg-[var(--color-ide-bg)] data-[state=active]:text-[var(--color-keyword)] px-4 py-2.5 font-mono text-sm hover:text-[var(--color-ide-text)] transition-colors"
                            >
                                📋 Steps
                            </TabsTrigger>
                            <TabsTrigger
                                value="resources"
                                className="rounded-none border-r border-[var(--color-ide-border)] text-[var(--color-ide-text-muted)] data-[state=active]:bg-[var(--color-ide-bg)] data-[state=active]:text-[var(--color-keyword)] px-4 py-2.5 font-mono text-sm hover:text-[var(--color-ide-text)] transition-colors"
                            >
                                🖼️ Resources
                            </TabsTrigger>
                            <TabsTrigger
                                value="console"
                                className="rounded-none text-[var(--color-ide-text-muted)] data-[state=active]:bg-[var(--color-ide-bg)] data-[state=active]:text-[var(--color-keyword)] px-4 py-2.5 font-mono text-sm hover:text-[var(--color-ide-text)] transition-colors"
                            >
                                💻 Console
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="editor" className="flex-1 min-h-0 m-0 border-0 overflow-hidden">
                            <RecipeEditor/>
                        </TabsContent>
                        <TabsContent value="ingredients" className="flex-1 min-h-0 m-0 border-0 overflow-hidden">
                            <IngredientList/>
                        </TabsContent>
                        <TabsContent value="steps" className="flex-1 min-h-0 m-0 border-0 overflow-hidden">
                            <StepExecutor/>
                        </TabsContent>
                        <TabsContent value="resources" className="flex-1 min-h-0 m-0 border-0 overflow-hidden">
                            <Resources/>
                        </TabsContent>
                        <TabsContent value="console" className="flex-1 min-h-0 m-0 border-0 overflow-hidden">
                            <Console/>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Desktop View - Split Panes */}
                <div className="hidden lg:flex flex-1 overflow-hidden">
                    {/* Left Panel - Editor */}
                    <div className="w-1/2 flex flex-col border-r border-[var(--color-ide-border)]">
                        <RecipeEditor/>
                    </div>

                    {/* Right Panel - Output */}
                    <div className="w-1/2 flex flex-col">
                        {/* Top Right - Ingredients & Variables */}
                        <div className="h-1/4 border-b border-[var(--color-ide-border)] overflow-auto">
                            <IngredientList/>
                        </div>

                        {/* Steps */}
                        <div className="h-1/4 border-b border-[var(--color-ide-border)] overflow-auto">
                            <StepExecutor/>
                        </div>

                        {/* Resources */}
                        <div className="h-1/4 border-b border-[var(--color-ide-border)] overflow-auto">
                            <Resources/>
                        </div>

                        {/* Bottom - Console */}
                        <div className="h-1/4 overflow-auto">
                            <Console/>
                        </div>
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
