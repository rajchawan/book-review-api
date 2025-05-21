const Review = require('../models/Review');

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

exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review || review.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Unauthorized' });

  await review.deleteOne();
  res.json({ message: 'Review deleted' });
};
