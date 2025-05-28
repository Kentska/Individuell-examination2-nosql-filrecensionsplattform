import express from 'express';
import auth from '../middleware/auth.js';
import authorizeRole from '../middleware/authorizeRole.js';
import Movie from '../models/Movie.js';
import Review from '../models/Review.js';

const router = express.Router();

// Lägg till en ny film (kräver admin)
router.post('/movies', auth, authorizeRole('admin'), async (req, res) => {
  try{
	const { title, director, releaseDate, genre } = req.body;
	const newMovie = new Movie({ title, director, releaseDate, genre });
	await newMovie.save();
	res.status(201).json({message:'Film tillagd', movie: newMovie});
  }catch (err) {
	res.status(500).send({message:'Kunde inte lägga till film', error: err.message});
  }
});


// Hämta alla filmer
router.get('/movies', async (req, res) => {
  try {
	const movies = await Movie.find();
	res.json(movies);
  } catch (err) {
	res.status(500).json({ message: 'Kunde inte hämta filmer', error: err.message });
  }
});

// Hämta detaljer för en specifik film
router.get('/movies/:id', async (req, res) => {
 try {
	const movie = await Movie.findById(req.params.id);
	if (!movie)
	  return res.status(404).json({ message: 'Film hittades inte' });
  res.json(movie);
	} catch (err) {
	res.status(500).json({ message: 'Kunde inte hämta film', error: err.message });
	}
});

// Uppdatera en specifik film (kräver admin)
router.put('/movies/:id', auth, authorizeRole('admin'), async (req, res) => {
  try {
	const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
	if (!updateMovie)
	  return res.status(404).json({ message: 'Film hittades inte' });
	res.json({message:'Film uppdaterad', movie: updateMovie});
  } catch (err) {
	res.status(500).json({ message: 'Kunde inte uppdatera film', error: err.message });
  }
});

// Ta bort en specifik film (kräver admin)
router.delete('/movies/:id', auth, authorizeRole('admin'), async (req, res) => {
  try {
	const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
	if (!deletedMovie)
	  return res.status(404).json({ message: 'Film hittades inte' });
	res.json({message:'Film borttagen', movie: deletedMovie});
  } catch (err) {
	res.status(500).json({ message: 'Kunde inte ta bort film', error: err.message });
  }
});

// Hämta alla recensioner för en specifik film
router.get('/movies/:id/reviews', async (req, res) => {
  try {
	const reviews = await Review.find({ movieId: req.params.id });
	res.json(reviews);
  } catch (err) {
	res.status(500).json({ message: 'Kunde inte hämta recensioner', error: err.message });
  }
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