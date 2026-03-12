const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
  {
    bookId: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a book title'],
    },
    author: {
      type: String,
      required: [true, 'Please add an author'],
    },
    isbn: {
      type: String,
      required: [true, 'Please add an ISBN'],
      unique: true,
    },
    genre: {
      type: String,
      required: [true, 'Please add a genre'],
    },
    publisher: {
      type: String,
      required: [true, 'Please add a publisher'],
    },
    publicationYear: {
      type: Number,
    },
    totalCopies: {
      type: Number,
      required: [true, 'Please add total copies'],
      min: [1, 'Total copies must be a positive number'],
    },
    availableCopies: {
      type: Number,
      default: function() {
        return this.totalCopies;
      }
    },
    shelfLocation: {
      type: String,
    },
    bookType: {
      type: String,
      enum: ['Reference', 'Circulating'],
      default: 'Circulating',
    },
    status: {
      type: String,
      enum: ['Available', 'Checked Out'],
      default: 'Available',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', bookSchema);
