import {
    type ASTNode,
    type BinaryExpression,
    type ConsoleMessage,
    type Expression,
    type FunctionCall,
    type Identifier, type Ingredient,
    type Literal, type ParseError,
    type Program, type RecipeStep, type Variable,
    type VariableDeclaration
} from "../types";


/**
 * Ingredient emoji mapping
 */
const INGREDIENT_EMOJIS: Record<string, string> = {
    flour: '🌾',
    egg: '🥚',
    eggs: '🥚',
    milk: '🥛',
    sugar: '🍚',
    salt: '🧂',
    butter: '🧈',
    water: '💧',
    oil: '🫒',
    cheese: '🧀',
    tomato: '🍅',
    onion: '🧅',
    garlic: '🧄',
    pasta: '🍝',
    spaghetti: '🍝',
    chicken: '🍗',
    beef: '🥩',
    fish: '🐟',
    shrimp: '🦐',
    rice: '🍚',
    bread: '🍞',
    chocolate: '🍫',
    vanilla: '🌼',
    cinnamon: '🥢',
    pepper: '🌶️',
    lemon: '🍋',
    apple: '🍎',
    banana: '🍌',
    strawberry: '🍓',
    carrot: '🥕',
    potato: '🥔',
    spinach: '🥬',
    broccoli: '🥦',
    mushroom: '🍄',
    honey: '🍯',
    yeast: '🧪',
};

/**
 * Recipe interpreter
 * Executes the AST and produces ingredients, steps, and console output
 */
export class Interpreter {
    private variables: Map<string, Variable> = new Map();
    private ingredients: Ingredient[] = [];
    private steps: RecipeStep[] = [];
    private consoleMessages: ConsoleMessage[] = [];
    private errors: ParseError[] = [];
    private messageId: number = 0;

    /**
     * Execute the program
     */
    public execute(ast: Program): {
        variables: Map<string, Variable>;
        ingredients: Ingredient[];
        steps: RecipeStep[];
        consoleMessages: ConsoleMessage[];
        errors: ParseError[];
    } {
        this.reset();

        try {
            for (const node of ast.body) {
                this.executeStatement(node);
            }
        } catch (error) {
            this.addError((error as Error).message, 0);
        }

        return {
            variables: this.variables,
            ingredients: this.ingredients,
            steps: this.steps,
            consoleMessages: this.consoleMessages,
            errors: this.errors,
        };
    }

    /**
     * Reset interpreter state
     */
    private reset(): void {
        this.variables.clear();
        this.ingredients = [];
        this.steps = [];
        this.consoleMessages = [];
        this.errors = [];
        this.messageId = 0;
    }

    /**
     * Execute a statement
     */
    private executeStatement(node: ASTNode): void {
        switch (node.type) {
            case 'VARIABLE_DECLARATION':
                this.executeVariableDeclaration(node as VariableDeclaration);
                break;
            case 'FUNCTION_CALL':
                this.executeFunctionCall(node as FunctionCall);
                break;
            case 'COMMENT':
                // Comments don't execute
                break;
            default:
                break;
        }
    }

    /**
     * Execute variable declaration
     */
    private executeVariableDeclaration(node: VariableDeclaration): void {
        try {
            // If variable already exists (injected), skip declaration but still evaluate for console
            const existingVar = this.variables.get(node.name);

            const value = this.evaluateExpression(node.value);

            if (typeof value !== 'number') {
                this.addError(`Variable ${node.name} must be a number, got ${typeof value}`, node.line);
                return;
            }

            // Only set if not already injected
            if (!existingVar) {
                this.variables.set(node.name, {
                    name: node.name,
                    value,
                    line: node.line,
                });
            }

            // Use the actual variable value (injected or declared)
            const actualValue = this.variables.get(node.name)?.value ?? value;

            this.addConsoleMessage(
                'variable',
                `Variable change: ${node.name} = ${actualValue}`,
                node.line
            );
        } catch (error) {
            this.addError(`Error evaluating variable ${node.name}: ${(error as Error).message}`, node.line);
        }
    }

