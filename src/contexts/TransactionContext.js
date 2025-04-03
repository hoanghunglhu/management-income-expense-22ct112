// src/contexts/TransactionContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tạo Context
const TransactionContext = createContext();

// Key để lưu vào AsyncStorage
const TRANSACTIONS_STORAGE_KEY = '@transactions_list';

// Tạo Provider Component
export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State theo dõi việc load dữ liệu

  // --- Load transactions từ AsyncStorage khi Provider mount ---
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const storedTransactions = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
        if (storedTransactions !== null) {
          // Parse dữ liệu đã lưu và đảm bảo amount là number, date là Date object
          const parsedTransactions = JSON.parse(storedTransactions).map(t => ({
            ...t,
            amount: Number(t.amount), // Đảm bảo amount là số
            date: new Date(t.date) // Chuyển đổi lại thành Date object
          }));
          setTransactions(parsedTransactions);
        } else {
          // Nếu chưa có gì, có thể khởi tạo với dữ liệu mẫu hoặc []
           setTransactions([]); // Khởi tạo mảng rỗng
           // Hoặc dùng dữ liệu mẫu ban đầu của bạn nếu muốn
           // setTransactions(initialMockTransactions); // (Cần định nghĩa initialMockTransactions)
        }
      } catch (e) {
        console.error("Failed to load transactions from storage", e);
        setTransactions([]); // Đặt lại thành rỗng nếu lỗi
      } finally {
        setIsLoading(false); // Hoàn tất việc load
      }
    };

    loadTransactions();
  }, []); // Chỉ chạy 1 lần khi mount

  // --- Lưu transactions vào AsyncStorage mỗi khi state thay đổi ---
  useEffect(() => {
    const saveTransactions = async () => {
      // Chỉ lưu khi đã load xong và có transactions
      if (!isLoading && transactions) {
          try {
            // Chuyển đổi date thành ISO string trước khi lưu
            const transactionsToSave = transactions.map(t => ({
                ...t,
                date: t.date.toISOString() // Lưu date dạng string
            }));
            const jsonValue = JSON.stringify(transactionsToSave);
            await AsyncStorage.setItem(TRANSACTIONS_STORAGE_KEY, jsonValue);
            console.log("Transactions saved to storage.");
          } catch (e) {
            console.error("Failed to save transactions to storage", e);
          }
      }
    };

    saveTransactions();
  }, [transactions, isLoading]); // Chạy mỗi khi transactions hoặc isLoading thay đổi

  // --- Hàm thêm giao dịch ---
  const addTransaction = (newTransaction) => {
    // Đảm bảo date là Date object khi thêm vào state
     const transactionToAdd = {
       ...newTransaction,
       date: new Date(newTransaction.date), // Đảm bảo là Date object
       amount: Number(newTransaction.amount) // Đảm bảo là number
     };

     // Sắp xếp lại theo ngày giảm dần khi thêm mới
     setTransactions((prevTransactions) =>
        [transactionToAdd, ...prevTransactions].sort((a, b) => b.date - a.date)
     );
  };

  // --- Hàm xóa giao dịch (Ví dụ) ---
  const deleteTransaction = (id) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.id !== id)
    );
  };


  // Cung cấp state và các hàm thông qua value của Provider
  const value = {
    transactions,
    addTransaction,
    deleteTransaction, // Thêm hàm xóa nếu cần
    isLoading,         // Cung cấp trạng thái loading
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

// Tạo custom hook để dễ dàng sử dụng context
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};