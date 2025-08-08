import { JWT } from "@/constants";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { EUserRole } from "packages/server/src/models/user.model";

type DecodedToken = {
  id: string;
  role: EUserRole;
  iat: number;
  exp: number;
};

export default class Generator {
  // Generate JWT token
  static generateToken = (userId: mongoose.Types.ObjectId, role: string) => {
    return jwt.sign({ id: userId, role }, JWT.SECRET!, { expiresIn: "24h" });
  };

  // Decode JWT token
  static decodeToken = (token: string): DecodedToken => {
    return jwt.decode(token) as DecodedToken;
  };
}
