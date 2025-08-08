import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import connectDB from './database';
import { SERVER } from '@/constants';
import morgan from "morgan";
import { formatResponse } from './middlewares/format_response';
import { middlewareLogger } from './middlewares/logger.middleware';

connectDB();

const app = express();
const SERVER_PORT = SERVER.PORT;
const SERVER_URL = SERVER.URL;

// Middleware
app.use(cors());
app.use(morgan(":method :url :status :response-time ms"));
app.use(express.json());
app.use(express.static('public'));

app.use(formatResponse);

// Middleware logger
app.use(middlewareLogger);

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});



app.listen(SERVER_PORT, () => {
  console.log(`Server running on ${SERVER_URL}`);
});