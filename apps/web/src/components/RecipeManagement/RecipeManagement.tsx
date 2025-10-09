import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { RecipeList } from './RecipeList';
import { User, SignOut } from '@phosphor-icons/react';

export function RecipeManagement() {
  const { user, isLoading, signOut } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-[var(--color-ide-bg)]">
        <div className="flex-shrink-0 px-4 py-2.5 bg-[var(--color-ide-bg-lighter)] border-b border-[var(--color-ide-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-ide-text)] font-mono">
            RECIPES
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-[var(--color-ide-text-muted)] text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--color-ide-bg)]">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-2.5 bg-[var(--color-ide-bg-lighter)] border-b border-[var(--color-ide-border)] flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--color-ide-text)] font-mono">
          RECIPES
        </h2>
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-ide-text-muted)] font-mono truncate max-w-[180px]" title={user.email}>
              {user.email}
            </span>
            <button
              onClick={() => signOut()}
              className="p-1.5 hover:bg-[var(--color-ide-bg)] rounded transition-colors flex-shrink-0"
              title="Sign Out"
            >
              <SignOut size={16} className="text-[var(--color-ide-text-muted)] hover:text-[var(--color-ide-text)]" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
        {!user ? (
          // Not authenticated - show auth forms
          <div className="p-4">
            {authMode === null && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <User size={48} weight="fill" className="text-[var(--color-ide-text-muted)] mx-auto mb-4" />
                  <p className="text-[var(--color-ide-text)] text-sm mb-2">
                    Sign in to save and manage your recipes
                  </p>
                  <p className="text-[var(--color-ide-text-muted)] text-xs">
                    or continue using demo recipes below
                  </p>
                </div>
                <button
                  onClick={() => setAuthMode('signin')}
                  className="w-full px-4 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-mono text-sm transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className="w-full px-4 py-3 bg-[var(--color-ide-bg-lighter)] hover:bg-[var(--color-ide-bg)] border border-[var(--color-ide-border)] text-[var(--color-ide-text)] font-mono text-sm transition-colors"
                >
                  Create Account
                </button>
                <div className="pt-4 border-t border-[var(--color-ide-border)]">
                  <h3 className="text-xs font-semibold text-[var(--color-ide-text-muted)] mb-2 font-mono uppercase">
                    Demo Recipes
                  </h3>
                  <RecipeList showDemoOnly />
                </div>
              </div>
            )}
            {authMode === 'signin' && (
              <SignIn onBack={() => setAuthMode(null)} onSwitchToSignUp={() => setAuthMode('signup')} />
            )}
            {authMode === 'signup' && (
              <SignUp onBack={() => setAuthMode(null)} onSwitchToSignIn={() => setAuthMode('signin')} />
            )}
          </div>
        ) : (
          // Authenticated - show recipe list
          <RecipeList />
        )}
      </div>
    </div>
  );
}
