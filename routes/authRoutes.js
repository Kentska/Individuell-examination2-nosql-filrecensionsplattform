import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Registrera en ny användare
// POST http://localhost:3000/register
//
// 1. I Postman, välj POST och ange URL ovan.
// 2. Gå till fliken "Body", välj "raw" och "JSON".
// 3. Skicka t.ex. detta i bodyn:
/*
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "hemligt",
  "role": "user" // valfritt, sätts till "user" om du inte skickar med det
}
*/
// 4. Klicka på "Send".
// 5. Du får svar: { "message": "Användare registrerad", user: {...} }
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // Kontrollera om användaren redan finns
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'E-postadressen är redan registrerad' });

    
    const newUser = new User({ username, email, password, role: role || 'user' });
    await newUser.save();
    res.status(201).json({ message: 'Användare registrerad', user: { username, email, role: newUser.role } });
  } catch (err) {
    res.status(500).json({ message: 'Kunde inte registrera användare', error: err.message });
  }
});

// Logga in en användare
// POST http://localhost:3000/login
//
// 1. I Postman, välj POST och ange URL ovan.
// 2. Gå till fliken "Body", välj "raw" och "JSON".
// 3. Skicka t.ex. detta i bodyn:
/*
{
  "email": "testuser@example.com",
  "password": "hemligt"
}
*/
// 4. Klicka på "Send".
// 5. Du får svar: { "message": "Inloggad", "token": "..." }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
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