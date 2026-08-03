const Book = require('../models/Book');

// Get all books for a user
exports.getBooks = async (req, res) => {
  try {
    const { status, tag } = req.query;
    const filter = { userId: req.userId };

    if (status) filter.status = status;
    if (tag) filter.tags = tag;

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single book
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.userId });
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create book - UPDATED with progress fields
exports.createBook = async (req, res) => {
  try {
    const { title, author, tags, status, progress, totalPages, currentPage } = req.body;
    
    const book = await Book.create({
      userId: req.userId,
      title,
      author,
      tags: tags || [],
      status: status || 'want-to-read',
      progress: progress || 0,
      totalPages: totalPages || 0,
      currentPage: currentPage || 0
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update book - UPDATED with progress fields
exports.updateBook = async (req, res) => {
  try {
    const { title, author, tags, status, progress, totalPages, currentPage } = req.body;
    
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { 
        title, 
        author, 
        tags, 
        status,
        progress: progress !== undefined ? progress : 0,
        totalPages: totalPages || 0,
        currentPage: currentPage || 0
      },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get stats for dashboard
exports.getStats = async (req, res) => {
  try {
    const [total, reading, completed, wantToRead] = await Promise.all([
      Book.countDocuments({ userId: req.userId }),
      Book.countDocuments({ userId: req.userId, status: 'reading' }),
      Book.countDocuments({ userId: req.userId, status: 'completed' }),
      Book.countDocuments({ userId: req.userId, status: 'want-to-read' })
    ]);

    res.json({
      total,
      reading,
      completed,
      wantToRead
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Export books as CSV - FIXED with proper date formatting
exports.exportBooksCSV = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.userId }).sort({ createdAt: -1 });
    
    if (books.length === 0) {
      return res.status(404).json({ message: 'No books to export' });
    }
    
    // Create CSV header
    let csv = 'Title,Author,Status,Tags,Progress,Pages Read,Total Pages,Added Date\n';
    
    // Add rows
    books.forEach(book => {
      const tags = book.tags.join('; ') || 'None';
      // FIX: Use the actual createdAt date from the database with proper formatting
      const addedDate = new Date(book.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const title = `"${book.title.replace(/"/g, '""')}"`;
      const author = `"${book.author.replace(/"/g, '""')}"`;
      
      csv += `${title},${author},"${book.status}","${tags}",${book.progress || 0},${book.currentPage || 0},${book.totalPages || 0},"${addedDate}"\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=books-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export books as JSON
exports.exportBooksJSON = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.userId }).sort({ createdAt: -1 });
    
    if (books.length === 0) {
      return res.status(404).json({ message: 'No books to export' });
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=books-${Date.now()}.json`);
    res.json(books);
  } catch (error) {
    console.error('Export JSON error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};