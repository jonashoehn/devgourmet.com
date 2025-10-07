/**
 * Recipe execution and runtime types
 */

export interface Variable {
  name: string;
  value: number;
  line: number;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  line: number;
  emoji?: string;
}

export interface RecipeStep {
  type: 'add' | 'mix' | 'cook' | 'rest' | 'bake' | 'serve' | 'flip' | 'simmer' | 'other';
  description: string;
  line: number;
  duration?: number; // in seconds
  durationUnit?: string;
  isTimerStep: boolean;
}

export interface ConsoleMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'variable';
  message: string;
  timestamp: number;
  line?: number;
}

export interface ParseError {
  message: string;
  line: number;
  column?: number;
  severity: 'error' | 'warning';
}

export interface RecipeState {
  code: string;
  variables: Map<string, Variable>;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  consoleMessages: ConsoleMessage[];
  errors: ParseError[];
  currentStepIndex: number;
  isExecuting: boolean;
  activeTimers: Map<number, TimerState>; // line number -> timer state
}

export interface TimerState {
  line: number;
  duration: number; // total duration in seconds
  remaining: number; // remaining time in seconds
  isRunning: boolean;
  isPaused: boolean;
  startTime: number | null;
}

export interface RecipeMetadata {
  title: string;
  description?: string;
  author?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

/**
 * Function registry for DevScript built-in functions
 */
export type FunctionHandler = (
  args: (string | number)[],
  variables: Map<string, Variable>,
  line: number
) => void;

export interface FunctionDefinition {
  name: string;
  description: string;
  minArgs: number;
  maxArgs: number;
  handler: FunctionHandler;
  category: 'ingredient' | 'action' | 'timer' | 'output';
}
