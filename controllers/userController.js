// userController.js
const User = require('../models/userModel');

// Hàm thêm user mới
async function insertUser(name, email, password) {
  const user = new User({ name, email, password });

  try {
    const result = await user.save();
    console.log('User inserted:', result);
  } 
  catch (error) {
    console.error('Error inserting user:', error);
  }
}

// Hàm kiểm tra user bằng email và password
async function checkUserByEmailAndPassword(req, res) {
  try {
    // Kiểm tra xem req.body có tồn tại không
    if (!req.body) {
      return res.status(400).json({ message: 'Body request không được để trống' });
    }

    const { email, password } = req.body;

    // Kiểm tra xem email và password có được cung cấp hay không
    if (!email || !password) {
      return res.status(400).json({ message: 'Email và password là bắt buộc' });
    }

    // Tìm user bằng email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy user với email này' });
    }

    // So sánh password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password không đúng' });
    }

    // Nếu thành công, trả về thông tin user (không bao gồm password)
    res.status(200).json({
      message: 'Đăng nhập thành công',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Error checking user:', error.stack);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

module.exports = { insertUser, checkUserByEmailAndPassword };