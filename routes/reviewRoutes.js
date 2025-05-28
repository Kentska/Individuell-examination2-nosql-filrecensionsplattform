import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

// Lägg till en ny recension (kräver inloggning)
router.post('/reviews', auth, (req, res) => {
  // ...lägg till recension...
  res.send('Recension tillagd');
});

// Hämta alla recensioner
router.get('/reviews', (req, res) => {
  // ...hämta recensioner...
  res.send('Lista med recensioner');
});

// Hämta detaljer för en specifik recension
router.get('/reviews/:id', (req, res) => {
  // ...hämta recension...
  res.send(`Detaljer för recension ${req.params.id}`);
});

// Uppdatera en specifik recension (kräver inloggning)
router.put('/reviews/:id', auth, (req, res) => {
  // ...uppdatera recension...
  res.send(`Recension ${req.params.id} uppdaterad`);
});

// Ta bort en specifik recension (kräver inloggning)
router.delete('/reviews/:id', auth, (req, res) => {
  // ...ta bort recension...
  res.send(`Recension ${req.params.id} borttagen`);
});

export default router;