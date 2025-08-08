import express from 'express'
import cors from 'cors'
import connectDB from './database';
import { SERVER } from '@/constants';

connectDB();

const app = express();
const SERVER_PORT = SERVER.PORT;
const SERVER_URL = SERVER.URL;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

app.listen(SERVER_PORT, () => {
  console.log(`Server running on ${SERVER_URL}`);
});