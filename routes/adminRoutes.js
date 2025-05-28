import express from 'express';
import authorizeRole from'../middleware/authorizeRole';
import auth from'../middleware/auth'; // Din JWT-auth-middleware

const router = express.Router();

// Endast admin kan se denna route
router.get('/admin', auth, authorizeRole('admin'), (req, res) => {
  res.send('Endast admin!');
});

// Både admin och moderator kan se denna route
router.get('/moderator', auth, authorizeRole('admin', 'moderator'), (req, res) => {
  res.send('Admin eller moderator!');
});

export default router;