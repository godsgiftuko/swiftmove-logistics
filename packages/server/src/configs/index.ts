import { API } from "../../../shared/constants";
import { config } from "dotenv";

config({ path: `${__dirname}/../../../../.env` });

const SERVER_PORT = parseInt(process.env.SERVER_PORT || "9000");

export default class ServerConfigs {
    static DATABASE = {
      DATABASE: 'mongodb',
      CONNECTION_URL:
        process.env.MONGODB_URI || "mongodb://localhost:27017/swiftmove_logistics",
    };

    static SERVER = {
      PORT: SERVER_PORT,
      URL: process.env.SERVER_URL || `http://localhost:${SERVER_PORT}${API.PREFIX}`,
    };

    static JWT = {
      ACCESS_TOKEN_EXPIRE: process.env.JWT_EXPIRE || "24h",
      REFRESH_TOKEN_EXPIRE: "7d",
      RESET_TOKEN_EXPIRE: "1h",
      SECRET: process.env.JWT_SECRET || "RelevancetechBKFhYts",
    };

    static NODE_ENV = process.env.NODE_ENV || 'development';
  }