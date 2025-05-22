import { connectDB } from './config/db';
import dotenv from 'dotenv';
import { startCronJob } from './cron/cron';
import app from './app';

dotenv.config();

// Server startup
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
   app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);

      // cron 
      startCronJob();
   });
});
