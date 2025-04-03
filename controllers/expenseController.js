const Expense = require("../models/expenseMode");

// Cập nhật chi phí theo ID
exports.updateExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  exports.deleteExpenseById = async (req, res) => {
    try {
      const expense = await Expense.findByIdAndDelete(req.params.id);
      if (!expense)
        return res.status(404).json({ message: "Expense not found" });
      res.json({ message: "Expense deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};
