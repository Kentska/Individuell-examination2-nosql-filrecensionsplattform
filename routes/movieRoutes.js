import express from 'express';
import auth from '../middleware/auth.js';
import authorizeRole from '../middleware/authorizeRole.js';
import Movie from '../models/Movie.js';
import Review from '../models/Review.js';

const router = express.Router();

// Lägg till en ny film (kräver admin)
// POST http://localhost:3000/movies
//
// 1. Logga in som admin via /login och kopiera JWT-token från svaret.
// 2. I Postman, välj POST och ange URL ovan.
// 3. Gå till fliken "Headers" och lägg till:
//      Key: Authorization
//      Value: Bearer DIN_JWT_TOKEN
// 4. Gå till fliken "Body", välj "raw" och "JSON".
// 5. Skicka t.ex. detta i bodyn:
/*
{
  "title": "Inception",
  "director": "Christopher Nolan",
  "releaseYear": 2010,
  "genre": ["Sci-fi", "Thriller"]
}
*/
// 6. Klicka på "Send".
// 7. Du får svar: { "message": "Film tillagd", movie: {...} }
router.post('/movies', auth, authorizeRole('admin'), async (req, res) => {
  try{
	const { title, director, releaseYear, genre } = req.body;
	const newMovie = new Movie({ title, director, releaseYear, genre });
	await newMovie.save();
	res.status(201).json({message:'Film tillagd', movie: newMovie});
  }catch (err) {
	res.status(500).send({message:'Kunde inte lägga till film', error: err.message});
  }
});


// Hämta alla filmer
// GET http://localhost:3000/movies
//
// 1. I Postman, välj GET och ange URL ovan.
// 2. Ingen Authorization eller body behövs.
// 3. Klicka på "Send".
// 4. Du får svar: en array med alla filmer.
/*
[
  {
    "_id": "123...",
    "title": "Inception",
    "director": "Christopher Nolan",
    "releaseYear": 2010,
    "genre": ["Sci-fi", "Thriller"],
    ...
  },
  ...
]
*/
router.get('/movies', async (req, res) => {
  try {
	const movies = await Movie.find();
	res.json(movies);
  } catch (err) {
	res.status(500).json({ message: 'Kunde inte hämta filmer', error: err.message });
  }
});

// Hämta alla filmer och deras genomsnittliga betyg
// GET http://localhost:3000/movies/ratings
//
// 1. I Postman, välj GET och ange URL ovan.
// 2. Ingen Authorization eller body behövs.
// 3. Klicka på "Send".
// 4. Du får svar: en array med alla filmer och deras averageRating.
/*
[
  {
    "_id": "123...",
    "title": "Inception",
    "director": "Christopher Nolan",
    "releaseYear": 2010,
    "genre": ["Sci-fi", "Thriller"],
    "averageRating": "8.50",
    ...
  },
  ...
]
*/
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

// Hämta detaljer för en specifik film
// GET http://localhost:3000/movies/:id
//
// 1. I Postman, välj GET och ange URL ovan.
//    Byt ut :id mot det faktiska film-ID:t, t.ex. http://localhost:3000/movies/665f1b...
// 2. Ingen Authorization eller body behövs.
// 3. Klicka på "Send".
// 4. Du får svar: ett objekt med filmens detaljer.
/*
{
  "_id": "665f1b...",
  "title": "Inception",
  "director": "Christopher Nolan",
  "releaseYear": 2010,
  "genre": ["Sci-fi", "Thriller"],
  ...
}
*/
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
// PUT http://localhost:3000/movies/:id
//
// 1. Logga in som admin via /login och kopiera JWT-token från svaret.
// 2. I Postman, välj PUT och ange URL ovan.
//    Byt ut :id mot det faktiska film-ID:t, t.ex. http://localhost:3000/movies/665f1b...
// 3. Gå till fliken "Headers" och lägg till:
//      Key: Authorization
//      Value: Bearer DIN_JWT_TOKEN
// 4. Gå till fliken "Body", välj "raw" och "JSON".
// 5. Skicka t.ex. detta i bodyn:
/*
{
  "title": "Ny titel",
  "genre": ["Action", "Drama"]
}
*/
// 6. Klicka på "Send".
// 7. Du får svar: { "message": "Film uppdaterad", movie: {...} }
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
// DELETE http://localhost:3000/movies/:id
//
// 1. Logga in som admin via /login och kopiera JWT-token från svaret.
// 2. I Postman, välj DELETE och ange URL ovan.
//    Byt ut :id mot det faktiska film-ID:t, t.ex. http://localhost:3000/movies/665f1b...
// 3. Gå till fliken "Headers" och lägg till:
//      Key: Authorization
//      Value: Bearer DIN_JWT_TOKEN
// 4. Klicka på "Send".
// 5. Du får svar: { "message": "Film borttagen", movie: {...} }
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
  // GET http://localhost:3000/movies/:id/reviews
//
// 1. I Postman, välj GET och ange URL ovan.
//    Byt ut :id mot det faktiska film-ID:t, t.ex. http://localhost:3000/movies/665f1b.../reviews
// 2. Ingen Authorization eller body behövs.
// 3. Klicka på "Send".
// 4. Du får svar: en array med alla recensioner för filmen.
/*
[
  {
    "_id": "123...",
    "movieId": "665f1b...",
    "userId": "789...",
    "rating": 8,
    "comment": "Riktigt bra film!",
    ...
  },
  ...
]
*/
router.get('/movies/:id/reviews', async (req, res) => {
	try {
	  const reviews = await Review.find({ movieId: req.params.id });
	  res.json(reviews);
	} catch (err) {
	  res.status(500).json({ message: 'Kunde inte hämta recensioner', error: err.message });
	}
  });
  

export default router;