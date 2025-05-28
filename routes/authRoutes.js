import express from 'express';

const router = express.Router();

// Registrera en ny användare
router.post('/register', (req, res) => {
  // ...registrera användare...
  res.send('Användare registrerad');
});

// Logga in en användare
router.post('/login', (req, res) => {
  // ...logga in användare...
  res.send('Inloggad');
});

export default router;