import { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { useRecipe } from '../../context';
import { Trash, Eye, LockSimple, Globe, Plus, FloppyDisk, X, ShareNetwork, Warning } from '@phosphor-icons/react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RecipeListProps {
  showDemoOnly?: boolean;
}

export function RecipeList({ showDemoOnly = false }: RecipeListProps) {
  const { updateCode } = useRecipe();
  const [isCreating, setIsCreating] = useState(false);
  const [newRecipeTitle, setNewRecipeTitle] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState<{ id: string; title: string } | null>(null);

  const recipesQuery = trpc.recipes.list.useQuery();
  const createMutation = trpc.recipes.create.useMutation();
  const updateMutation = trpc.recipes.update.useMutation();
  const deleteMutation = trpc.recipes.delete.useMutation();

  const utils = trpc.useUtils();

  const handleCreateRecipe = async () => {
    if (!newRecipeTitle.trim()) return;

    try {
      await createMutation.mutateAsync({
        title: newRecipeTitle,
        recipeCode: '// Your recipe here\nlet servings = 4;\n',
        isPublic: false,
      });
      await utils.recipes.list.invalidate();
      setNewRecipeTitle('');
      setIsCreating(false);
      toast.success('Recipe created successfully');
    } catch (error) {
      console.error('Failed to create recipe:', error);
      toast.error('Failed to create recipe');
    }
  };

  const handleLoadRecipe = (recipeCode: string, recipeId?: string, recipeTitle?: string) => {
    updateCode(recipeCode, recipeId, recipeTitle);
  };

  const handleDeleteRecipe = async () => {
    if (!recipeToDelete) return;

    try {
      await deleteMutation.mutateAsync({ id: recipeToDelete.id });
      await utils.recipes.list.invalidate();
      toast.success('Recipe deleted successfully');
      setDeleteDialogOpen(false);
      setRecipeToDelete(null);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      toast.error('Failed to delete recipe');
    }
  };

  const openDeleteDialog = (id: string, title: string) => {
    setRecipeToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleTogglePublic = async (id: string, currentIsPublic: boolean) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: { isPublic: !currentIsPublic },
      });
      await utils.recipes.list.invalidate();
      toast.success(`Recipe is now ${!currentIsPublic ? 'public' : 'private'}`);
    } catch (error) {
      console.error('Failed to update recipe:', error);
      toast.error('Failed to update recipe visibility');
    }
  };

  const handleShare = (id: string, isPublic: boolean) => {
    if (!isPublic) {
      toast.error('Recipe must be public to share');
      return;
    }

    const shareUrl = `${window.location.origin}?recipe=${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Share link copied to clipboard!', {
        description: shareUrl,
      });
    }).catch(() => {
      toast.info('Share this link', {
        description: shareUrl,
      });
    });
  };

  if (recipesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-[var(--color-ide-text-muted)] text-sm">Loading recipes...</div>
      </div>
    );
  }

  if (recipesQuery.error) {
    return (
      <div className="p-4">
        <div className="px-3 py-2 bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-mono">
          Failed to load recipes
        </div>
      </div>
    );
  }

  const userRecipes = showDemoOnly ? [] : (recipesQuery.data?.userRecipes || []);
  const demoRecipes = recipesQuery.data?.demoRecipes || [];

  return (
    <>
    <div className="p-3 space-y-4">
      {!showDemoOnly && (
        <>
          {/* Create Recipe Button */}
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full px-4 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-mono text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} weight="bold" />
              New Recipe
            </button>
          )}

          {/* Create Recipe Form */}
          {isCreating && (
            <div className="p-3 bg-[var(--color-ide-bg-lighter)] border border-[var(--color-ide-border)] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-[var(--color-ide-text)] font-mono uppercase">
                  New Recipe
                </h4>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-[var(--color-ide-text-muted)] hover:text-[var(--color-ide-text)]"
                >
                  <X size={16} />
                </button>
              </div>
              <input
                type="text"
                value={newRecipeTitle}
                onChange={(e) => setNewRecipeTitle(e.target.value)}
                placeholder="Recipe title"
                className="w-full px-3 py-2 bg-[var(--color-ide-bg)] border border-[var(--color-ide-border)] text-[var(--color-ide-text)] font-mono text-sm focus:outline-none focus:border-[var(--color-accent)]"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateRecipe}
                  disabled={!newRecipeTitle.trim() || createMutation.isPending}
                  className="flex-1 px-3 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <FloppyDisk size={14} />
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewRecipeTitle('');
                  }}
                  className="px-3 py-2 bg-[var(--color-ide-bg)] hover:bg-[var(--color-ide-bg-lighter)] border border-[var(--color-ide-border)] text-[var(--color-ide-text-muted)] font-mono text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* User Recipes */}
          {userRecipes.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[var(--color-ide-text-muted)] mb-2 font-mono uppercase">
                My Recipes ({userRecipes.length})
              </h3>
              <div className="space-y-2">
                {userRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="p-3 bg-[var(--color-ide-bg-lighter)] border border-[var(--color-ide-border)] hover:border-[var(--color-accent)] transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-semibold text-[var(--color-ide-text)] font-mono flex-1">
                        {recipe.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        {recipe.isPublic && (
                          <button
                            onClick={() => handleShare(recipe.id, recipe.isPublic)}
                            className="p-1.5 hover:bg-[var(--color-ide-bg)] rounded transition-colors"
                            title="Share Recipe"
                          >
                            <ShareNetwork size={14} className="text-blue-400" />
                          </button>
                        )}
                        <button
                          onClick={() => handleTogglePublic(recipe.id, recipe.isPublic)}
                          className="p-1.5 hover:bg-[var(--color-ide-bg)] rounded transition-colors"
                          title={recipe.isPublic ? 'Make Private' : 'Make Public'}
                        >
                          {recipe.isPublic ? (
                            <Globe size={14} className="text-green-500" />
                          ) : (
                            <LockSimple size={14} className="text-[var(--color-ide-text-muted)]" />
                          )}
                        </button>
                        <button
                          onClick={() => openDeleteDialog(recipe.id, recipe.title)}
                          className="p-1.5 hover:bg-[var(--color-ide-bg)] rounded transition-colors"
                          title="Delete Recipe"
                        >
                          <Trash size={14} className="text-[var(--color-ide-text-muted)] hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[var(--color-ide-text-muted)] font-mono mb-2">
                      <span>
                        {new Date(recipe.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="text-[10px]">
                        {recipe.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleLoadRecipe(recipe.recipeCode, recipe.id, recipe.title)}
                      className="w-full px-3 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-mono text-xs transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye size={14} />
                      Load Recipe
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {userRecipes.length === 0 && !isCreating && (
            <div className="text-center py-8">
              <p className="text-[var(--color-ide-text-muted)] text-sm mb-4">
                You haven't created any recipes yet
              </p>
            </div>
          )}
        </>
      )}

      {/* Demo Recipes */}
      {demoRecipes.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[var(--color-ide-text-muted)] mb-2 font-mono uppercase">
            {showDemoOnly ? 'Available Recipes' : `Demo Recipes (${demoRecipes.length})`}
          </h3>
          <div className="space-y-2">
            {demoRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="p-3 bg-[var(--color-ide-bg-lighter)] border border-[var(--color-ide-border)] hover:border-[var(--color-accent)] transition-all"
              >
                <h4 className="text-sm font-semibold text-[var(--color-ide-text)] font-mono mb-2">
                  {recipe.title}
                </h4>
                <button
                  onClick={() => handleLoadRecipe(recipe.recipeCode)}
                  className="w-full px-3 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-mono text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={14} />
                  Load Recipe
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Delete Confirmation Dialog */}
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent className="bg-[var(--color-ide-bg-lighter)] border-2 border-[var(--color-error)] text-[var(--color-ide-text)] sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Warning size={32} weight="fill" className="text-[var(--color-error)]" />
            <DialogTitle className="text-lg font-bold font-mono text-[var(--color-error)]">
              Delete Recipe
            </DialogTitle>
          </div>
          <DialogDescription className="text-[var(--color-ide-text-muted)] font-mono text-sm">
            Are you sure you want to delete <span className="text-[var(--color-ide-text)] font-semibold">"{recipeToDelete?.title}"</span>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <button
            onClick={() => {
              setDeleteDialogOpen(false);
              setRecipeToDelete(null);
            }}
            className="px-4 py-2 bg-[var(--color-ide-bg)] hover:bg-[var(--color-ide-bg-lighter)] border border-[var(--color-ide-border)] text-[var(--color-ide-text)] font-mono text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteRecipe}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 bg-[var(--color-error)] hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono text-sm transition-colors flex items-center gap-2"
          >
            <Trash size={16} weight="fill" />
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Recipe'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
