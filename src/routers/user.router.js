const express = require("express");
const router = express.Router();
const userController = require("../user/user.controller");

router.use("/user", userController);

module.exports = router;
