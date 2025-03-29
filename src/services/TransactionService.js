// src/services/TransactionService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lấy tất cả giao dịch
const getTransactions = async () => {
  try {
    const storedTransactions = await AsyncStorage.getItem('transactions');
    return storedTransactions ? JSON.parse(storedTransactions) : [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

// Thêm một giao dịch mới
const addTransaction = async (transaction) => {
  try {
    const transactions = await getTransactions();
    transactions.push(transaction);
    await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (error) {
    console.error('Error adding transaction:', error);
  }
};

// Xóa một giao dịch (tùy chọn, nếu cần)
const deleteTransaction = async (index) => {
  try {
    const transactions = await getTransactions();
    transactions.splice(index, 1);
    await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (error) {
    console.error('Error deleting transaction:', error);
  }
};

export { getTransactions, addTransaction, deleteTransaction };