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
  try {
    const userId = req.cookies[process.env.COOKIE_NAME as string];
    if (!userId) {
      res.status(401).send("session expired");
    }

    const decodedToken = jwt.verify(
      userId,
      process.env.SECRET_KEY as Secret
    ) as {
      id: string;
    };
    req.userId = decodedToken.id;
    next();
  } catch (error) {
    return res.status(401).send("session expired");
  }
};
