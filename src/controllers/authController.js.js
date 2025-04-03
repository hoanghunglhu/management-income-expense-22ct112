const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Kiểm tra email đã tồn tại chưa
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "Email đã tồn tại" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo user mới
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ msg: "đăng ký User thành công" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};
