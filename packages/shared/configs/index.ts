import { config } from 'dotenv';

// Load .env from the root
config({ path: `${__dirname}/../../../.env` });

class SERVER {
  static SERVER_PORT = process.env.SERVER_PORT || 9000;
  static SERVER_URL =
    process.env.SERVER_URL || `http://localhost:${SERVER.SERVER_PORT}`;
  static MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/swiftmove_logistics";
};


class CLIENT {
  static CLIENT_URL = process.env.CLIENT_URL || '';
}

export default class Configs {
  static CLIENT = CLIENT;
  static SERVER = SERVER;
}
