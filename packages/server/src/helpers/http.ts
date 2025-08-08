import { Request } from "express";

export const extractBearerToken = (req: Request) => {
    if (!req.headers['authorization']) return null;
    if (req.headers['authorization'].split(' ').length === 1) return null;
    return req.headers['authorization'].split(' ')[1];
}