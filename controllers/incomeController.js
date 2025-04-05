const Income = require('../models/Income');

// Xóa income theo ID
const deleteIncome = async (req, res) => {
    const { id } = req.params;

    try {
        const income = await Income.findByIdAndDelete(id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        res.json({ message: 'Income deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy danh sách incomes (hỗ trợ lọc gần đúng và chính xác theo name)
const getIncomes = async (req, res) => {
    try {
        const { limit = 10, page = 1, startDate, endDate, name, exact } = req.query;
        const skip = (page - 1) * limit;

        // Tạo query object
        let query = {};

        // Thêm điều kiện lọc theo ngày nếu có
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Thêm điều kiện lọc theo name (description) nếu có
        if (name) {
            if (exact === 'true') {
                // Tìm kiếm chính xác, không phân biệt hoa thường
                query.description = { $regex: `^${name}$`, $options: 'i' };
            } else {
                // Tìm kiếm gần đúng, không phân biệt hoa thường
                query.description = { $regex: name, $options: 'i' };
            }
        }

        // Lấy danh sách incomes
        const incomes = await Income.find(query)
            .sort({ date: -1 }) // Sắp xếp theo ngày giảm dần
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Đếm tổng số documents
        const total = await Income.countDocuments(query);

        res.status(200).json({
            success: true,
            data: incomes,
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
            message: 'Lỗi khi lấy danh sách income',
            error: error.message,
        });
    }
};

module.exports = { deleteIncome, getIncomes };