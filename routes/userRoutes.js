import express from 'express';
import auth from '../middleware/auth'; // Din JWT-auth-middleware

const router = express.Router();

// Publik route - kräver ingen inloggning
router.get('/profile/public/:userId', (req, res) => {
  // Hämta och visa publik användarinfo
  res.send(`Publik profil för användare ${req.params.userId}`);
});

// Privat route - kräver inloggning
router.get('/profile', auth, (req, res) => {
  // Visa inloggad användares profil
  res.send(`Din privata profil, ${req.user.username}`);
});

// Uppdatera profil - kräver inloggning
router.put('/profile', auth, (req, res) => {
  // Uppdatera användarens profil
  res.send('Profil uppdaterad!');
});

export default router;