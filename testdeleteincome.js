const axios = require('axios');

// URL của API (cần thêm :id vào endpoint)
const API_URL = 'http://localhost:3000/api/incomes';

// Hàm test DELETE để xóa income
async function testDeleteIncome() {
    try {
        console.log('Bắt đầu test DELETE /api/incomes/:id...');

        // ID của income cần xóa (thay bằng ID thực tế trong DB của bạn)
        const incomeId = '67ef906ba4022d477d80cfc9'; // Thay bằng ID hợp lệ

        // Config cho request
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000 // Timeout 5 giây
        };

        // Gửi request DELETE
        const response = await axios.delete(`${API_URL}/${incomeId}`, config);

        // Log kết quả
        console.log('Kết quả từ API:');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
        console.log('Test thành công!');

    } catch (error) {
        console.error('Lỗi khi test DELETE /api/incomes/:id:');
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
testDeleteIncome();