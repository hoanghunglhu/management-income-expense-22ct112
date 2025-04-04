const axios = require('axios');

// URL của API (cần thêm :id vào endpoint)
const API_URL = 'http://localhost:3000/api/expenses';

// Hàm test PUT để cập nhật expense
async function testUpdateExpense() {
    try {
        console.log('Bắt đầu test PUT /api/expenses/:id...');

        // ID của expense cần cập nhật (thay bằng ID thực tế trong DB của bạn)
        const expenseId = '67ed3ce4d76884e45ce81e8d'; // Thay bằng ID hợp lệ

        // Dữ liệu cập nhật
        const updateData = {
            amount: 700,              // Số tiền mới
            description: 'Mua sách mới' // Mô tả mới
        };

        // Config cho request
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000 // Timeout 5 giây
        };

        // Gửi request PUT
        const response = await axios.put(`${API_URL}/${expenseId}`, updateData, config);

        // Log kết quả
        console.log('Kết quả từ API:');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
        console.log('Test thành công!');

    } catch (error) {
        console.error('Lỗi khi test PUT /api/expenses/:id:');
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
testUpdateExpense();