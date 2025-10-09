import {useState, useEffect} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {RecipeProvider, useRecipe} from './context';
import { AuthProvider, useAuth } from './context/AuthContext';
import { trpc, trpcClient } from './lib/trpc';
import {RecipeEditor} from './components/RecipeEditor';
import {IngredientList} from './components/IngredientList';
import {StepExecutor} from './components/StepExecutor';
import {Resources} from './components/Resources';
import { RecipeManagement } from './components/RecipeManagement';
import {WelcomeOverlay} from './components/WelcomeOverlay';
import {broccoliFusilliRecipe, cookiesRecipe, demoRecipes, pancakesRecipe, spaghettiRecipe} from './recipes';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import { Toaster, toast } from 'sonner';

const queryClient = new QueryClient();

function AppContent() {
    const [currentRecipe, setCurrentRecipe] = useState('pancakes');
    const {updateCode} = useRecipe();
    const { user } = useAuth();
    const recipesQuery = trpc.recipes.list.useQuery(undefined, { enabled: !!user });

    // Check for shared recipe in URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = urlParams.get('recipe');

        if (recipeId) {
            // Use tRPC to fetch the recipe
            trpcClient.recipes.get.query({ id: recipeId })
                .then((recipe) => {
                    if (recipe) {
                        updateCode(recipe.recipeCode, recipe.id, recipe.title);
                        // Clear the URL parameter
                        window.history.replaceState({}, '', window.location.pathname);
                    }
                })
                .catch((error) => {
                    console.error('Failed to load shared recipe:', error);
                    toast.error('Failed to load shared recipe');
                });
        }
    }, [updateCode]);

    const loadRecipe = (recipeId: string) => {
        setCurrentRecipe(recipeId);

        // Check if it's a user recipe
        const userRecipe = recipesQuery.data?.userRecipes?.find(r => r.id === recipeId);
        if (userRecipe) {
            updateCode(userRecipe.recipeCode, userRecipe.id, userRecipe.title);
            return;
        }

        // Otherwise, load demo recipe
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
        <div className="flex flex-col bg-[var(--color-ide-bg)] text-[var(--color-ide-text)]" style={{ height: '100dvh' }}>
            {/* Top Bar */}
            <header
                className="flex items-center justify-between px-4 py-3 bg-[var(--color-ide-bg-lighter)] border-b border-[var(--color-ide-border)]"
                style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
                <div className="flex items-center gap-3">
                    <img src="/white_knife.svg" alt="DevGourmet Logo" className="w-8 h-8" />
                    <h1 className="text-lg font-bold">
                        <span className="text-[var(--color-keyword)]">Dev</span>
                        <span className="text-[var(--color-function)]">Gourmet</span>
                    </h1>
                    <span className="text-xs text-[var(--color-ide-text-muted)] font-mono hidden md:inline">
                        v0.1.0
                    </span>
                    {user && (
                        <span className="text-xs text-[var(--color-ide-text-muted)] font-mono lg:hidden truncate max-w-[120px]" title={user.email}>
                            {user.email}
                        </span>
                    )}
                </div>

                {/* Recipe Selector Dropdown */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-ide-text-muted)] font-mono hidden sm:inline">Recipe:</span>
                    <Select value={currentRecipe} onValueChange={loadRecipe}>
                        <SelectTrigger className="w-[180px] sm:w-[200px] h-8 rounded-none bg-[var(--color-ide-bg)] border-[var(--color-ide-border)] text-[var(--color-ide-text)] font-mono text-xs focus:ring-0 focus:ring-offset-0 focus:outline-none focus:border-[var(--color-accent)]">
                            <SelectValue placeholder="Select recipe" />
                        </SelectTrigger>
                        <SelectContent className="rounded-none bg-[var(--color-ide-bg-lighter)] border-[var(--color-ide-border)]">
                            {user && recipesQuery.data?.userRecipes && recipesQuery.data.userRecipes.length > 0 && (
                                <>
                                    <div className="px-2 py-1.5 text-[10px] font-semibold text-[var(--color-ide-text-muted)] uppercase">
                                        My Recipes
                                    </div>
                                    {recipesQuery.data.userRecipes.map((recipe) => (
                                        <SelectItem
                                            key={recipe.id}
                                            value={recipe.id}
                                            className="rounded-none text-[var(--color-ide-text)] font-mono text-xs focus:bg-[var(--color-accent)] focus:text-white cursor-pointer"
                                        >
                                            {recipe.title}
                                        </SelectItem>
                                    ))}
                                    <div className="h-px bg-[var(--color-ide-border)] my-1"></div>
                                </>
                            )}
                            <div className="px-2 py-1.5 text-[10px] font-semibold text-[var(--color-ide-text-muted)] uppercase">
                                Demo Recipes
                            </div>
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
                        <TabsList className="w-full flex flex-col rounded-none border-b border-[var(--color-ide-border)] bg-[var(--color-ide-bg-lighter)] p-0 h-auto gap-0">
                            {/* Icon tabs row */}
                            <div className="flex w-full">
                                <TabsTrigger
                                    value="editor"
                                    className="flex-1 rounded-none text-[var(--color-ide-text-muted)] data-[state=active]:bg-[var(--color-ide-bg)] data-[state=active]:text-[var(--color-keyword)] py-4 font-mono text-2xl hover:text-[var(--color-ide-text)] transition-colors"
                                >
                                    📝
                                </TabsTrigger>
                                <TabsTrigger
                                    value="ingredients"
                                    className="flex-1 rounded-none text-[var(--color-ide-text-muted)] data-[state=active]:bg-[var(--color-ide-bg)] data-[state=active]:text-[var(--color-keyword)] py-4 font-mono text-2xl hover:text-[var(--color-ide-text)] transition-colors"
                                >
                                    🥘
                                </TabsTrigger>
                                <TabsTrigger
                                    value="steps"
                                    className="flex-1 rounded-none text-[var(--color-ide-text-muted)] data-[state=active]:bg-[var(--color-ide-bg)] data-[state=active]:text-[var(--color-keyword)] py-4 font-mono text-2xl hover:text-[var(--color-ide-text)] transition-colors"
                                >
                                    📋
                                </TabsTrigger>
                                <TabsTrigger
                                    value="resources"
                                    className="flex-1 rounded-none text-[var(--color-ide-text-muted)] data-[state=active]:bg-[var(--color-ide-bg)] data-[state=active]:text-[var(--color-keyword)] py-4 font-mono text-2xl hover:text-[var(--color-ide-text)] transition-colors"
                                >
                                    📁
                                </TabsTrigger>
                                <TabsTrigger
                                    value="recipes"
                                    className="flex-1 rounded-none text-[var(--color-ide-text-muted)] data-[state=active]:bg-[var(--color-ide-bg)] data-[state=active]:text-[var(--color-keyword)] py-4 font-mono text-2xl hover:text-[var(--color-ide-text)] transition-colors"
                                >
                                    📚
                                </TabsTrigger>
                            </div>
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
                        <TabsContent value="recipes" className="flex-1 min-h-0 m-0 border-0 overflow-hidden">
                            <RecipeManagement/>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Desktop View - Split Panes with Tabs */}
                <div className="hidden lg:flex flex-1 overflow-hidden">
                    {/* Left Panel - Editor (Always Visible) */}
                    <div className="w-1/2 flex flex-col border-r border-[var(--color-ide-border)]">
                        <RecipeEditor/>
                    </div>

                    {/* Right Panel - Tabs */}
                    <div className="w-1/2 flex flex-col">
                        <Tabs defaultValue="ingredients" className="flex-1 flex flex-col min-h-0 overflow-hidden">
                            <TabsList className="w-full flex rounded-none border-b border-[var(--color-ide-border)] bg-[var(--color-ide-bg-lighter)] p-0 h-auto gap-0">
                                <TabsTrigger
                                    value="ingredients"
                                    className="flex-1 rounded-none text-[var(--color-ide-text-muted)] data-[state=active]:bg-[var(--color-ide-bg)] data-[state=active]:text-[var(--color-keyword)] py-2.5 px-4 font-mono text-xs hover:text-[var(--color-ide-text)] transition-colors"
                                >
                                    🥘 Ingredients
                                </TabsTrigger>
                                <TabsTrigger
                                    value="steps"
                                    className="flex-1 rounded-none text-[var(--color-ide-text-muted)] data-[state=active]:bg-[var(--color-ide-bg)] data-[state=active]:text-[var(--color-keyword)] py-2.5 px-4 font-mono text-xs hover:text-[var(--color-ide-text)] transition-colors"
                                >
                                    📋 Steps
                                </TabsTrigger>
                                <TabsTrigger
                                    value="resources"
                                    className="flex-1 rounded-none text-[var(--color-ide-text-muted)] data-[state=active]:bg-[var(--color-ide-bg)] data-[state=active]:text-[var(--color-keyword)] py-2.5 px-4 font-mono text-xs hover:text-[var(--color-ide-text)] transition-colors"
                                >
                                    📁 Resources
                                </TabsTrigger>
                                <TabsTrigger
                                    value="recipes"
                                    className="flex-1 rounded-none text-[var(--color-ide-text-muted)] data-[state=active]:bg-[var(--color-ide-bg)] data-[state=active]:text-[var(--color-keyword)] py-2.5 px-4 font-mono text-xs hover:text-[var(--color-ide-text)] transition-colors"
                                >
                                    📚 Recipes
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="ingredients" className="flex-1 min-h-0 m-0 border-0 overflow-hidden">
                                <IngredientList/>
                            </TabsContent>
                            <TabsContent value="steps" className="flex-1 min-h-0 m-0 border-0 overflow-hidden">
                                <StepExecutor/>
                            </TabsContent>
                            <TabsContent value="resources" className="flex-1 min-h-0 m-0 border-0 overflow-hidden">
                                <Resources/>
                            </TabsContent>
                            <TabsContent value="recipes" className="flex-1 min-h-0 m-0 border-0 overflow-hidden">
                                <RecipeManagement/>
                            </TabsContent>
                        </Tabs>
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
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <RecipeProvider>
                        <Toaster
                            position="top-right"
                            theme="dark"
                            toastOptions={{
                                style: {
                                    background: '#2d2d30',
                                    border: '1px solid var(--color-accent)',
                                    color: 'var(--color-ide-text)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                                },
                            }}
                        />
                        <WelcomeOverlay />
                        <AppContent/>
                    </RecipeProvider>
                </AuthProvider>
            </QueryClientProvider>
        </trpc.Provider>
    );
}

export default App
