const mongoose = require('mongoose');

// Định nghĩa schema cho Expense
const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Tạo model
const Expense = mongoose.model('Expense', expenseSchema);

// Hàm khởi tạo collections và thêm dữ liệu mẫu (nếu cần)
const initDB = async () => {
    try {
        const expenseCount = await Expense.countDocuments();
        if (expenseCount === 0) {
            console.log('Collection Expense chưa tồn tại, đang tạo dữ liệu mẫu...');
            const sampleExpense = new Expense({
                userId: new mongoose.Types.ObjectId(),
                amount: 100,
                description: 'Mua sách',
            });
            await sampleExpense.save();
            console.log('Đã tạo collection Expense và thêm dữ liệu mẫu.');
        }

    
    } catch (error) {
        console.error('Lỗi khi khởi tạo database:', error.message);
    }
};

// Export các model
module.exports = { initDB, Expense };