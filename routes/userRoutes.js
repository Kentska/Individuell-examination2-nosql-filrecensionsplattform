import express from 'express';
import auth from '../middleware/auth'; // Din JWT-auth-middleware
import User from '../models/User.js';

const router = express.Router();

// Publik route - kräver ingen inloggning
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