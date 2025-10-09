import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface SignUpProps {
  onBack: () => void;
  onSwitchToSignIn: () => void;
}

export function SignUp({ onBack, onSwitchToSignIn }: SignUpProps) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (password.length < 8) {
      const errorMsg = 'Password must be at least 8 characters';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, name || undefined);
      toast.success('Account created successfully!');
      // Success - user will be updated via AuthContext
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create account. Please try again.';
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
        <h3 className="text-lg font-semibold text-[var(--color-ide-text)] mb-2">Create Account</h3>
        <p className="text-xs text-[var(--color-ide-text-muted)]">
          Start saving and sharing your recipes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="px-3 py-2 bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-xs font-mono text-[var(--color-ide-text-muted)] mb-1.5">
            Name (optional)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-[var(--color-ide-bg)] border border-[var(--color-ide-border)] text-[var(--color-ide-text)] font-mono text-sm focus:outline-none focus:border-[var(--color-accent)]"
            placeholder="Your Name"
          />
        </div>

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
            placeholder="Min. 8 characters"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-mono text-[var(--color-ide-text-muted)] mb-1.5">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-xs text-[var(--color-ide-text-muted)] hover:text-[var(--color-accent)] font-mono transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
