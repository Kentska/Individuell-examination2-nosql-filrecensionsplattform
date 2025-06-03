import express from 'express';
import auth from '../middleware/auth.js';
import Review from '../models/Review.js';

const router = express.Router();

// Lägg till en ny recension (kräver inloggning)
// POST http://localhost:3000/reviews
// 
// 1. Logga in via /login och kopiera JWT-token från svaret.
// 2. I Postman, välj POST och ange URL ovan.
// 3. Gå till fliken "Headers" och lägg till:
//      Key: Authorization
//      Value: Bearer DIN_JWT_TOKEN
// 4. Gå till fliken "Body", välj "raw" och "JSON".
// 5. Skicka t.ex. detta i bodyn:
/*
{
  "movieId": "FILMENS_ID",
  "rating": 8,
  "comment": "Riktigt bra film!"
}
*/
// 6. Klicka på "Send".
// 7. Du får svar: { "message": "Recension tillagd", review: {...} }
router.post('/reviews', auth, async (req, res) => {
  try {
	const { movieId, rating, comment } = req.body;
	const newReview = new Review({
	  userId: req.user._id,
	  movieId: movieId,
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
// GET http://localhost:3000/reviews
//
// 1. I Postman, välj GET och ange URL ovan.
// 2. Ingen Authorization eller body behövs (om du inte har skyddat denna route).
// 3. Klicka på "Send".
// 4. Du får svar: en array med alla recensioner.
/*
[
  {
    "_id": "123...",
    "movieId": "456...",
    "userId": "789...",
    "rating": 8,
    "comment": "Riktigt bra film!",
    ...
  },
  ...
]
*/
router.get('/reviews', async (req, res) => {
  try{
	const reviews = await Review.find();
  res.json(reviews);
  } catch (err) {
	res.status(500).json({ message: 'Kunde inte hämta recensioner', error: err.message });
  }
});

// Hämta detaljer för en specifik recension
// GET http://localhost:3000/reviews/:id
//
// 1. I Postman, välj GET och ange URL ovan.
//    Byt ut :id mot det faktiska recension-ID:t, t.ex. http://localhost:3000/reviews/665f1b... 
// 2. Ingen Authorization eller body behövs (om du inte har skyddat denna route).
// 3. Klicka på "Send".
// 4. Du får svar: ett objekt med recensionens detaljer.
/*
{
  "_id": "665f1b...",
  "movieId": "665f1a...",
  "userId": "665f19...",
  "rating": 8,
  "comment": "Riktigt bra film!",
  ...
}
*/
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
// PUT http://localhost:3000/reviews/:id
//
// 1. Logga in via /login och kopiera JWT-token från svaret.
// 2. I Postman, välj PUT och ange URL ovan.
//    Byt ut :id mot det faktiska recension-ID:t, t.ex. http://localhost:3000/reviews/665f1b...
// 3. Gå till fliken "Headers" och lägg till:
//      Key: Authorization
//      Value: Bearer DIN_JWT_TOKEN
// 4. Gå till fliken "Body", välj "raw" och "JSON".
// 5. Skicka t.ex. detta i bodyn:
/*
{
  "rating": 9,
  "comment": "Uppdaterad kommentar!"
}
*/
// 6. Klicka på "Send".
// 7. Du får svar: { "message": "Recension uppdaterad", review: {...} }
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
// DELETE http://localhost:3000/reviews/:id
//
// 1. Logga in via /login och kopiera JWT-token från svaret.
// 2. I Postman, välj DELETE och ange URL ovan.
//    Byt ut :id mot det faktiska recension-ID:t, t.ex. http://localhost:3000/reviews/665f1b...
// 3. Gå till fliken "Headers" och lägg till:
//      Key: Authorization
//      Value: Bearer DIN_JWT_TOKEN
// 4. Klicka på "Send".
// 5. Du får svar: { "message": "Recension borttagen", review: {...} }

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