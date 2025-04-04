const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const incomeRoutes = require('./routes/incomeRoutes'); // Thêm route cho income
const errorHandler = require('./middleware/errorHandler');
const expenseRoutes = require('./routes/expenseRoutes');

// Load biến môi trường từ .env
dotenv.config();

const app = express();

// Kết nối MongoDB
connectDB();

// Middleware để parse JSON
app.use(express.json());

// Routes
app.use('/api/incomes', incomeRoutes); // Thêm route cho incomes
app.use('/api/expenses', expenseRoutes);

// Middleware xử lý lỗi
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});