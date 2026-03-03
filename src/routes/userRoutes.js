const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUsersOrders,
  getTopSpenders,
} = require("../controllers/userController");

router.get("/", getUsers);
router.get("/top-spenders", getTopSpenders);
router.get("/:id/orders", getUsersOrders);

module.exports = router;
