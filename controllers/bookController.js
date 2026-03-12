const Book = require('../models/Book');

// @desc    Add new book
// @route   POST /books
// @access  Public
const addBook = async (req, res, next) => {
  try {
    const { isbn } = req.body;
    const bookExists = await Book.findOne({ isbn });

    if (bookExists) {
      res.status(400);
      throw new Error('Book with this ISBN already exists');
    }

    const book = await Book.create(req.body);

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all books
// @route   GET /books
// @access  Public
const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

// @desc    Get book by ID
// @route   GET /books/:id
// @access  Public
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
};

// @desc    Update book details
// @route   PUT /books/:id
// @access  Public
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedBook);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete book
// @route   DELETE /books/:id
// @access  Public
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }

    await Book.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Search books by title
// @route   GET /books/search?title=xyz
// @access  Public
const searchBooks = async (req, res, next) => {
  try {
    const { title } = req.query;
    if (!title) {
        res.status(400);
        throw new Error('Please provide a title to search');
    }
    const books = await Book.find({
      title: { $regex: title, $options: 'i' },
    });

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks,
};
