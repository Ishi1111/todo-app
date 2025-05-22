import express from 'express';
import authRoutes from './routes/auth.routes';
import todoRoutes from './routes/todo.routes';
import { setupSwagger } from './config/swaggerOptions';

// Builds and exports the Express app
const app = express();
const PORT = 5000;

app.use(express.json());

// Roues
app.use('/auth', authRoutes);
app.use('/todo', todoRoutes)

// Swagger documentation setup
setupSwagger(app);


export default app;