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
  const userId = req.cookies[process.env.COOKIE_NAME as string];
  if (!userId) {
    res.json({ error: "session expired" });
  }

  const decodedToken = jwt.verify(userId, process.env.SECRET_KEY as Secret) as {
    id: string;
  };
  console.log(decodedToken);
  req.userId = decodedToken.id;
  next();
};
