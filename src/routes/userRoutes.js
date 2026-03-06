const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authMiddleware");

const userController = require("../controllers/userController");

router.get("/", userController.getUsers);

module.exports = router;
