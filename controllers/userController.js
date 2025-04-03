const User = require("../models/userModel");

// Hàm thêm user mới
async function insertUser(name, email, password) {
  const user = new User({ name, email, password });

  try {
    const result = await user.save();
    console.log("User inserted:", result);
  } catch (error) {
    console.error("Error inserting user:", error);
  }
}
// Cập nhật user theo ID
exports.updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Xóa user theo ID
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { insertUser };
