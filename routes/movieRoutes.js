import express from 'express';
import auth from '../middleware/auth.js';
import authorizeRole from '../middleware/authorizeRole.js';
import Movie from '../models/Movie.js';
import Review from '../models/Review.js';

const router = express.Router();

// Lägg till en ny film (kräver admin)
router.post('/movies', auth, authorizeRole('admin'), (req, res) => {
  // ...lägg till film...
  res.send('Film tillagd');
});

// Hämta alla filmer
router.get('/movies', (req, res) => {
  // ...hämta filmer...
  res.send('Lista med filmer');
});

// Hämta detaljer för en specifik film
router.get('/movies/:id', (req, res) => {
  // ...hämta film...
  res.send(`Detaljer för film ${req.params.id}`);
});

// Uppdatera en specifik film (kräver admin)
router.put('/movies/:id', auth, authorizeRole('admin'), (req, res) => {
  // ...uppdatera film...
  res.send(`Film ${req.params.id} uppdaterad`);
});

// Ta bort en specifik film (kräver admin)
router.delete('/movies/:id', auth, authorizeRole('admin'), (req, res) => {
  // ...ta bort film...
  res.send(`Film ${req.params.id} borttagen`);
});

// Hämta alla recensioner för en specifik film
router.get('/movies/:id/reviews', (req, res) => {
  // ...hämta recensioner...
  res.send(`Recensioner för film ${req.params.id}`);
});

// Hämta alla filmer och deras genomsnittliga betyg
router.get('/movies/ratings', async (req, res) => {
	try {
	  // Hämta alla filmer
	  const movies = await Movie.find();
  
	  // Hämta genomsnittligt betyg för varje film
	  const moviesWithRatings = await Promise.all(
		movies.map(async (movie) => {
		  const reviews = await Review.find({ movieId: movie._id });
		  const avgRating =
			reviews.length > 0
			  ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
			  : null;
		  return {
			...movie.toObject(),
			averageRating: avgRating,
		  };
		})
	  );
  
	  res.json(moviesWithRatings);
	} catch (err) {
	  res.status(500).json({ message: 'Något gick fel', error: err.message });
	}
  });
  

export default router;