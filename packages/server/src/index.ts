import express from 'express'
import cors from 'cors'
import connectDB from './database';
import { Configs } from './configs';

connectDB();

const app = express();
const PORT = Configs.SERVER_PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on ${Configs.SERVER_URL}`);
});