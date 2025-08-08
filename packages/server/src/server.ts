import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import app from ".";
import * as dotenv from "dotenv";
import logger from "./logger";
import { NODE_ENV, SERVER } from "@/constants";
import Generator from "@/utils/generator";
import { UserService } from "./services/user.service";

dotenv.config();

const PORT = SERVER.PORT;

const startServer = async () => {
  try {
    logger.info("Starting server...");
    logger.info(`Environment: ${NODE_ENV}`);
    logger.info(`Target port: ${PORT}`);

    // Create HTTP server wrapping your Express app
    const httpServer = http.createServer(app);

    // Initialize Socket.IO server with CORS if needed
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      pingInterval: 15000,
      pingTimeout: 30000,
    });

    // Start listening with the HTTP server
    httpServer.listen(PORT, "0.0.0.0", () => {
      logger.info(`✅ Server successfully started!`);
      logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
      logger.info(`API available at ${SERVER.URL}`);
      logger.info(`Health check available at ${SERVER.URL}/health`);
    });

    // Handle server startup errors
    httpServer.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        logger.error(`❌ Port ${PORT} is already in use`);
      } else {
        logger.error(`❌ Server error: ${error.message}`);
      }
      process.exit(1);
    });

    // Middleware to authenticate socket connections
    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (token) {
          const decoded = Generator.decodeToken(token);
          const user = await UserService.findById(decoded.id);
          socket.data.user = user;
        }
        next();
      } catch (error) {
        next(new Error("Authentication error"));
      }
    });

    // Socket.IO event handling
    io.on("connection", (socket: Socket) => {
      console.log(`📱 User connected: ${socket.id}`);

      // Join user to their role-based room
      if (socket.data.user) {
        const { role, id } = socket.data.user;
        socket.join(`user_${id}`);
        socket.join(`role_${role}`);
        console.log(` User ${id} joined room: role_${role}`);
      }

      socket.on("leave_delivery", (deliveryId: string) => {
        socket.leave(`delivery_${deliveryId}`);
        console.log(`📦 Socket ${socket.id} left delivery room: ${deliveryId}`);
      });

      socket.on("disconnect", () => {
        logger.info(`📱 User disconnected: ${socket.id}`);
      });
    });

    // Error handling
    process.on("unhandledRejection", (err: Error) => {
      logger.error("UNHANDLED REJECTION! Shutting down...");
      logger.error(err.name, err.message);
      httpServer.close(() => {
        process.exit(1);
      });
    });

    process.on("uncaughtException", (err: Error) => {
      logger.error("UNCAUGHT EXCEPTION! Shutting down...");
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
