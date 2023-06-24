const cookieParser = require("cookie-parser");
const { userRouter, itemsRouter } = require("./src/routers");
const express = require("express");
const app = express();
const cors = require("cors");
const authMiddleware = require("./src/middleware/authMiddleware");

const PORT = 2000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/redirect", (req, res) => {
  // Redirect the client to the desired URL
  res.redirect("http://localhost:5173/");
});

app.get("/cek", (req, res) => {
  res.send("iyaa awokoawk");
});

app.use("/", userRouter);
// app.use("/", itemsRouter);

app.listen(PORT, () => {
  console.log(`Server is berlari on port ${PORT}`);
});
