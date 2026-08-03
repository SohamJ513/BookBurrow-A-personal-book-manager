'use client';

import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-slate-700/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg hover-scale">🏠</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">BookBurrow</span>
            <span className="text-sm text-gray-400 dark:text-gray-500">© {year}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 btn-transition">
              Home
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 btn-transition">
              Dashboard
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <Link href="/books" className="hover:text-blue-600 dark:hover:text-blue-400 btn-transition">
              Books
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-blue-600 dark:hover:text-blue-400 btn-transition cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}