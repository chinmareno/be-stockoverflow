const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  changeTheme,
  getUserProfile,
} = require("./auth.service");
const errorHandler = require("../middleware/errorHandler");
const createToken = require("../middleware/createToken");
const { findAll } = require("./auth.repository");
const prisma = require("../configs/db.config");
const authMiddleware = require("../middleware/authMiddleware");

router.delete("/", async (req, res) => {
  await prisma.user.deleteMany();
});

router.get("/", async (req, res) => {
  const user = await findAll();
  res.json(user);
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const userProfile = await getUserProfile(userId);
    console.log("userProfile");
    res.send(userProfile);
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await signup(userData);
    const token = createToken(user.id);
    res.cookie("jwt", token).status(201).send("Account created successfully");
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const userData = req.body;
    const user = await login(userData);
    const token = createToken(user.id);
    res.cookie("jwt", token).status(201).send("Login Success");
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.status(200).clearCookie("jwt").send("bye jwt");
});

router.patch("/change-theme", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.userId;
    const { theme } = req.body;
    console.log(theme);
    await changeTheme(userId, theme);
    res.status(200).send("theme changed");
  } catch (err) {
    next(err);
  }
});

router.patch("/change-username", async (req, res, next) => {
  try {
    const userData = req.body;
    await login(userData);
    if (user) {
      res.send("Change username success");
    }
  } catch (err) {
    next(err);
  }
});

router.patch("/change-password", async (req, res, next) => {
  try {
    const userData = req.body;
    await login(userData);
    res.send("Change password success");
  } catch (err) {
    next(err);
  }
});

router.use(errorHandler);

module.exports = router;
