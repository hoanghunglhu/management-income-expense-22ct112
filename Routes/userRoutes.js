// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { checkUserByEmailAndPassword } = require('../controllers/userController');

// Route để kiểm tra user bằng email và password
router.post('/login', checkUserByEmailAndPassword);

module.exports = router;