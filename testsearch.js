const axios = require('axios');

// URL của API
const API_URL = 'http://localhost:3000/api/expenses';

// Hàm test lọc expenses theo name (description)
const testGetExpensesByName = async (name) => {
    try {
        const response = await axios.get(`${API_URL}?name=${name}`);
        console.log(`Lọc expenses với name="${name}":`, response.data);
    } catch (error) {
        if (error.response) {
            console.error(`Lỗi khi lọc expenses với name="${name}":`, error.response.data);
        } else {
            console.error('Lỗi kết nối:', error.message);
        }
    }
};

// Hàm chạy test
const runTests = async () => {
    console.log('Bắt đầu test API GET /api/expenses?name...');

    // Test 1: Lọc expenses với name="Mua"
    console.log('Test 1: Lọc expenses với name="Mua"...');
    await testGetExpensesByName('mua');



    console.log('Kết thúc test.');
};

// Chạy test
runTests();