const express = require("express");
const router = express.Router();

const { signup, login } = require("./user.service");
const errorHandler = require("../middleware/errorHandler");
const createToken = require("../middleware/createToken");
const { findAll } = require("./user.repository");
const prisma = require("../configs/db.config");

router.delete("/", async (req, res) => {
  await prisma.user.deleteMany();
});

router.get("/", async (req, res) => {
  const user = await findAll();
  res.json(user);
});

router.post("/signup", async (req, res, next) => {
  const userData = req.body;
  try {
    const user = await signup(userData);
    const token = createToken(user._id);
    res.cookie("jwt", token).status(201).send("Account created successfully");
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const userData = req.body;
  try {
    await login(userData);
    res.status(200).send("Login success");
  } catch (err) {
    next(err);
  }
});

router.patch("/change-username", async (req, res, next) => {
  const userData = req.body;
  try {
    await login(userData);
    res.send("Change username success");
  } catch (err) {
    next(err);
  }
});

router.patch("/change-password", async (req, res, next) => {
  const userData = req.body;
  try {
    await login(userData);
    res.send("Change password success");
  } catch (err) {
    next(err);
  }
});

router.use(errorHandler);

module.exports = router;
