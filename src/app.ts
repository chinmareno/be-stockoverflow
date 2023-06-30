import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router } from "./routers/index.js";
import { Server } from "http";
import { config } from "dotenv";

config();

const app: Application = express();

const PORT: number = Number(process.env.PORT) || 2000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/cek", (req: Request, res: Response): void => {
  res.send("iyaa awokoawk");
});

app.use("/", router);
// app.use("/", itemsRouter);

const server: Server = app.listen(PORT, () => {
  console.log(`Server is berlari on port ${PORT}`);
});
