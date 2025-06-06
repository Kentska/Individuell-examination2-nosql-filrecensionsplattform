import movieRoutes from './routes/movieRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import userRoutes from './routes/userRoutes.js';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();
connectDB();
const app = express();
app.use(express.json());

app.use(movieRoutes);
app.use(reviewRoutes);
app.use(userRoutes); 
app.use(authRoutes);
app.use(adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servern körs på port http://localhost:${PORT}`);
});
