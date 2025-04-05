const mongoose = require('mongoose');
const Expense = require('../models/Expense');

// Tạo expense mới
exports.createExpense = async (req, res, next) => {
    try {
        const { userId, amount, description, date } = req.body;

        console.log('Received create request:', { body: req.body });

        if (!userId || !amount || !description) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, amount, and description are required',
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid userId',
            });
        }

        const newExpense = new Expense({
            userId,
            amount,
            description,
            date: date || Date.now(),
        });

        const savedExpense = await newExpense.save();

        res.status(201).json({
            success: true,
            data: savedExpense,
        });
    } catch (error) {
        console.error('Error in createExpense:', error);
        next(error);
    }
};

// Lấy danh sách expenses (không cần auth)
exports.getExpenses = async (req, res) => {
    try {
        const { limit = 10, page = 1, startDate, endDate } = req.query;
        const skip = (page - 1) * limit;

        // Tạo query object (không lọc theo userId)
        let query = {};
        
        // Thêm điều kiện lọc theo ngày nếu có
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Lấy danh sách expenses
        const expenses = await Expense.find(query)
            .sort({ date: -1 }) // Sắp xếp theo ngày giảm dần
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Đếm tổng số documents
        const total = await Expense.countDocuments(query);

        res.status(200).json({
            success: true,
            data: expenses,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách expense',
            error: error.message
        });
    }
};

// Cập nhật expense theo ID
exports.updateExpense = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amount, description } = req.body;

        console.log('Received update request:', { id, body: req.body });

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid expense ID',
            });
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            id,
            { amount, description },
            { new: true, runValidators: true }
        );

        if (!updatedExpense) {
            return res.status(400).json({
                success: false,
                message: 'Expense not found',
            });
        }

        res.status(200).json({
            success: true,
            data: updatedExpense,
        });
    } catch (error) {
        console.error('Error in updateExpense:', error);
        next(error);
    }
};
exports.getExpensesByName = async (req, res, next) => {
    try {
        const { name } = req.query;

        // Debug: Log query nhận được
        console.log('Received get expenses request:', { query: req.query });

        // Tạo điều kiện tìm kiếm
        let query = {};
        if (name) {
            // Tìm kiếm không phân biệt hoa thường, sử dụng regex
            query.description = { $regex: name, $options: 'i' };
        }

        // Lấy danh sách expenses
        const expenses = await Expense.find(query);

        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses,
        });
    } catch (error) {
        console.error('Error in getExpensesByName:', error);
        next(error);
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const { limit = 10, page = 1, startDate, endDate, name } = req.query;
        const skip = (page - 1) * limit;

        // Tạo query object (không lọc theo userId)
        let query = {};

        // Thêm điều kiện lọc theo ngày nếu có
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Thêm điều kiện lọc theo description (name) nếu có
        if (name) {
            query.description = { $regex: name, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
        }

        // Lấy danh sách expenses
        const expenses = await Expense.find(query)
            .sort({ date: -1 }) // Sắp xếp theo ngày giảm dần
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Đếm tổng số documents
        const total = await Expense.countDocuments(query);

        res.status(200).json({
            success: true,
            data: expenses,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách expense',
            error: error.message,
        });
    }
};