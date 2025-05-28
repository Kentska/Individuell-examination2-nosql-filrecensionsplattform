import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Registrera en ny användare
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // Kontrollera om användaren redan finns
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'E-postadressen är redan registrerad' });

    // Skapa ny användare (lägg till lösenordshantering i verklig app)
    const newUser = new User({ username, email, password, role: role || 'user' });
    await newUser.save();
    res.status(201).json({ message: 'Användare registrerad', user: { username, email, role: newUser.role } });
  } catch (err) {
    res.status(500).json({ message: 'Kunde inte registrera användare', error: err.message });
  }
});

// Logga in en användare
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      // I verklig app: använd hashad lösenordskontroll!
      return res.status(401).json({ message: 'Fel e-post eller lösenord' });
    }

    // Skapa JWT-token
    const token = jwt.sign(
      { _id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Inloggad', token });
  } catch (err) {
    res.status(500).json({ message: 'Kunde inte logga in', error: err.message });
  }
});

export default router;