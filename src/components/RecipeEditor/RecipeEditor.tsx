import { useCallback, useRef, useEffect } from 'react';
import { useRecipe } from '../../context';
import CodeMirror from '@uiw/react-codemirror';
import { devscript } from '../../lib/devscript-language';
import { EditorView } from '@codemirror/view';

export function RecipeEditor() {
  const { code, updateCode, errors } = useRecipe();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle code change with debounce
  const handleChange = useCallback((value: string) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the update to avoid too many re-parses
    timeoutRef.current = setTimeout(() => {
      updateCode(value);
    }, 500);
  }, [updateCode]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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

      {/* CodeMirror Editor */}
      <div className="flex-1 overflow-auto">
        <CodeMirror
          value={code}
          onChange={handleChange}
          extensions={[
            devscript,
            EditorView.lineWrapping,
            EditorView.theme({
              '&': {
                fontSize: '14px',
                height: '100%',
              },
              '.cm-content': {
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                padding: '16px 0',
              },
              '.cm-gutters': {
                backgroundColor: 'var(--color-ide-bg-lighter)',
                color: 'var(--color-ide-text-muted)',
                border: 'none',
                paddingRight: '8px',
              },
              '.cm-activeLineGutter': {
                backgroundColor: 'var(--color-ide-bg)',
              },
              '.cm-line': {
                padding: '0 16px',
              },
              '.cm-activeLine': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
              '.cm-selectionBackground, ::selection': {
                backgroundColor: 'rgba(0, 122, 204, 0.3) !important',
              },
              '&.cm-focused .cm-selectionBackground, &.cm-focused ::selection': {
                backgroundColor: 'rgba(0, 122, 204, 0.3) !important',
              },
              '.cm-cursor': {
                borderLeftColor: 'var(--color-ide-text)',
              },
            }),
          ]}
          theme="dark"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: false,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            searchKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
          style={{
            height: '100%',
          }}
        />
      </div>

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
