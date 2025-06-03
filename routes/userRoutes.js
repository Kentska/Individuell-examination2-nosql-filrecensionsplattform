import express from 'express';
import auth from '../middleware/auth'; // Din JWT-auth-middleware
import User from '../models/User.js';

const router = express.Router();

// Publik route - kräver ingen inloggning
// GET http://localhost:3000/profile/public/:userId
//
// 1. I Postman, välj GET och ange URL ovan.
//    Byt ut :userId mot det faktiska användar-ID:t, t.ex. http://localhost:3000/profile/public/665f1b...
// 2. Ingen Authorization eller body behövs.
// 3. Klicka på "Send".
// 4. Du får svar: { "username": "namn" }
router.get('/profile/public/:userId', async (req, res) => {
	try {
		const user = await User.findById(req.params.userId).select('username');
		if (!user) return res.status(404).json({ message: 'Användare hittades inte' });
		res.json({ username: user.username });
	  } catch (err) {
		res.status(500).json({ message: 'Kunde inte hämta användare', error: err.message });
	  }
	});
	

// Privat route - kräver inloggning
// GET http://localhost:3000/profile
//
// 1. Logga in via /login och kopiera JWT-token från svaret.
// 2. I Postman, välj GET och ange URL ovan.
// 3. Gå till fliken "Headers" och lägg till:
//      Key: Authorization
//      Value: Bearer DIN_JWT_TOKEN
// 4. Klicka på "Send".
// 5. Du får svar: ett objekt med din användares username och email.
/*
{
  "username": "testuser",
  "email": "testuser@example.com"
}
*/
router.get('/profile', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select('username email');
		if (!user) return res.status(404).json({ message: 'Användare hittades inte' });
		res.json(user);
	  } catch (err) {
		res.status(500).json({ message: 'Kunde inte hämta profil', error: err.message });
	  }
	});

// Uppdatera profil - kräver inloggning
// PUT http://localhost:3000/profile
//
// 1. Logga in via /login och kopiera JWT-token från svaret.
// 2. I Postman, välj PUT och ange URL ovan.
// 3. Gå till fliken "Headers" och lägg till:
//      Key: Authorization
//      Value: Bearer DIN_JWT_TOKEN
// 4. Gå till fliken "Body", välj "raw" och "JSON".
// 5. Skicka t.ex. detta i bodyn:
/*
{
  "username": "nyttnamn",
  "email": "ny@mail.se"
}
*/
// 6. Klicka på "Send".
// 7. Du får svar: { "message": "Profil uppdaterad!", user: {...} }
router.put('/profile', auth, async (req, res) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(
		  req.user._id,
		  req.body,
		  { new: true, runValidators: true }
		).select('username email');
		if (!updatedUser) return res.status(404).json({ message: 'Användare hittades inte' });
		res.json({ message: 'Profil uppdaterad!', user: updatedUser });
	  } catch (err) {
		res.status(500).json({ message: 'Kunde inte uppdatera profil', error: err.message });
	  }
	});

export default router;