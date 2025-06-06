import express from 'express';
import authorizeRole from'../middleware/authorizeRole.js';
import auth from'../middleware/auth.js'; 

const router = express.Router();

// Endast admin kan se denna route
// GET http://localhost:3000/admin
//
// 1. Logga in som admin via /login och kopiera JWT-token från svaret.
// 2. I Postman, välj GET och ange URL ovan.
// 3. Gå till fliken "Headers" och lägg till:
//      Key: Authorization
//      Value: Bearer DIN_JWT_TOKEN
// 4. Klicka på "Send".
// 5. Du får svar: "Endast admin!" om du är admin, annars får du 403 Forbidden.
router.get('/admin', auth, authorizeRole('admin'), (req, res) => {
  res.send('Hej och välkommen admin!');
});

export default router;