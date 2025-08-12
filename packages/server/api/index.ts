import 'module-alias/register';
import serverless from "serverless-http";
import app from "../src";

export const handler = serverless(app);
// import express from 'express';
// import serverless from 'serverless-http';

// const app = express();

// // Middleware
// app.use(express.json());

// // Routes
// app.get('/', (req, res) => {
//   res.send('Hello from Express on Vercel!');
// });

// app.get('/api/hello', (req, res) => {
//   res.json({ message: 'Hello API!' });
// });

// // Export as serverless function
// export default app;
// export const handler = serverless(app);
