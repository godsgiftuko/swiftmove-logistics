export class Configs {
    static SERVER_PORT = process.env.SERVER_PORT || 9000;
    static SERVER_URL = process.env.SERVER_URL || `http://localhost:${Configs.SERVER_PORT}`;
}
