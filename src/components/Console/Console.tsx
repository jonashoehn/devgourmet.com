import { useEffect, useRef, useState } from 'react';
import { useRecipe } from '../../context/index.js';

export function Console() {
  const { consoleMessages, clearConsole } = useRecipe();
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const consoleContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Check if user is near bottom of console
  const handleScroll = () => {
    if (consoleContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = consoleContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShouldAutoScroll(isNearBottom);
    }
  };

  // Auto-scroll to bottom only if user was already at bottom
  useEffect(() => {
    if (shouldAutoScroll && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleMessages, shouldAutoScroll]);

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-[var(--color-error)]';
      case 'warning':
        return 'text-[var(--color-warning)]';
      case 'success':
        return 'text-[var(--color-success)]';
      case 'variable':
        return 'text-[var(--color-variable)]';
      default:
        return 'text-[var(--color-ide-text)]';
    }
  };

  const getMessagePrefix = (type: string) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✓';
      case 'variable':
        return '📝';
      default:
        return '▸';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-ide-bg-light)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-ide-border)]">
        <h2 className="text-sm font-semibold text-[var(--color-ide-text)] font-mono">
          CONSOLE OUTPUT
        </h2>
        {consoleMessages.length > 0 && (
          <button
            onClick={clearConsole}
            className="px-2 py-1 text-xs text-[var(--color-ide-text-muted)] hover:text-[var(--color-ide-text)] hover:bg-[var(--color-ide-bg)] rounded transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Console Messages */}
      <div
        ref={consoleContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto p-2 font-mono text-xs"
      >
        {consoleMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[var(--color-ide-text-muted)]">
            <div className="text-center">
              <div className="text-2xl mb-2">💬</div>
              <p>Console output will appear here</p>
            </div>
          </div>
        ) : (
          <>
            {consoleMessages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-1 leading-5 ${getMessageColor(msg.type)} hover:bg-[var(--color-ide-bg)] px-2 py-1 rounded transition-colors`}
              >
                <span className="mr-2">{getMessagePrefix(msg.type)}</span>
                <span>{msg.message}</span>
                {msg.line !== undefined && (
                  <span className="ml-2 text-[var(--color-ide-text-muted)] text-[10px]">
                    (line {msg.line})
                  </span>
                )}
              </div>
            ))}
            <div ref={consoleEndRef} />
          </>
        )}
      </div>
    </div>
  );
}
