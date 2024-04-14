import { User } from "../entity/User";
import jwt, { GetPublicKeyOrSecret } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Secret } from "jsonwebtoken";
import { ParamsDictionary } from "express-serve-static-core";

export const isUserAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = await User.findOneBy({ email: req.user.email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user && user.role === "Admin") {
    next();
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
};

export interface CustomRequest extends Request<ParamsDictionary> {
  user: User;
}

export const checkUserIsAuthenticated = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  const JWT_SECRET: Secret | GetPublicKeyOrSecret = process.env.JWT_SECRET || "";

  jwt.verify(token, JWT_SECRET, (err: any, user: User) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
