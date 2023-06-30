import { NextFunction, Response } from "express";
import { AuthRequest } from "./authMiddleware";
interface ErrorMiddleware extends Error {
  statuscode: number;
}
const errorHandler = (
  e: ErrorMiddleware,
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let error;
  let statuscode;
  switch (e.name) {
    case "Unauthorized Error":
      error = e.message;
      statuscode = e.statuscode;
      break;
    case "Unique Error":
      error = e.message;
      statuscode = e.statuscode;
      break;
    case "BadRequest Error":
      error = e.message;
      statuscode = e.statuscode;
      break;
    case "Server Error":
      error = e.message;
      statuscode = e.statuscode;
      break;
    default:
      error = "Error occurs:" + e;
      statuscode = 500;
      break;
  }
  console.log(error, statuscode);
  res.status(statuscode).send(error);
};

export { errorHandler };
