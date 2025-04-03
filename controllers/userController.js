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

module.exports = { insertUser };
