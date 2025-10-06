import { useRecipe } from '../../context';

export function IngredientList() {
  const { ingredients, variables, updateVariable } = useRecipe();

  // Group variables for display
  const variableArray = Array.from(variables.values());

  return (
    <div className="flex flex-col h-full bg-[var(--color-ide-bg-light)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--color-ide-border)]">
        <h2 className="text-lg font-semibold text-[var(--color-ide-text)]">
          Ingredients & Variables
        </h2>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Variables Section */}
        {variableArray.length > 0 && (
          <div className="p-4 border-b border-[var(--color-ide-border)]">
            <h3 className="text-sm font-mono text-[var(--color-keyword)] mb-3">
              Variables
            </h3>
            <div className="space-y-3">
              {variableArray.map((variable) => (
                <div key={variable.name} className="flex items-center gap-3">
                  <span className="text-sm font-mono text-[var(--color-variable)] w-24">
                    {variable.name}
                  </span>
                  <input
                    type="number"
                    value={variable.value}
                    onChange={(e) => updateVariable(variable.name, parseFloat(e.target.value) || 0)}
                    className="flex-1 px-3 py-1.5 bg-[var(--color-ide-bg)] border border-[var(--color-ide-border)] rounded text-[var(--color-number)] font-mono text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  />
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={variable.value}
                    onChange={(e) => updateVariable(variable.name, parseFloat(e.target.value))}
                    className="flex-1 accent-[var(--color-accent)]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients Section */}
        {ingredients.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-mono text-[var(--color-keyword)] mb-3">
              Ingredients ({ingredients.length})
            </h3>
            <div className="space-y-2">
              {ingredients.map((ingredient, idx) => (
                <div
                  key={`${ingredient.name}-${idx}`}
                  className="flex items-center gap-3 p-2 rounded hover:bg-[var(--color-ide-bg)] transition-colors group"
                >
                  <span className="text-2xl">{ingredient.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[var(--color-number)] font-semibold">
                        {ingredient.amount}
                      </span>
                      {ingredient.unit && (
                        <span className="text-xs text-[var(--color-ide-text-muted)] font-mono">
                          {ingredient.unit}
                        </span>
                      )}
                      <span className="text-sm text-[var(--color-ide-text)]">
                        {ingredient.name}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--color-ide-text-muted)] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    line {ingredient.line}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {ingredients.length === 0 && variableArray.length === 0 && (
          <div className="flex items-center justify-center h-full p-8 text-center">
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