    /**
     * Execute function call
     */
    private executeFunctionCall(node: FunctionCall): void {
        try {
            const args = node.arguments.map(arg => this.evaluateExpression(arg));

            // Handle different function types
            switch (node.name.toLowerCase()) {
                case 'add':
                    this.handleAdd(args, node.line);
                    break;
                case 'mix':
                    this.handleMix(args, node.line);
                    break;
                case 'cook':
                case 'bake':
                case 'simmer':
                    this.handleCook(node.name.toLowerCase() as 'cook' | 'bake' | 'simmer', args, node.line);
                    break;
                case 'rest':
                case 'wait':
                    this.handleRest(args, node.line);
                    break;
                case 'serve':
                    this.handleServe(args, node.line);
                    break;
                case 'flip':
                    this.handleFlip(args, node.line);
                    break;
                case 'stir':
                    this.handleStir(args, node.line);
                    break;
                case 'pour':
                    this.handlePour(args, node.line);
                    break;
                case 'season':
                    this.handleSeason(args, node.line);
                    break;
                default:
                    this.handleGenericAction(node.name, args, node.line);
                    break;
            }
        } catch (error) {
            this.addError(`Error executing ${node.name}(): ${(error as Error).message}`, node.line);
        }
    }

    /**
     * Evaluate an expression to a value
     */
    private evaluateExpression(expr: Expression): string | number {
        switch (expr.type) {
            case 'LITERAL':
                return (expr as Literal).value;

            case 'IDENTIFIER': {
                const name = (expr as Identifier).name;
                const variable = this.variables.get(name);
                if (!variable) {
                    throw new Error(`Undefined variable: ${name}`);
                }
                return variable.value;
            }

            case 'BINARY_EXPRESSION': {
                const binExpr = expr as BinaryExpression;
                const left = this.evaluateExpression(binExpr.left);
                const right = this.evaluateExpression(binExpr.right);

                if (typeof left !== 'number' || typeof right !== 'number') {
                    throw new Error('Binary operations require numeric operands');
                }

                switch (binExpr.operator) {
                    case '+':
                        return left + right;
                    case '-':
                        return left - right;
                    case '*':
                        return left * right;
                    case '/':
                        return right !== 0 ? left / right : 0;
                    default:
                        throw new Error(`Unknown operator: ${binExpr.operator}`);
                }
            }

            case 'FUNCTION_CALL':
                // For function calls in expressions, return 0 (shouldn't happen often)
                return 0;

            default:
                // @ts-ignore
                throw new Error(`Cannot evaluate expression type: ${expr.type}`);
        }
    }

    /**
     * Handle add() function - adds an ingredient
     */
    private handleAdd(args: (string | number)[], line: number): void {
        if (args.length < 2) {
            this.addError('add() requires at least 2 arguments: name and amount', line);
            return;
        }

        const name = String(args[0]);
        const amount = Number(args[1]);
        const unit = args.length > 2 ? String(args[2]) : '';
        const roundedAmount = Math.round(amount * 100) / 100; // Round to 2 decimals

        const emoji = INGREDIENT_EMOJIS[name.toLowerCase()] || '🍽️';

        this.ingredients.push({
            name,
            amount: roundedAmount,
            unit,
            line,
            emoji,
        });

        this.steps.push({
            type: 'add',
            description: `Add ${roundedAmount}${unit ? ' ' + unit : ''} ${name}`,
            line,
            isTimerStep: false,
        });

        this.addConsoleMessage('info', `Added ${roundedAmount}${unit ? ' ' + unit : ''} ${name}`, line);
    }

    /**
     * Handle mix() function
     */
    private handleMix(args: (string | number)[], line: number): void {
        const description = args.length > 0 ? String(args[0]) : 'ingredients';

        this.steps.push({
            type: 'mix',
            description: `Mix ${description}`,
            line,
            isTimerStep: false,
        });

        this.addConsoleMessage('info', `Mixing ${description}...`, line);
    }

