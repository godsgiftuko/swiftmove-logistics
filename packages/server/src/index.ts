import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit';
import connectDB from './database';
import { API, SECURITY } from '../../shared/constants';
import morgan from "morgan";
import { middlewareLogger } from './middlewares/logger.middleware';
import authRoutes from './routes/auth.route';
import deliveryRoutes from './routes/deliveries.route';
import driverRoutes from './routes/driver.route';
import userRoutes from './routes/user.route';
import { errorHandler } from './middlewares/error_handler';
import { authenticateUser } from './middlewares/auth.middleware';

connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(morgan(":method :url :status :response-time ms"));
app.use(express.json());
app.use(express.static('public'));
// app.use(formatResponse);



// Middleware logger
app.use(middlewareLogger);

// // Middleware to authenticate user
// app.use(authenticateUser);

// API Routes
const API_PREFIX = API.PREFIX;

// Rate limiting
const limiter = rateLimit({
  windowMs: SECURITY.RATE_LIMIT_WINDOW_MS,
  max: SECURITY.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: `Too many requests from this IP, please try again after ${SECURITY.RATE_LIMIT_WINDOW_MS} minutes`,
  skip: (req) => {
    const skipRoutes = [`${API_PREFIX}/health`];
    return skipRoutes.some(route => req.path.startsWith(route));
  }
});

// Apply rate limiting to all routes
app.use('/api', limiter);

// Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/deliveries`, deliveryRoutes);
app.use(`${API_PREFIX}/drivers`, driverRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);


// Check Health Status
app.use(`${API_PREFIX}/health`, (_req: Request, res: Response) => {
  res.json({ message: `${API.NAME} is running!` });
});

// Error Handler
app.use(errorHandler);

export default app; 