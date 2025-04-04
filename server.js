// server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: './save.env' });
const { insertUser } = require('./controllers/userController');

const app = express();

// Middleware
app.use(express.json());

const userRoutes = require('./Routes/userRoutes');
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Expense Tracker Backend is running');
});

// Kết nối MongoDB
const mongoURI = process.env.MONGO_URI;
console.log('MongoURI:', mongoURI);
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 20000,
})
  .then(() => {
    console.log('Connected to MongoDB successfully');
    // Chèn user sau khi kết nối thành công
    insertUser('NguyenKhanhTam1', 'nguyentam050404@gmail.com', '9999');
  })
  .catch(err => console.error('Could not connect to MongoDB:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));