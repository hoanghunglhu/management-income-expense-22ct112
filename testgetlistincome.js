const axios = require('axios');

// URL của API
const API_URL = 'http://localhost:3000/api/incomes'; // Cổng 5000 theo server.js

// Hàm test lấy danh sách incomes
const testGetIncomes = async (queryParams = '') => {
    try {
        const response = await axios.get(`${API_URL}${queryParams}`);
        console.log('Lấy danh sách incomes thành công:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Lỗi khi lấy danh sách incomes:', error.response.data);
        } else {
            console.error('Lỗi kết nối:', error.message);
        }
    }
};

// Hàm chạy test
const runTests = async () => {
    await testGetIncomes();
    console.log('Kết thúc test.');
};

// Chạy test
runTests();