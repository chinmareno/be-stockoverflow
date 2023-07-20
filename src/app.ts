import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { router } from "./routers/index.js";
import { Server } from "http";
import { config } from "dotenv";
import rateLimit from "express-rate-limit";
import bodyparser from "body-parser";
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";

config();

const app: Application = express();

const limiter = rateLimit({
  windowMs: 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const PORT: number = Number(process.env.PORT) || 2000;
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    callback(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({
    storage: fileStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  }).single("image")
);
app.use(limiter);
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(cookieParser());

app.get("/cek", (req: Request, res: Response): void => {
  res.send("iyaa awokoawk");
});

app.use("/", router);

const server: Server = app.listen(PORT, () => {
  console.log(`Server is berlari on port ${PORT}`);
});

export default app;
