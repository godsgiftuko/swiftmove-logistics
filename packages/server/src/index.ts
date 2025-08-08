import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit';
import connectDB from './database';
import { API, SERVER } from '@/constants';
import morgan from "morgan";
import { formatResponse } from './middlewares/format_response';
import { middlewareLogger } from './middlewares/logger.middleware';
import authRoutes from './routes/auth.route';
import logger from './logger';
import { errorHandler } from './middlewares/error_handler';

connectDB();

const app = express();
const SERVER_PORT = SERVER.PORT;
const SERVER_URL = SERVER.URL;

// Middleware
app.use(cors());
app.use(morgan(":method :url :status :response-time ms"));
app.use(express.json());
app.use(express.static('public'));
// app.use(formatResponse);



// Middleware logger
app.use(middlewareLogger);


// API Routes
const API_PREFIX = API.PREFIX;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
  skip: (req) => {
    const skipRoutes = [`${API_PREFIX}/health`];
    return skipRoutes.some(route => req.path.startsWith(route));
  }
});

// Apply rate limiting to all routes
app.use('/api', limiter);

// Routes
app.use(`${API_PREFIX}/auth`, authRoutes);


// Check Health Status
app.use(`${API_PREFIX}/health`, (_req: Request, res: Response) => {
  res.json({ message: `${API.NAME} is running!` });
});

// Error Handler
app.use(errorHandler);

app.listen(SERVER_PORT, () => {
  logger.info(`Server running on ${SERVER_URL}`);
});