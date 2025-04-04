const axios = require('axios');

// URL của API
const API_URL = 'http://localhost:3000/api/expenses/getlist';

// Hàm test GET danh sách expenses
async function testGetExpenses() {
    try {
        console.log('Bắt đầu test GET /api/expenses/getlist...');

        // Config cho request
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                limit: 5,              // Giới hạn số lượng bản ghi
                page: 1,               // Trang số 1
                startDate: '2025-01-01', // Ngày bắt đầu (tùy chọn)
                endDate: '2025-12-31'   // Ngày kết thúc (tùy chọn)
            },
            timeout: 5000 // Timeout 5 giây
        };

        // Gửi request GET
        const response = await axios.get(API_URL, config);

        // Log kết quả
        console.log('Kết quả từ API:');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
        console.log('Test thành công!');

    } catch (error) {
        console.error('Lỗi khi test GET /api/expenses/getlist:');
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
testGetExpenses();