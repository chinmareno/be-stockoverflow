import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string | JwtPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.cookies.jwt;
  if (!userId) {
    res.json({ error: "session expired" });
  }

  const decodedToken = jwt.verify(userId, process.env.SECRET_KEY as Secret);

  req.userId = decodedToken;
  console.log(decodedToken);
  next();
};
