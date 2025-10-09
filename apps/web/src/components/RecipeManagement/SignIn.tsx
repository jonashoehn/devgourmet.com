import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface SignInProps {
  onBack: () => void;
  onSwitchToSignUp: () => void;
}

export function SignIn({ onBack, onSwitchToSignUp }: SignInProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast.success('Successfully signed in!');
      // Success - user will be updated via AuthContext
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to sign in. Please check your credentials.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[var(--color-ide-text-muted)] hover:text-[var(--color-ide-text)] text-sm font-mono transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div>
        <h3 className="text-lg font-semibold text-[var(--color-ide-text)] mb-2">Sign In</h3>
        <p className="text-xs text-[var(--color-ide-text-muted)]">
          Access your saved recipes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="px-3 py-2 bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-mono text-[var(--color-ide-text-muted)] mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-[var(--color-ide-bg)] border border-[var(--color-ide-border)] text-[var(--color-ide-text)] font-mono text-sm focus:outline-none focus:border-[var(--color-accent)]"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-mono text-[var(--color-ide-text-muted)] mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2 bg-[var(--color-ide-bg)] border border-[var(--color-ide-border)] text-[var(--color-ide-text)] font-mono text-sm focus:outline-none focus:border-[var(--color-accent)]"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono text-sm transition-colors"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-xs text-[var(--color-ide-text-muted)] hover:text-[var(--color-accent)] font-mono transition-colors"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
