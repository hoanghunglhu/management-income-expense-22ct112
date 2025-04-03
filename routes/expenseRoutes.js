const express = require("express");
const { updateExpenseById } = require("../controllers/expenseController");
const router = express.Router();

router.put("/:id", updateExpenseById);
router.delete("/:id", deleteExpenseById);

module.exports = router;
