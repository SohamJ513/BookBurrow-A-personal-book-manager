const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/auth');

// All book routes require authentication
router.use(authMiddleware);

router.get('/', bookController.getBooks);
router.get('/stats', bookController.getStats);
router.get('/export/csv', bookController.exportBooksCSV);
router.get('/export/json', bookController.exportBooksJSON);
router.get('/:id', bookController.getBook);
router.post('/', bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;