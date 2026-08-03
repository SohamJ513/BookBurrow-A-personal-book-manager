'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/utils/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [goalData, setGoalData] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState(12);
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to refresh stats
  const refreshStats = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    fetchStats();
    fetchGoalProgress();
  }, [refreshKey]);

  // Listen for book updates from books page
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'refreshDashboard') {
        fetchStats();
        fetchGoalProgress();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/books/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoalProgress = async () => {
    try {
      const response = await api.get('/auth/goal-progress');
      setGoalData(response.data);
      setNewGoal(response.data.goal);
    } catch (error) {
      console.error('Error fetching goal:', error);
    }
  };

  const updateGoal = async () => {
    try {
      await api.put('/auth/goal', { goal: newGoal });
      toast.success('Reading goal updated!');
      setShowGoalModal(false);
      fetchGoalProgress();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update goal');
    }
  };

  const statusCards = [
    { key: 'total', label: 'Total Books', icon: '📚', gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { key: 'reading', label: 'Reading', icon: '📖', gradient: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/30' },
    { key: 'completed', label: 'Completed', icon: '✅', gradient: 'from-green-500 to-green-600', bg: 'bg-green-50 dark:bg-green-900/30' },
    { key: 'wantToRead', label: 'Want to Read', icon: '📋', gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/30' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            <div className="animate-fade-in-up">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Overview of your reading collection</p>
            </div>
            <Link
              href="/books"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-sm btn-transition"
            >
              + Add Book
            </Link>
          </div>

          {/* Stats Cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 shimmer h-28"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statusCards.map(({ key, label, icon, gradient, bg }, index) => (
                <div
                  key={key}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 card hover-scale animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center text-2xl`}>
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                      <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                        {stats?.[key] || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Stats Widget */}
          {!loading && stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 animate-fade-in-up">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-5 border border-green-100/50 dark:border-green-800/30 hover-lift hover-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">Completed Books</p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-1">{stats.completed || 0}</p>
                    <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                      {stats.completed > 0 ? '🎉 Keep up the great work!' : 'Start reading to build your collection'}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-2xl">
                    ✅
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-50/50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-5 border border-yellow-100/50 dark:border-yellow-800/30 hover-lift hover-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">Currently Reading</p>
                    <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">{stats.reading || 0}</p>
                    <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-1">
                      {stats.reading > 0 ? '📖 Stay focused on your current book!' : 'Pick a book to start reading'}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center text-2xl">
                    📖
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reading Goal Section */}
          {goalData && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 mt-6 card animate-fade-in-up">
              <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🎯 Reading Goal</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {goalData.completed} of {goalData.goal} books completed
                    {goalData.remaining > 0 && (
                      <span className="text-gray-400 dark:text-gray-500"> ({goalData.remaining} more to go)</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setShowGoalModal(true)}
                  className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 btn-transition"
                >
                  Set Goal
                </button>
              </div>
              
              <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${
                    goalData.progress >= 100 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}
                  style={{ width: `${Math.min(goalData.progress, 100)}%` }}
                />
              </div>
              <p className="text-sm font-medium mt-2">
                {goalData.progress >= 100 ? (
                  <span className="text-green-600 dark:text-green-400">🎉 Congratulations! You've achieved your reading goal!</span>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">{goalData.progress}% towards your goal</span>
                )}
              </p>
            </div>
          )}

          {/* Goal Modal */}
          {showGoalModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 modal-enter">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-scale-in">
                <div className="text-center">
                  <div className="text-5xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Set Your Reading Goal</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">How many books do you want to read this year?</p>
                  <div className="flex items-center gap-4 justify-center">
                    <button
                      onClick={() => setNewGoal(Math.max(0, newGoal - 1))}
                      className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 btn-transition text-xl font-bold text-gray-700 dark:text-gray-300"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="0"
                      className="w-24 px-4 py-3 text-center border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white text-2xl font-bold outline-none input-transition"
                      value={newGoal}
                      onChange={(e) => setNewGoal(parseInt(e.target.value) || 0)}
                    />
                    <button
                      onClick={() => setNewGoal(newGoal + 1)}
                      className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 btn-transition text-xl font-bold text-gray-700 dark:text-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex gap-3 mt-6 justify-center">
                    <button
                      onClick={() => setShowGoalModal(false)}
                      className="px-6 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 btn-transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateGoal}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl btn-primary"
                    >
                      Save Goal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}