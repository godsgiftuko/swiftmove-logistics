import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import app from '.';
import * as dotenv from 'dotenv';
import logger from './logger';
import { NODE_ENV, SERVER } from '@/constants';

dotenv.config();

const PORT = SERVER.PORT;

const startServer = async () => {
  try {
    logger.info('Starting server...');
    logger.info(`Environment: ${NODE_ENV}`);
    logger.info(`Target port: ${PORT}`);



    // Create HTTP server wrapping your Express app
    const httpServer = http.createServer(app);

    // Initialize Socket.IO server with CORS if needed
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
      pingInterval: 15000,
      pingTimeout: 30000,
    });

    // Start listening with the HTTP server
    httpServer.listen(PORT, '0.0.0.0', () => {
      logger.info(`✅ Server successfully started!`);
      logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
      logger.info(`API available at ${SERVER.URL}`);
      logger.info(`Health check available at ${SERVER.URL}/health`);
    });

    // Handle server startup errors
    httpServer.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${PORT} is already in use`);
      } else {
        logger.error(`❌ Server error: ${error.message}`);
      }
      process.exit(1);
    });

    // Socket.IO event handling
    io.on('connection', (socket: Socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });

    // Error handling
    process.on('unhandledRejection', (err: Error) => {
      logger.error('UNHANDLED REJECTION! Shutting down...');
      logger.error(err.name, err.message);
      httpServer.close(() => {
        process.exit(1);
      });
    });

    process.on('uncaughtException', (err: Error) => {
      logger.error('UNCAUGHT EXCEPTION! Shutting down...');
      logger.error(err.name, err.message);
      process.exit(1);
    });

    return httpServer;
  } catch (error) {
    logger.error(`Server startup failed: ${(error as Error).message}`);
    process.exit(1);
  }
};

const server = startServer();

export default server;
