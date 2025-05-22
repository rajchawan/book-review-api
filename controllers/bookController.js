const Book = require('../models/Book');
const Review = require('../models/Review');

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Bad request
 */

exports.addBook = async (req, res) => {
  try {
    const book = await Book.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books with optional filters
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of books
 */

exports.getBooks = async (req, res) => {
  const { author, genre, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (author) filter.author = new RegExp(author, 'i');
  if (genre) filter.genre = genre;

  const books = await Book.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  res.json(books);
};

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get detailed information of a book, including reviews and average rating
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book to retrieve
 *     responses:
 *       200:
 *         description: Book details with average rating and reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *                 averageRating:
 *                   type: string
 *                   example: "4.25"
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       404:
 *         description: Book not found
 */

exports.getBookDetails = async (req, res) => {
  const book = await Book.findById(req.params.id);
  const reviews = await Review.find({ book: book._id }).populate('user', 'username');
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
  res.json({ book, averageRating: avgRating.toFixed(2), reviews });
};

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search books by title or author
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query to match book title or author
 *     responses:
 *       200:
 *         description: List of books that match the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request or missing query
 */

exports.searchBooks = async (req, res) => {
  const { q } = req.query;
  const books = await Book.find({
    $or: [
      { title: new RegExp(q, 'i') },
      { author: new RegExp(q, 'i') }
    ]
  });
  res.json(books);
};
