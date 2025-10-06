import { useState, useCallback, useRef, useEffect } from 'react';
import { useRecipe } from '../../context';

export function RecipeEditor() {
  const { code, updateCode, errors } = useRecipe();
  const [localCode, setLocalCode] = useState(code);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Sync local code with context when it changes externally
  useEffect(() => {
    setLocalCode(code);
  }, [code]);

  // Handle code change with debounce
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setLocalCode(newCode);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the update to avoid too many re-parses
    timeoutRef.current = setTimeout(() => {
      updateCode(newCode);
    }, 500);
  }, [updateCode]);

  // Handle Tab key for indentation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = localCode.substring(0, start) + '  ' + localCode.substring(end);
      setLocalCode(newCode);

      // Set cursor position after the inserted spaces
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  }, [localCode]);

  return (
    <div className="flex flex-col h-full bg-[var(--color-ide-bg-light)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-ide-bg-lighter)] border-b border-[var(--color-ide-border)]">
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-ide-text)] font-mono text-sm">recipe.devgourmet</span>
          {errors.length > 0 && (
            <span className="text-[var(--color-error)] text-xs">
              {errors.length} error{errors.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
      </div>

      {/* Simple code editor */}
      <textarea
        value={localCode}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="flex-1 p-4 bg-[var(--color-ide-bg)] text-[var(--color-ide-text)] font-mono text-sm resize-none outline-none border-none"
        spellCheck={false}
        placeholder="Write your recipe here..."
      />

      {/* Error display */}
      {errors.length > 0 && (
        <div className="px-4 py-2 bg-[var(--color-ide-bg-lighter)] border-t border-[var(--color-error)] max-h-24 overflow-auto">
          {errors.map((error, idx) => (
            <div key={idx} className="text-xs text-[var(--color-error)] mb-1">
              Line {error.line}: {error.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
