const express = require('express');
const router = express.Router();
const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks,
} = require('../controllers/bookController');

// Search route must come before :id to prevent conflict
router.get('/search', searchBooks);

router.route('/')
  .get(getAllBooks)
  .post(addBook);

router.route('/:id')
  .get(getBookById)
  .put(updateBook)
  .delete(deleteBook);

module.exports = router;
