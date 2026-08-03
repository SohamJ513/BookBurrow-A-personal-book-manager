'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <div className="text-center animate-fade-in-up">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-100 dark:border-blue-900 rounded-full absolute inset-0 animate-pulse-slow"></div>
            <div className="w-20 h-20 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto relative"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl animate-bounce-slow">🏠</span>
            </div>
          </div>
          <p className="mt-6 text-gray-700 dark:text-gray-300 font-medium text-lg">Loading your cozy nook...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:bg-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto text-center px-4 py-16 animate-fade-in-up">
        {/* Hero Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50/80 dark:bg-blue-900/40 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-blue-100/50 dark:border-blue-800/50 hover-scale">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Your Cozy Reading Nook</span>
        </div>

        {/* Main Heading */}
        <div className="mb-8">
          <span className="text-7xl md:text-8xl block mb-6 animate-bounce-slow">🏠</span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            Welcome to
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BookBurrow
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your cozy reading nook. Track books, set goals, and rediscover your favorite authors — all in one warm, inviting place.
          </p>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30 btn-transition"
            >
              Enter Your Burrow →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-2xl shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30 btn-transition"
              >
                Enter Your Burrow
              </Link>
              <Link
                href="/signup"
                className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 text-lg font-semibold rounded-2xl border-2 border-gray-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg btn-transition"
              >
                Create Your Nook
              </Link>
            </>
          )}
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { 
              icon: '📖', 
              title: 'Track Books', 
              desc: 'Log your reading list with tags and progress.',
              gradient: 'from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/30'
            },
            { 
              icon: '📊', 
              title: 'Smart Dashboard', 
              desc: 'View insights, track results and monitor your progress.',
              gradient: 'from-indigo-50 to-indigo-100/50 dark:from-indigo-900/30 dark:to-indigo-800/30'
            },
            { 
              icon: '🏷️', 
              title: 'Organize & Filter', 
              desc: 'Sort and filter books by tags for easy access.',
              gradient: 'from-purple-50 to-purple-100/50 dark:from-purple-900/30 dark:to-purple-800/30'
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/50 dark:border-slate-700/50 card hover-glow animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1 hover-scale">🔒 Secure Authentication</span>
          <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full hidden sm:block"></span>
          <span className="flex items-center gap-1 hover-scale">☁️ Cloud Sync</span>
          <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full hidden sm:block"></span>
          <span className="flex items-center gap-1 hover-scale">📱 Responsive Design</span>
        </div>
      </div>
    </div>
  );
}