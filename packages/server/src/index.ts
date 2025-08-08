import express from 'express'
import cors from 'cors'
import connectDB from './database';
import Configs from '@/configs';

connectDB();

const app = express();
const SERVER_PORT = Configs.SERVER.SERVER_PORT;
const SERVER_URL = Configs.SERVER.SERVER_URL;

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