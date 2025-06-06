Filmrecensionsplattform - Node.js, Express  MongoDB

Detta projekt är en backend för en filrecensionsplattform där användare kan registrera sig, 
logga in, recensera filmer och administratörer kan hantera filmer. Byggt med Node.js, Express och MongoDB.

Komma igång.
Klona projektet
git clone <repo-url>
cd Individuell-examination2-nosql-filrecensionsplattform

Installera beroenden  
npm install

Skapa .env-fil och lägg till i projektroten.
Se exempel : MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
JWT_SECRET=dinhemligaJWTnyckel
PORT=3000

Starta servern
npm start  "justeras"

Autentisering & Roller
Registrera: /register
Logga in: /login (får JWT-token)
Skyddade endpoints: Skicka JWT-token i header:
Authorization: Bear<vscode_annotation details=''>er</vscode_annotation> DIN_JWT_TOKEN
Roller:
user (standard)
admin (kan lägga till/uppdatera/ta bort filmer)

API-endpoints
Filmer
GET /movies – Hämta alla filmer
POST /movies – Lägg till film (admin)
PUT /movies/:id – Uppdatera film (admin)
DELETE /movies/:id – Ta bort film (admin)
GET /movies/:id – Hämta detaljer för film
GET /movies/ratings – Hämta alla filmer med genomsnittligt betyg
GET /movies/:id/reviews – Hämta alla recensioner för en film

Recensioner
POST /reviews – Lägg till recension (inloggad)
GET /reviews – Hämta alla recensioner
GET /reviews/:id – Hämta en specifik recension
PUT /reviews/:id – Uppdatera recension (endast skaparen)
DELETE /reviews/:id – Ta bort recension (endast skaparen)

Användare
POST /register – Registrera ny användare
POST /login – Logga in
GET /profile – Hämta inloggad användares profil
PUT /profile – Uppdatera inloggad användares profil
GET /profile/public/:userId – Hämta publikt användarnamn

Admin
GET /admin – Test-endpoint, endast för admin


Testa med Postman
Se kommentarer i koden för exakta steg och exempel på requests.
Skicka JWT-token i header för skyddade endpoints.
Exempel på header:
Authorization: Bearer DIN_JWT_TOKEN

Beroenden
Node.js
Express
Mongoose
dotenv
jsonwebtoken






