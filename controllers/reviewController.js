const Review = require('../models/Review');

/**
 * @swagger
 * /books/{id}/reviews:
 *   post:
 *     summary: Add a review to a book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book to review
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: Great book!
 *     responses:
 *       201:
 *         description: Review added
 *       400:
 *         description: Already reviewed or validation error
 */

exports.addReview = async (req, res) => {
  const existing = await Review.findOne({ user: req.user._id, book: req.params.id });
  if (existing) return res.status(400).json({ message: 'Already reviewed' });

    try {
      const review = await Review.create({ ...req.body, user: req.user._id, book: req.params.id });
      res.status(201).json(review);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
};

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Updated comment
 *     responses:
 *       200:
 *         description: Review updated
 *       403:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 */

exports.updateReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review || review.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Unauthorized' });

  review.rating = req.body.rating || review.rating;
  review.comment = req.body.comment || review.comment;
  
  try {
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 *       403:
 *         description: Unauthorized
 */

exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review || review.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Unauthorized' });

  await review.deleteOne();
  res.json({ message: 'Review deleted' });
};
