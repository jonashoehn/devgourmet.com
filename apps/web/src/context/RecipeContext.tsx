import {createContext, type ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import {Interpreter, Lexer, Parser} from '../parser';
import type {ConsoleMessage, RecipeState, Variable} from "../types";

interface RecipeContextType extends RecipeState {
    updateCode: (code: string, recipeId?: string | null, recipeTitle?: string | null) => void;
    updateVariable: (name: string, value: number) => void;
    setCurrentStep: (index: number) => void;
    nextStep: () => void;
    previousStep: () => void;
    startTimer: (line: number) => void;
    pauseTimer: (line: number) => void;
    resumeTimer: (line: number) => void;
    stopTimer: (line: number) => void;
    clearConsole: () => void;
    addConsoleMessage: (type: ConsoleMessage['type'], message: string, line?: number) => void;
    currentRecipeId: string | null;
    currentRecipeTitle: string | null;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

const DEFAULT_RECIPE = `// 🥞 Classic Pancakes
let servings = 4;

// Visual references
image("Finished Pancakes", "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800", "Golden fluffy pancakes stacked");
image("Batter Consistency", "https://images.unsplash.com/photo-1589627461407-6257b1acf0fd?w=800", "Proper batter texture");

// Dry ingredients
add("flour", 200 * servings, "grams");
add("sugar", 20 * servings, "grams");
add("salt", 2 * servings, "grams");

// Wet ingredients
add("milk", 300 * servings, "ml");
add("egg", 2 * servings);
add("butter", 30 * servings, "grams");

// Preparation
mix("dry ingredients in a bowl");
mix("wet ingredients separately");
pour("wet into dry mixture");
mix("until just combined");

// Resting improves texture
rest(5, "minutes");

// Cooking
cook(3, "minutes");
flip();
cook(2, "minutes");

serve("warm with maple syrup and butter");`;

export function RecipeProvider({children}: { children: ReactNode }) {
    const [state, setState] = useState<RecipeState>({
        code: DEFAULT_RECIPE,
        variables: new Map(),
        ingredients: [],
        steps: [],
        resources: [],
        consoleMessages: [],
        errors: [],
        currentStepIndex: -1,
        isExecuting: false,
        activeTimers: new Map(),
    });
    const [currentRecipeId, setCurrentRecipeId] = useState<string | null>(null);
    const [currentRecipeTitle, setCurrentRecipeTitle] = useState<string | null>(null);

    /**
     * Parse and execute the recipe code
     */
    const parseAndExecute = useCallback((code: string, vars?: Map<string, Variable>) => {
        try {
            // Tokenize
            const lexer = new Lexer(code);
            const tokens = lexer.tokenize();

            // Parse
            const parser = new Parser(tokens, code);
            const ast = parser.parse();

            // Execute
            const interpreter = new Interpreter();
            const result = interpreter.execute(ast);

            // If we have custom variable values, re-execute with those
            if (vars) {
                for (const [name, variable] of vars) {
                    if (result.variables.has(name)) {
                        result.variables.set(name, variable);
                    }
                }
                // Re-execute to recalculate with new variables
                const newInterpreter = new Interpreter();
                // Inject variables before execution
                for (const [name, variable] of vars) {
                    (newInterpreter as any).variables.set(name, variable);
                }
                const newResult = newInterpreter.execute(ast);

                setState(prev => ({
                    ...prev,
                    code,
                    variables: vars,
                    ingredients: newResult.ingredients,
                    steps: newResult.steps,
                    resources: newResult.resources,
                    consoleMessages: newResult.consoleMessages, // Replace instead of append
                    errors: newResult.errors,
                }));
            } else {
                setState(prev => ({
                    ...prev,
                    code,
                    variables: result.variables,
                    ingredients: result.ingredients,
                    steps: result.steps,
                    resources: result.resources,
                    consoleMessages: result.consoleMessages, // Replace instead of append
                    errors: result.errors,
                }));
            }
        } catch (error) {
            const errorMessage = (error as Error).message;
            setState(prev => ({
                ...prev,
                code,
                errors: [{
                    message: errorMessage,
                    line: 0,
                    severity: 'error',
                }],
                consoleMessages: [{
                    id: `error-${Date.now()}`,
                    type: 'error',
                    message: `Parse error: ${errorMessage}`,
                    timestamp: Date.now(),
                }],
            }));
        }
    }, []);

    /**
     * Update recipe code
     */
    const updateCode = useCallback((code: string, recipeId?: string | null, recipeTitle?: string | null) => {
        parseAndExecute(code);
        setCurrentRecipeId(recipeId ?? null);
        setCurrentRecipeTitle(recipeTitle ?? null);
    }, [parseAndExecute]);

    /**
     * Update a variable value and re-execute
     */
    const updateVariable = useCallback((name: string, value: number) => {
        setState(prev => {
            const newVariables = new Map(prev.variables);
            const variable = newVariables.get(name);
            if (!variable) return prev;

            // Update the variable
            newVariables.set(name, {...variable, value});

            // Update the code to reflect the new variable value
            const lines = prev.code.split('\n');
            let updatedCode = prev.code;

            // Find the line with the variable declaration and update it
            const varLine = variable.line - 1; // lines are 0-indexed
            if (varLine >= 0 && varLine < lines.length) {
                const line = lines[varLine];
                // Match "let variableName = number;" or "const variableName = number;" with optional inline comment
                const varRegex = new RegExp(`^(\\s*(?:let|const)\\s+${name}\\s*=\\s*)\\d+(\\.\\d+)?(\\s*;?\\s*(?:\\/\\/.*)?\\s*)$`);
                if (varRegex.test(line)) {
                    lines[varLine] = line.replace(varRegex, `$1${value}$3`);
                    updatedCode = lines.join('\n');
                }
            }

            // Re-parse and re-execute with the new variable value
            try {
                const lexer = new Lexer(updatedCode);
                const tokens = lexer.tokenize();
                const parser = new Parser(tokens, updatedCode);
                const ast = parser.parse();

                // Create interpreter with updated variables
                const interpreter = new Interpreter();
                // Inject the updated variables
                for (const [varName, varValue] of newVariables) {
                    (interpreter as any).variables.set(varName, varValue);
                }
                const result = interpreter.execute(ast);

                return {
                    ...prev,
                    code: updatedCode,
                    variables: newVariables,
                    ingredients: result.ingredients,
                    steps: result.steps,
                    consoleMessages: result.consoleMessages,
                    errors: result.errors,
                };
            } catch (error) {
                console.error('Error updating variable:', error);
                return prev;
            }
        });
    }, []);

    /**
     * Set current step
     */
    const setCurrentStep = useCallback((index: number) => {
        setState(prev => ({...prev, currentStepIndex: index}));
    }, []);

    /**
     * Go to next step
     */
    const nextStep = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentStepIndex: Math.min(prev.currentStepIndex + 1, prev.steps.length - 1),
        }));
    }, []);

    /**
     * Go to previous step
     */
    const previousStep = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentStepIndex: Math.max(prev.currentStepIndex - 1, 0),
        }));
    }, []);

    /**
     * Start a timer for a step
     */
    const startTimer = useCallback((line: number) => {
        setState(prev => {
            const step = prev.steps.find(s => s.line === line && s.isTimerStep);
            if (!step || !step.duration) return prev;

            const newTimers = new Map(prev.activeTimers);
            newTimers.set(line, {
                line,
                duration: step.duration,
                remaining: step.duration,
                isRunning: true,
                isPaused: false,
                startTime: Date.now(),
            });

            return {
                ...prev,
                activeTimers: newTimers,
                consoleMessages: [...prev.consoleMessages, {
                    id: `timer-start-${Date.now()}`,
                    type: 'info',
                    message: `⏱️ Timer started: ${step.duration / 60} minutes`,
                    timestamp: Date.now(),
                    line,
                }],
            };
        });
    }, []);

    /**
     * Pause a timer
     */
    const pauseTimer = useCallback((line: number) => {
        setState(prev => {
            const timer = prev.activeTimers.get(line);
            if (!timer || !timer.isRunning) return prev;

            const elapsed = timer.startTime ? (Date.now() - timer.startTime) / 1000 : 0;
            const remaining = Math.max(0, timer.remaining - elapsed);

            const newTimers = new Map(prev.activeTimers);
            newTimers.set(line, {
                ...timer,
                remaining,
                isRunning: false,
                isPaused: true,
                startTime: null,
            });

            return {...prev, activeTimers: newTimers};
        });
    }, []);

    /**
     * Resume a timer
     */
    const resumeTimer = useCallback((line: number) => {
        setState(prev => {
            const timer = prev.activeTimers.get(line);
            if (!timer || timer.isRunning) return prev;

            const newTimers = new Map(prev.activeTimers);
            newTimers.set(line, {
                ...timer,
                isRunning: true,
                isPaused: false,
                startTime: Date.now(),
            });

            return {...prev, activeTimers: newTimers};
        });
    }, []);

    /**
     * Stop a timer
     */
    const stopTimer = useCallback((line: number) => {
        setState(prev => {
            const newTimers = new Map(prev.activeTimers);
            newTimers.delete(line);

            return {
                ...prev,
                activeTimers: newTimers,
                consoleMessages: [...prev.consoleMessages, {
                    id: `timer-stop-${Date.now()}`,
                    type: 'success',
                    message: '✓ Timer complete!',
                    timestamp: Date.now(),
                    line,
                }],
            };
        });
    }, []);

    /**
     * Clear console messages
     */
    const clearConsole = useCallback(() => {
        setState(prev => ({...prev, consoleMessages: []}));
    }, []);

    /**
     * Add console message
     */
    const addConsoleMessage = useCallback((type: ConsoleMessage['type'], message: string, line?: number) => {
        setState(prev => ({
            ...prev,
            consoleMessages: [...prev.consoleMessages, {
                id: `msg-${Date.now()}`,
                type,
                message,
                timestamp: Date.now(),
                line,
            }],
        }));
    }, []);

    // Parse initial recipe on mount
    useEffect(() => {
        parseAndExecute(DEFAULT_RECIPE);
    }, [parseAndExecute]);

    const value: RecipeContextType = {
        ...state,
        updateCode,
        updateVariable,
        setCurrentStep,
        nextStep,
        previousStep,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        clearConsole,
        addConsoleMessage,
        currentRecipeId,
        currentRecipeTitle,
    };

    return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
}

export function useRecipe() {
    const context = useContext(RecipeContext);
    if (!context) {
        throw new Error('useRecipe must be used within RecipeProvider');
    }
    return context;
}
