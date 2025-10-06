import { useRecipe } from '../../context/index.js';
import { Timer } from '../Timer/index.js';

export function StepExecutor() {
  const { steps, currentStepIndex, setCurrentStep, nextStep, previousStep, startTimer } = useRecipe();

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'add':
        return '➕';
      case 'mix':
        return '🥄';
      case 'cook':
        return '🔥';
      case 'bake':
        return '🔥';
      case 'rest':
        return '⏸️';
      case 'serve':
        return '🍽️';
      case 'flip':
        return '🔄';
      default:
        return '▸';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-ide-bg-light)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--color-ide-border)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-ide-text)]">
            Recipe Steps
          </h2>
          <div className="text-sm text-[var(--color-ide-text-muted)]">
            {currentStepIndex >= 0 ? `${currentStepIndex + 1} / ${steps.length}` : `${steps.length} steps`}
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-auto p-4">
        {steps.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-4xl mb-3">📝</div>
              <p className="text-[var(--color-ide-text-muted)] text-sm">
                No steps yet.
                <br />
                Add actions to your recipe!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = currentStepIndex > index;

              return (
                <div
                  key={`${step.line}-${index}`}
                  className={`
                    p-3 rounded-lg border transition-all cursor-pointer
                    ${
                      isActive
                        ? 'bg-[var(--color-accent)] bg-opacity-10 border-[var(--color-accent)] shadow-md'
                        : isCompleted
                        ? 'bg-[var(--color-success)] bg-opacity-5 border-[var(--color-success)] opacity-70'
                        : 'bg-[var(--color-ide-bg)] border-[var(--color-ide-border)] hover:border-[var(--color-ide-text-muted)]'
                    }
                  `}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-start gap-3">
                    {/* Step number & icon */}
                    <div className="flex-shrink-0">
                      <div
                        className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono
                        ${
                          isActive
                            ? 'bg-[var(--color-accent)] text-white'
                            : isCompleted
                            ? 'bg-[var(--color-success)] text-white'
                            : 'bg-[var(--color-ide-bg-lighter)] text-[var(--color-ide-text-muted)]'
                        }
                      `}
                      >
                        {isCompleted ? '✓' : index + 1}
                      </div>
                    </div>

                    {/* Step content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getStepIcon(step.type)}</span>
                        <span className={`text-sm font-medium ${isActive ? 'text-[var(--color-ide-text)]' : 'text-[var(--color-ide-text-muted)]'}`}>
                          {step.description}
                        </span>
                      </div>

                      {/* Timer for timer steps */}
                      {step.isTimerStep && step.duration && (
                        <div className="mt-2">
                          <Timer line={step.line} />
                        </div>
                      )}

                      {/* Line number */}
                      <div className="text-xs text-[var(--color-ide-text-muted)] mt-1 font-mono">
                        line {step.line}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      {steps.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-ide-border)] bg-[var(--color-ide-bg)]">
          <button
            onClick={previousStep}
            disabled={currentStepIndex <= 0}
            className="px-4 py-2 rounded bg-[var(--color-ide-bg-lighter)] text-[var(--color-ide-text)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-ide-border)] transition-colors font-mono text-sm"
          >
            ← Previous
          </button>

          <div className="text-sm text-[var(--color-ide-text-muted)] font-mono">
            Step {Math.max(0, currentStepIndex) + 1} of {steps.length}
          </div>

          <button
            onClick={nextStep}
            disabled={currentStepIndex >= steps.length - 1}
            className="px-4 py-2 rounded bg-[var(--color-accent)] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-accent-hover)] transition-colors font-mono text-sm"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
