const express = require('express');
const router = express.Router();
const authorizeRole = require('../middleware/authorizeRole');
const auth = require('../middleware/auth'); // Din JWT-auth-middleware

// Endast admin kan se denna route
router.get('/admin', auth, authorizeRole('admin'), (req, res) => {
  res.send('Endast admin!');
});

// Både admin och moderator kan se denna route
router.get('/moderator', auth, authorizeRole('admin', 'moderator'), (req, res) => {
  res.send('Admin eller moderator!');
});

module.exports = router;