    /**
     * Handle cook/bake/simmer() function with timer
     */
    private handleCook(type: 'cook' | 'bake' | 'simmer', args: (string | number)[], line: number): void {
        if (args.length < 1) {
            this.addError(`${type}() requires duration argument`, line);
            return;
        }

        const duration = Number(args[0]);
        const unit = args.length > 1 ? String(args[1]) : 'minutes';
        const description = args.length > 2 ? String(args[2]) : '';

        // Convert to seconds
        let durationInSeconds = duration;
        if (unit.toLowerCase().includes('min')) {
            durationInSeconds = duration * 60;
        } else if (unit.toLowerCase().includes('hour')) {
            durationInSeconds = duration * 3600;
        }

        const actionName = type === 'cook' ? 'Cook' : type === 'bake' ? 'Bake' : 'Simmer';
        const actionVerb = type === 'cook' ? 'Cooking' : type === 'bake' ? 'Baking' : 'Simmering';

        this.steps.push({
            type,
            description: `${actionName} for ${duration} ${unit}${description ? ' - ' + description : ''}`,
            line,
            duration: durationInSeconds,
            durationUnit: unit,
            isTimerStep: true,
        });

        this.addConsoleMessage('info', `${actionVerb} for ${duration} ${unit}${description ? ' - ' + description : ''}...`, line);
    }

    /**
     * Handle rest/wait() function with timer
     */
    private handleRest(args: (string | number)[], line: number): void {
        if (args.length < 1) {
            this.addError('rest() requires duration argument', line);
            return;
        }

        const duration = Number(args[0]);
        const unit = args.length > 1 ? String(args[1]) : 'minutes';

        let durationInSeconds = duration;
        if (unit.toLowerCase().includes('min')) {
            durationInSeconds = duration * 60;
        } else if (unit.toLowerCase().includes('hour')) {
            durationInSeconds = duration * 3600;
        }

        this.steps.push({
            type: 'rest',
            description: `Let rest for ${duration} ${unit}`,
            line,
            duration: durationInSeconds,
            durationUnit: unit,
            isTimerStep: true,
        });

        this.addConsoleMessage('info', `Resting for ${duration} ${unit}...`, line);
    }

    /**
     * Handle serve() function
     */
    private handleServe(args: (string | number)[], line: number): void {
        const description = args.length > 0 ? String(args[0]) : 'the dish';

        this.steps.push({
            type: 'serve',
            description: `Serve ${description}`,
            line,
            isTimerStep: false,
        });

        this.addConsoleMessage('success', `Serving ${description}!`, line);
    }

    /**
     * Handle flip() function
     */
    private handleFlip(_args: (string | number)[], line: number): void {
        this.steps.push({
            type: 'flip',
            description: 'Flip',
            line,
            isTimerStep: false,
        });

        this.addConsoleMessage('info', 'Flipping...', line);
    }

    /**
     * Handle stir() function
     */
    private handleStir(args: (string | number)[], line: number): void {
        const description = args.length > 0 ? String(args[0]) : 'continuously';

        this.steps.push({
            type: 'other',
            description: `Stir ${description}`,
            line,
            isTimerStep: false,
        });

        this.addConsoleMessage('info', `Stirring ${description}...`, line);
    }

    /**
     * Handle pour() function
     */
    private handlePour(args: (string | number)[], line: number): void {
        const description = args.length > 0 ? String(args[0]) : 'mixture';

        this.steps.push({
            type: 'other',
            description: `Pour ${description}`,
            line,
            isTimerStep: false,
        });

        this.addConsoleMessage('info', `Pouring ${description}...`, line);
    }

    /**
     * Handle season() function
     */
    private handleSeason(args: (string | number)[], line: number): void {
        const description = args.length > 0 ? String(args[0]) : 'to taste';

        this.steps.push({
            type: 'other',
            description: `Season ${description}`,
            line,
            isTimerStep: false,
        });

        this.addConsoleMessage('info', `Seasoning ${description}...`, line);
    }

    /**
     * Handle generic action functions
     */
    private handleGenericAction(name: string, args: (string | number)[], line: number): void {
        const description = args.length > 0 ? args.map(String).join(', ') : '';

        this.steps.push({
            type: 'other',
            description: `${name}(${description})`,
            line,
            isTimerStep: false,
        });

        this.addConsoleMessage('info', `${name}(${description})`, line);
    }

    /**
     * Add console message
     */
    private addConsoleMessage(
        type: 'info' | 'success' | 'warning' | 'error' | 'variable',
        message: string,
        line?: number
    ): void {
        this.consoleMessages.push({
            id: `msg-${this.messageId++}`,
            type,
            message,
            timestamp: Date.now(),
            line,
        });
    }

    /**
     * Add error
     */
    private addError(message: string, line: number): void {
        this.errors.push({
            message,
            line,
            severity: 'error',
        });
        this.addConsoleMessage('error', `Error: ${message}`, line);
    }
}
