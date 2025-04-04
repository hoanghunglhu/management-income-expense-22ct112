const express = require('express');
const router = express.Router();
const { deleteIncome } = require('../controllers/incomeController');

router.route('/:id')
    .delete(deleteIncome); // Xóa income theo ID

module.exports = router;