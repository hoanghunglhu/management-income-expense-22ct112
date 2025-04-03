const express = require("express");
const userRoutes = require("./userRoutes");
const expenseRoutes = require("./expenseRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/expenses", expenseRoutes);

module.exports = router;
