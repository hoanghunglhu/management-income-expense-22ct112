const express = require('express');
const router = express.Router();
const { createExpense, updateExpense, getExpenses, getExpensesByName } = require('../controllers/expenseController');

router.route('/')
    .post(createExpense) // Tạo expense mới
    .get(getExpensesByName);

router.put('/:id', updateExpense);
// Lấy danh sách expenses
router.get('/getlist', getExpenses);

module.exports = router;