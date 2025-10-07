import { useRecipe } from '../../context';

export function IngredientList() {
  const { ingredients, variables, updateVariable } = useRecipe();

  // Group variables for display
  const variableArray = Array.from(variables.values());

  return (
    <div className="flex flex-col h-full bg-[var(--color-ide-bg)]">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-2.5 bg-[var(--color-ide-bg-lighter)] border-b border-[var(--color-ide-border)]">
        <h2 className="text-sm font-semibold text-[var(--color-ide-text)] font-mono">
          INGREDIENTS & VARIABLES
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
        {/* Variables Section */}
        {variableArray.length > 0 && (
          <div className="border-b border-[var(--color-ide-border)]">
            <div className="px-4 py-2 bg-[var(--color-ide-bg-lighter)]">
              <h3 className="text-xs font-mono text-[var(--color-keyword)] uppercase tracking-wide">
                Variables
              </h3>
            </div>
            <div className="px-4 py-3 space-y-3">
              {variableArray.map((variable) => (
                <div key={variable.name} className="flex flex-col gap-2 py-2 border-b border-[var(--color-ide-border)] last:border-0">
                  <span className="text-sm font-mono text-[var(--color-variable)] font-semibold">
                    {variable.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={variable.value}
                      onChange={(e) => updateVariable(variable.name, parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 bg-[var(--color-ide-bg-lighter)] border border-[var(--color-ide-border)] text-[var(--color-number)] font-mono text-sm focus:outline-none focus:border-[var(--color-accent)]"
                    />
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={variable.value}
                      onChange={(e) => updateVariable(variable.name, parseFloat(e.target.value))}
                      className="flex-1 accent-[var(--color-accent)] h-1.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients Section */}
        {ingredients.length > 0 && (
          <div>
            <div className="px-4 py-2 bg-[var(--color-ide-bg-lighter)] border-b border-[var(--color-ide-border)]">
              <h3 className="text-xs font-mono text-[var(--color-keyword)] uppercase tracking-wide">
                Ingredients ({ingredients.length})
              </h3>
            </div>
            <div className="divide-y divide-[var(--color-ide-border)]">
              {ingredients.map((ingredient, idx) => (
                <div
                  key={`${ingredient.name}-${idx}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-ide-bg-lighter)] transition-colors cursor-default"
                >
                  <span className="text-2xl flex-shrink-0">{ingredient.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[var(--color-number)] font-semibold">
                        {ingredient.amount}
                      </span>
                      {ingredient.unit && (
                        <span className="text-xs text-[var(--color-warning)] font-mono">
                          {ingredient.unit}
                        </span>
                      )}
                      <span className="text-sm text-[var(--color-ide-text)]">
                        {ingredient.name}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[var(--color-ide-text-muted)] font-mono">
                    :{ingredient.line}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {ingredients.length === 0 && variableArray.length === 0 && (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-4xl mb-3">🍽️</div>
              <p className="text-[var(--color-ide-text-muted)] text-sm">
                No ingredients yet.
                <br />
                Start coding your recipe!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
