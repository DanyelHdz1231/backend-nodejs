const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const taskController = require("../controllers/taskController");

router.get("/", authenticate, taskController.getTasks);
router.post("/", authenticate, taskController.createTask);
router.delete("/:id", authenticate, taskController.deleteTask);
router.patch("/:id/toggle", authenticate, taskController.toggleTask);

module.exports = router;
