const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const { authenticateJWT } = require("../middlewares/authenticate");
const handleFileUpload = require("../middlewares/fileUploader");
router.get("/getall", authenticateJWT, usersController.getAll);
router.post(
  "/add",
  [authenticateJWT, handleFileUpload],
  usersController.addUser
);
router.post(
  "/edit",
  [authenticateJWT, handleFileUpload],
  usersController.editUser
);
router.post("/changepassword", usersController.changePassword);
router.delete("/delete/:id", authenticateJWT, usersController.deleteUser);

module.exports = router;
