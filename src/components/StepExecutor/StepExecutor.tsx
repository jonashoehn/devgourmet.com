import { useEffect, useRef } from 'react';
import { useRecipe } from '../../context';
import { Timer } from '../Timer';
import confetti from 'canvas-confetti';

export function StepExecutor() {
  const { steps, currentStepIndex, setCurrentStep, nextStep, previousStep } = useRecipe();
  const hasShownConfetti = useRef(false);

  // Trigger confetti when reaching the last step
  useEffect(() => {
    if (steps.length > 0 && currentStepIndex === steps.length - 1 && !hasShownConfetti.current) {
      hasShownConfetti.current = true;

      // Fire confetti burst
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#569cd6', '#dcdcaa', '#ce9178', '#b5cea8', '#007acc']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#569cd6', '#dcdcaa', '#ce9178', '#b5cea8', '#007acc']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }

    // Reset when leaving last step
    if (currentStepIndex < steps.length - 1) {
      hasShownConfetti.current = false;
    }
  }, [currentStepIndex, steps.length]);

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
    <div className="flex flex-col h-full bg-[var(--color-ide-bg)]">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-2.5 bg-[var(--color-ide-bg-lighter)] border-b border-[var(--color-ide-border)]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--color-ide-text)] font-mono">
            RECIPE STEPS
          </h2>
          <div className="text-xs text-[var(--color-ide-text-muted)] font-mono">
            {currentStepIndex >= 0 ? `${currentStepIndex + 1}/${steps.length}` : `${steps.length}`}
          </div>
        </div>
      </div>

      {/* Steps List - with touch scroll support */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden min-h-0"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain'
        }}
      >
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
          <div className="divide-y divide-[var(--color-ide-border)]">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = currentStepIndex > index;

              return (
                <div
                  key={`${step.line}-${index}`}
                  className={`
                    flex items-start gap-3 px-4 py-3 transition-all cursor-pointer
                    ${
                      isActive
                        ? 'bg-[#1a3a52] border-l-4 border-l-[var(--color-accent)]'
                        : isCompleted
                        ? 'bg-[#1a2a1a] border-l-4 border-l-[var(--color-success)]'
                        : 'bg-[var(--color-ide-bg)] hover:bg-[var(--color-ide-bg-lighter)] border-l-4 border-l-transparent'
                    }
                  `}
                  onClick={() => setCurrentStep(index)}
                >
                  {/* Step number badge */}
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className={`
                        w-7 h-7 flex items-center justify-center text-xs font-mono font-bold
                        ${
                          isActive
                            ? 'bg-[var(--color-accent)] text-white'
                            : isCompleted
                            ? 'bg-[var(--color-success)] text-white'
                            : 'bg-[var(--color-ide-bg-lighter)] text-[var(--color-ide-text-muted)] border border-[var(--color-ide-border)]'
                        }
                      `}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{getStepIcon(step.type)}</span>
                      <span className={`text-sm font-medium ${
                        isActive
                          ? 'text-white'
                          : isCompleted
                          ? 'text-[var(--color-ide-text-muted)] line-through'
                          : 'text-[var(--color-ide-text)]'
                      }`}>
                        {step.description}
                      </span>
                    </div>

                    {/* Timer for timer steps */}
                    {step.isTimerStep && step.duration && (
                      <div className="mt-2 mb-1">
                        <Timer line={step.line} />
                      </div>
                    )}

                    {/* Line number */}
                    <div className="text-[10px] text-[var(--color-ide-text-muted)] font-mono mt-1">
                      :{step.line}
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
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-t border-[var(--color-ide-border)] bg-[var(--color-ide-bg)]">
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
