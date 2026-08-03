'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    tags: '',
    status: 'want-to-read',
    progress: 0,
    totalPages: 0,
    currentPage: 0
  });

  useEffect(() => {
    fetchBooks();
  }, [statusFilter]);

  const fetchBooks = async () => {
    try {
      const url = statusFilter ? `/books?status=${statusFilter}` : '/books';
      const response = await api.get(url);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        progress: parseInt(formData.progress) || 0,
        totalPages: parseInt(formData.totalPages) || 0,
        currentPage: parseInt(formData.currentPage) || 0
      };

      if (editingBook) {
        await api.put(`/books/${editingBook._id}`, data);
        toast.success('Book updated successfully!');
      } else {
        await api.post('/books', data);
        toast.success('Book added successfully!');
      }

      resetForm();
      fetchBooks();
      
      // ✅ Notify dashboard to refresh stats
      sessionStorage.setItem('refreshDashboard', Date.now().toString());
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await api.delete(`/books/${id}`);
      toast.success('Book deleted successfully!');
      fetchBooks();
      
      // ✅ Notify dashboard to refresh stats
      sessionStorage.setItem('refreshDashboard', Date.now().toString());
      
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      author: '', 
      tags: '', 
      status: 'want-to-read',
      progress: 0,
      totalPages: 0,
      currentPage: 0
    });
    setEditingBook(null);
    setShowForm(false);
  };

  const editBook = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      tags: book.tags.join(', '),
      status: book.status,
      progress: book.progress || 0,
      totalPages: book.totalPages || 0,
      currentPage: book.currentPage || 0
    });
    setShowForm(true);
  };

  const handleExportCSV = async () => {
    try {
      setShowExportDropdown(false);
      toast.loading('Exporting CSV...');
      const response = await api.get('/books/export/csv', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `books-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success('Books exported as CSV!');
    } catch (error) {
      toast.dismiss();
      if (error.response?.status === 404) {
        toast.error('No books to export');
      } else {
        toast.error('Failed to export');
      }
    }
  };

  const handleExportJSON = async () => {
    try {
      setShowExportDropdown(false);
      toast.loading('Exporting JSON...');
      const response = await api.get('/books/export/json', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `books-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success('Books exported as JSON!');
    } catch (error) {
      toast.dismiss();
      if (error.response?.status === 404) {
        toast.error('No books to export');
      } else {
        toast.error('Failed to export');
      }
    }
  };

  const statusOptions = [
    { value: '', label: 'All Books' },
    { value: 'want-to-read', label: 'Want to Read' },
    { value: 'reading', label: 'Reading' },
    { value: 'completed', label: 'Completed' },
  ];

  const statusBadges = {
    'want-to-read': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    'reading': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    'completed': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4 animate-fade-in-up">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📚 My Books</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your reading collection</p>
            </div>
            <div className="flex gap-3">
              {/* Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-xl btn-transition shadow-sm flex items-center gap-2"
                >
                  📥 Export
                  <span className="text-xs">▼</span>
                </button>
                {showExportDropdown && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-10 min-w-[180px] overflow-hidden animate-fade-in-down">
                    <button
                      onClick={handleExportCSV}
                      className="block w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 btn-transition text-left"
                    >
                      <span>📊</span> CSV (Excel)
                    </button>
                    <button
                      onClick={handleExportJSON}
                      className="block w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 btn-transition text-left border-t border-gray-100 dark:border-slate-700"
                    >
                      <span>📄</span> JSON (Backup)
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl btn-transition shadow-sm"
              >
                {showForm ? '✕ Close Form' : '+ Add Book'}
              </button>
            </div>
          </div>

          {/* Filter & Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white dark:bg-slate-800 dark:text-white input-transition"
            >
              {statusOptions.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            
            {!loading && books.length > 0 && (
              <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>📚 Total: <strong className="text-gray-700 dark:text-gray-300">{books.length}</strong></span>
                <span>📖 Reading: <strong className="text-gray-700 dark:text-gray-300">{books.filter(b => b.status === 'reading').length}</strong></span>
                <span>✅ Completed: <strong className="text-gray-700 dark:text-gray-300">{books.filter(b => b.status === 'completed').length}</strong></span>
              </div>
            )}
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 mb-8 animate-fade-in-up border border-gray-100 dark:border-slate-700 card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {editingBook ? '📝 Edit Book' : '📖 Add New Book'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-white input-transition outline-none"
                      placeholder="Enter book title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Author *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-white input-transition outline-none"
                      placeholder="Enter author name"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tags (comma separated)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-white input-transition outline-none"
                      placeholder="e.g. fiction, mystery, best-seller"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                    <select
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-white input-transition outline-none"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="want-to-read">Want to Read</option>
                      <option value="reading">Reading</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Progress Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Total Pages</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-white input-transition outline-none"
                      placeholder="e.g. 300"
                      value={formData.totalPages || ''}
                      onChange={(e) => setFormData({ ...formData, totalPages: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Current Page</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:text-white input-transition outline-none"
                      placeholder="e.g. 150"
                      value={formData.currentPage || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        const total = formData.totalPages || 0;
                        const progress = total > 0 ? Math.round((val / total) * 100) : 0;
                        setFormData({ 
                          ...formData, 
                          currentPage: val,
                          progress: Math.min(progress, 100)
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Progress</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        className="flex-1 accent-blue-600 dark:accent-blue-400"
                        value={formData.progress || 0}
                        onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[40px]">
                        {formData.progress || 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl btn-primary"
                  >
                    {editingBook ? 'Update Book' : 'Add Book'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Books Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 shimmer h-48"></div>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm animate-fade-in-up card">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No books yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
                Start your reading journey by adding your first book!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl btn-primary"
              >
                Add Your First Book
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book, index) => (
                <div
                  key={book._id}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 card hover-scale animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{book.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">by {book.author}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2 ${statusBadges[book.status]}`}>
                      {book.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  {book.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {book.tags.map((tag, index) => (
                        <span key={index} className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Progress Bar */}
                  {(book.status === 'reading' || book.status === 'completed') && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span className="font-medium">{book.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`rounded-full h-2 transition-all duration-500 ${
                            book.progress >= 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          }`}
                          style={{ width: `${Math.min(book.progress || 0, 100)}%` }}
                        />
                      </div>
                      {book.totalPages > 0 && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {book.currentPage || 0} / {book.totalPages} pages
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => editBook(book)}
                      className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 btn-transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 dark:hover:border-red-700 btn-transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}