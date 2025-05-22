import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
   try {
      const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/todo-app';

      await mongoose.connect(dbUrl!);
      console.log('MongoDB connected');
   } catch (err) {
      console.error(err);
      process.exit(1);
   }
};
