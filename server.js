const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: './save.env' });
const { insertUser } = require('./controllers/userController');

const app = express();

// Middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Expense Tracker Backend is running');
});

// Kết nối MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 20000, // Tăng timeout lên 20 giây
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Chèn user sau khi kết nối thành công
    insertUser('NguyenKhanhTam1', 'nguyentam050404@gmail.com', '9999');
  })
  .catch(err => console.error('Could not connect to MongoDB', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));