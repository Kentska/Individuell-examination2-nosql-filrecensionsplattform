import express from 'express';
import authorizeRole from'../middleware/authorizeRole.js';
import auth from'../middleware/auth.js'; // Din JWT-auth-middleware

const router = express.Router();

// Endast admin kan se denna route
router.get('/admin', auth, authorizeRole('admin'), (req, res) => {
  res.send('Endast admin!');
});

export default router;