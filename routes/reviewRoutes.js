import express from 'express';
import auth from '../middleware/auth.js';
import Review from '../models/Review.js';

const router = express.Router();

// Lägg till en ny recension (kräver inloggning)
router.post('/reviews', auth, async (req, res) => {
  try {
	const { movieId, rating, comment } = req.body;
	const newReview = new Review({
	  user: req.user._id,
	  movie: movieId,
	  rating,
	  comment
	});
	await newReview.save();
	res.status(201).json({ message: 'Recension tillagd', review: newReview });
  } catch (err) {
	res.status(500).json({ message: 'Kunde inte lägga till recension', error: err.message });
  }
});

// Hämta alla recensioner
router.get('/reviews', async (req, res) => {
  try{
	const reviews = await Review.find();
  res.json(reviews);
  } catch (err) {
	res.status(500).json({ message: 'Kunde inte hämta recensioner', error: err.message });
  }
});

// Hämta detaljer för en specifik recension
router.get('/reviews/:id', async (req, res) => {
  try {
	const review = await Review.findById(req.params.id);
	if (!review)
	  return res.status(404).json({ message: 'Recension hittades inte' });
	  res.json(review);
	} catch (err) {
	res.status(500).json({ message: 'Kunde inte hämta recension', error: err.message });
  }
});

// Uppdatera en specifik recension (kräver inloggning)
router.put('/reviews/:id', auth, async (req, res) => {
  try {
	const updatedReview = await Review.findOneAndUpdate(
			{ _id: req.params.id, userId: req.user._id },
			req.body,
			{ new: true }
	);
	if (!updatedReview)
	  return res.status(404).json({ message: 'Recension hittades inte eller du har inte behörighet att uppdatera' });
  res.json({message:`Recension uppdaterad`, review: updatedReview });
  } catch (err) {
	res.status(500).json({ message: 'Kunde inte uppdatera recension', error: err.message });
  }
});

// Ta bort en specifik recension (kräver inloggning)
router.delete('/reviews/:id', auth, async (req, res) => {
  try {
	const deletedReview = await Review.findOneAndDelete({
	  _id: req.params.id,
	  userId: req.user._id,
  });
  if (!deletedReview)
	return res.status(404).json({ message: 'Recension hittades inte eller du har inte behörighet att ta bort den' });
res.json({ message: 'Recension borttagen', review: deletedReview });
  } catch (err) {
	res.status(500).json({ message: 'Kunde inte ta bort recension', error: err.message });
  }
});

export default router;