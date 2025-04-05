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
    console.log('Bắt đầu test API GET /api/incomes...');


    // Test 4: Lọc gần đúng với name="Tiền" (partial match)
    console.log('Test 4: Lọc gần đúng với name="Tiền" (partial match)...');
    await testGetIncomes('?name=Tiền');

    // Test 5: Lọc chính xác với name="Tiền lãi đầu tư" (exact match)
    console.log('Test 5: Lọc chính xác với name="Tiền lãi đầu tư" (exact match)...');
    await testGetIncomes('?name=Tiền lãi đầu tư&exact=true');

    // Test 6: Lọc chính xác với name="tiền lãi đầu tư" (exact match, không phân biệt hoa thường)
    console.log('Test 6: Lọc chính xác với name="tiền lãi đầu tư" (exact match, không phân biệt hoa thường)...');
    await testGetIncomes('?name=tiền lãi đầu tư&exact=true');


    console.log('Kết thúc test.');
};

// Chạy test
runTests();