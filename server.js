const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./save.env" }); // Sử dụng đúng tên file .env
const {
  User,
  Expense,
  insertUser,
  updateUserById,
  deleteUserById,
  updateExpenseById,
} = require("./controllers/userController");

const app = express();

// Middleware
app.use(express.json());

// Route kiểm tra API đang chạy
app.get("/", (req, res) => {
  res.send("Expense Tracker Backend is running");
});

// Route tạo user mới (dùng hàm insertUser từ controller)
app.post("/users", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await insertUser(username, email, password);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route cập nhật user theo ID
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await updateUserById(req.params.id, req.body);
    if (!updatedUser.success) {
      return res.status(404).json({ message: updatedUser.error });
    }
    res.json(updatedUser.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route xóa user theo ID
app.delete("/users/:id", async (req, res) => {
  try {
    const result = await deleteUserById(req.params.id);
    if (!result.success) {
      return res.status(404).json({ message: result.error });
    }
    res.json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route cập nhật expense theo ID
app.put("/expenses/:id", async (req, res) => {
  try {
    const updatedExpense = await updateExpenseById(req.params.id, req.body);
    if (!updatedExpense.success) {
      return res.status(404).json({ message: updatedExpense.error });
    }
    res.json(updatedExpense.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kết nối MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000, // Tăng timeout lên 20 giây
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // Khởi tạo dữ liệu mẫu nếu cần thiết
    // Chèn user mẫu khi kết nối thành công (có thể bỏ qua nếu không cần)
    insertUser("Dangdeptrai", "duongdinhdang10@gmail.com", "9999");
  })
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
