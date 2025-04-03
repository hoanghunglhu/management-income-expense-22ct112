require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/database");

const app = express(); // Đặt dòng này ngay sau khi import express
const PORT = process.env.PORT || 5000;

// Kết nối MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Hello, NodeJS Backend!");
});

// Lắng nghe server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Click here to open: http://localhost:${PORT}`);
});
