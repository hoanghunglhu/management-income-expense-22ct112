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

module.exports = { deleteIncome };