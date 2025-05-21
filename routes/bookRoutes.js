const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  addBook, getBooks, getBookDetails, searchBooks
} = require('../controllers/bookController');

router.post('/books', auth, addBook);
router.get('/books', auth, getBooks);
router.get('/books/:id', auth, getBookDetails);
router.get('/search', auth, searchBooks);

module.exports = router;
