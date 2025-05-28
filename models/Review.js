import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 10, required: true },
  comment: { type: String }
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);