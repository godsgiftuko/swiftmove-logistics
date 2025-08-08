import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import connectDB from './database';
import { HTTP_STATUS, SERVER } from '@/constants';
import errorHandler from './middlewares/error_handler.middleware';
import { HttpError } from './errors/http.error';

connectDB();

const app = express();
const SERVER_PORT = SERVER.PORT;
const SERVER_URL = SERVER.URL;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));



// Global error handler
app.use(errorHandler);


// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// 404 handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new HttpError(`Can't find ${req.originalUrl}`, HTTP_STATUS.NOT_FOUND));
});

app.listen(SERVER_PORT, () => {
  console.log(`Server running on ${SERVER_URL}`);
});