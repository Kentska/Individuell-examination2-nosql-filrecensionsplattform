import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Ansluten till databasen!');
  } catch (err) {
    console.error('Databasanslutning misslyckades:', err);
    process.exit(1);
  }
};

export default connectDB;