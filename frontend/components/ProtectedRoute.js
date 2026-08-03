'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900/50 transition-colors duration-300">
        <div className="text-center animate-fade-in-up">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-20 h-20 border-4 border-blue-100 dark:border-blue-900 rounded-full absolute inset-0 animate-pulse-slow"></div>
            {/* Spinner */}
            <div className="w-20 h-20 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto relative"></div>
            {/* Inner icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl animate-bounce-slow">🏠</span>
            </div>
          </div>
          <p className="mt-6 text-gray-700 dark:text-gray-300 font-medium text-lg">Loading your cozy nook...</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Please wait while we get everything ready</p>
        </div>
      </div>
    );
  }

  return user ? children : null;
}