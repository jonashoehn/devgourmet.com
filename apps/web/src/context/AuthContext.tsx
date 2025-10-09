import { createContext, useContext, type ReactNode } from 'react';
import { createAuthClient } from 'better-auth/react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create Better Auth client
const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = authClient.useSession();

  const user = session.data?.user as User | null || null;
  const isLoading = session.isPending;

  const signIn = async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: '/',
    });

    if (error) {
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const params: Record<string, unknown> = {
      email,
      password,
      callbackURL: '/',
    };

    if (name) {
      params.name = name;
    }

    const { error } = await authClient.signUp.email(params as any);

    if (error) {
      throw new Error(error.message || 'Failed to sign up');
    }
  };

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // Session will be automatically updated
        },
      },
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
