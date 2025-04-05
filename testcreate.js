const axios = require('axios');

// URL của API
const API_URL = 'http://localhost:3000/api/expenses';

// Hàm test POST để tạo expense mới
async function testCreateExpense() {
    try {
        console.log('Bắt đầu test POST /api/expenses...');

        // Dữ liệu mẫu để tạo expense
        const expenseData = {
            userId: '67e3ced4d76884645ce81ebc', // Thay bằng userId hợp lệ trong DB của bạn
            amount: 500,
            description: 'Mua sách',
            date: '2025-04-05T10:00:00.000Z' // Optional, nếu không gửi sẽ dùng Date.now()
        };

        // Config cho request
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000 // Timeout 5 giây
        };

        // Gửi request POST
        const response = await axios.post(API_URL, expenseData, config);

        // Log kết quả
        console.log('Kết quả từ API:');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
        console.log('Test thành công!');

    } catch (error) {
        console.error('Lỗi khi test POST /api/expenses:');
        if (error.response) {
            // Lỗi từ server (có response)
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            // Không nhận được response từ server
            console.error('Không nhận được phản hồi từ server. Server có đang chạy không?');
            console.error('Request config:', error.config);
        } else {
            // Lỗi khác
            console.error('Lỗi:', error.message);
        }
    } finally {
        console.log('Kết thúc test.');
    }
}

// Chạy test
testCreateExpense();