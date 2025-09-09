import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import LoadingSpinner from './LoadingSpinner';

interface AuthScreenProps {
  auth: firebase.auth.Auth;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ auth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        await auth.createUserWithEmailAndPassword(email, password);
      }
    } catch (err: any) {
      const friendlyError = err.code?.replace('auth/', '').replace(/-/g, ' ') || 'An unknown error occurred.';
      setError(friendlyError.charAt(0).toUpperCase() + friendlyError.slice(1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-900 via-indigo-900 to-black">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
        <h1 className="text-4xl font-bold mb-2 text-center text-cyan-300 tracking-wider">Celestial Compass</h1>
        <p className="text-gray-400 text-center mb-8">{isLogin ? "Sign in to continue your cosmic journey" : "Create an account to begin your exploration"}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-300">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-gray-700 p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center bg-red-500/20 p-3 rounded-md">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? <LoadingSpinner /> : (isLogin ? 'Log In' : 'Sign Up')}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="font-medium text-cyan-400 hover:text-cyan-300"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
