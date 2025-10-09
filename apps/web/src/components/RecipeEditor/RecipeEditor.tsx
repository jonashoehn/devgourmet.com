import { useCallback, useRef, useEffect, useState } from 'react';
import { useRecipe } from '../../context';
import { useAuth } from '../../context/AuthContext';
import { trpc } from '../../lib/trpc';
import CodeMirror from '@uiw/react-codemirror';
import { devscript } from '../../lib/devscript-language';
import { EditorView } from '@codemirror/view';
import { FloppyDisk } from '@phosphor-icons/react';
import { toast } from 'sonner';

export function RecipeEditor() {
  const { code, updateCode, errors, currentRecipeId, currentRecipeTitle } = useRecipe();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedCode, setLastSavedCode] = useState(code);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateMutation = trpc.recipes.update.useMutation();
  const utils = trpc.useUtils();

  // Track unsaved changes
  useEffect(() => {
    if (currentRecipeId && code !== lastSavedCode) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [code, lastSavedCode, currentRecipeId]);

  // Reset saved state when recipe changes
  useEffect(() => {
    setLastSavedCode(code);
    setHasUnsavedChanges(false);
  }, [currentRecipeId]);

  // Handle code change with debounce
  const handleChange = useCallback((value: string) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the update to avoid too many re-parses
    timeoutRef.current = setTimeout(() => {
      // Preserve current recipe ID and title when updating code
      updateCode(value, currentRecipeId, currentRecipeTitle);
    }, 500);
  }, [updateCode, currentRecipeId, currentRecipeTitle]);

  // Save current recipe
  const handleSave = useCallback(async () => {
    if (!currentRecipeId || !user) return;

    setIsSaving(true);
    try {
      await updateMutation.mutateAsync({
        id: currentRecipeId,
        data: { recipeCode: code },
      });
      await utils.recipes.list.invalidate();
      setLastSavedCode(code);
      setHasUnsavedChanges(false);
      toast.success('Recipe saved successfully');
    } catch (error) {
      console.error('Failed to save recipe:', error);
      toast.error('Failed to save recipe');
    } finally {
      setIsSaving(false);
    }
  }, [currentRecipeId, code, user, updateMutation, utils]);

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
          <span className="text-[var(--color-ide-text)] font-mono text-sm">
            {currentRecipeTitle || 'recipe.devgourmet'}
          </span>
          {errors.length > 0 && (
            <span className="text-[var(--color-error)] text-xs">
              {errors.length} error{errors.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user && currentRecipeId && (
            <button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className={`px-3 py-1 ${
                hasUnsavedChanges
                  ? 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]'
                  : 'bg-[var(--color-ide-bg)] border border-[var(--color-ide-border)]'
              } disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono text-xs transition-colors flex items-center gap-1.5`}
              title={hasUnsavedChanges ? 'Save Recipe (Unsaved Changes)' : 'No Changes to Save'}
            >
              <FloppyDisk size={14} weight={hasUnsavedChanges ? 'fill' : 'regular'} />
              {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save *' : 'Saved'}
            </button>
          )}
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
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
                paddingBottom: '120px', // Extra space at bottom for mobile accessibility
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
