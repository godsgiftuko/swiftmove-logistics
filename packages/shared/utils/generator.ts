import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import ServerConfigs from "packages/server/src/configs";
import { EUserRole } from "packages/server/src/models/user.model";

type DecodedToken = {
  id: mongoose.Types.ObjectId;
  role: EUserRole;
  iat: number;
  exp: number;
};

export default class Generator {
  // Generate JWT token
  static generateToken = (userId: mongoose.Types.ObjectId, role: string) => {
    return jwt.sign({ id: userId, role }, ServerConfigs.JWT.SECRET!, { expiresIn: "24h" });
  };

  // Decode JWT token
  static decodeToken = (token: string): DecodedToken => {
    return jwt.decode(token) as DecodedToken;
  };
}
