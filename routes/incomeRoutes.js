const express = require('express');
const router = express.Router();
const { deleteIncome, getIncomes } = require('../controllers/incomeController');

router.route('/:id')
    .delete(deleteIncome); // Xóa income theo ID

router.route('/')
    .get(getIncomes); // Lấy danh sách income

module.exports = router;