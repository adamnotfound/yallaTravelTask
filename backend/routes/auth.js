const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

router.post("/signin", authController.handleLogin);

module.exports = router;
