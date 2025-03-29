// src/screens/StatisticsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StatisticsScreen = () => {
  const [startDate, setStartDate] = useState('2025-03-20'); // Ngày bắt đầu mặc định
  const [endDate, setEndDate] = useState('2025-03-22'); // Ngày kết thúc mặc định
  const [transactions, setTransactions] = useState([]); // Lịch sử giao dịch
  const [income, setIncome] = useState(0); // Tổng thu
  const [expense, setExpense] = useState(0); // Tổng chi

  // Hàm định dạng số tiền
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Hàm lấy dữ liệu giao dịch từ AsyncStorage
  const fetchTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem('transactions');
      if (storedTransactions) {
        return JSON.parse(storedTransactions);
      }
      return [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  };

  // Hàm tính toán thống kê
  const calculateStatistics = async () => {
    if (!startDate || !endDate) {
      alert('Vui lòng nhập khoảng thời gian!');
      return;
    }

    const allTransactions = await fetchTransactions();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Lọc giao dịch trong khoảng thời gian
    const filteredTransactions = allTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });

    // Tính tổng thu và chi
    let totalIncome = 0;
    let totalExpense = 0;

    filteredTransactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else if (transaction.type === 'expense') {
        totalExpense += transaction.amount;
      }
    });

    setIncome(totalIncome);
    setExpense(totalExpense);
    setTransactions(filteredTransactions);
  };

  // Hàm render mỗi giao dịch trong lịch sử
  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDate}>{item.date}</Text>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.type === 'income' ? '#28a745' : '#dc3545' },
        ]}
      >
        {item.type === 'income' ? '+' : '-'}{formatNumber(item.amount)} VND
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thống Kê Thu Chi</Text>
  
      {/* Nhập khoảng thời gian */}
      <TextInput
        style={styles.input}
        placeholder="Ngày bắt đầu (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Ngày kết thúc (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
      />
      <TouchableOpacity style={styles.calculateButton} onPress={calculateStatistics}>
        <Text style={styles.calculateButtonText}>TÍNH TOÁN</Text>
      </TouchableOpacity>
  
      {/* Hiển thị tổng thu chi */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Tổng Thu: {formatNumber(income)} VND</Text>
        <Text style={styles.summaryText}>Tổng Chi: {formatNumber(expense)} VND</Text>
        <Text style={styles.summaryText}>Lợi Nhuận: {formatNumber(income - expense)} VND</Text>
      </View>
  
      {/* Hiển thị lịch sử giao dịch */}
      <Text style={styles.title}>Lịch Sử Giao Dịch</Text>
      {transactions.length > 0 ? (
        transactions.map((item, index) => (
          <View key={index} style={styles.transactionItem}>
            <Text style={styles.transactionDate}>{item.date}</Text>
            <Text style={styles.transactionDescription}>{item.description}</Text>
            <Text
              style={[
                styles.transactionAmount,
                { color: item.type === 'income' ? '#28a745' : '#dc3545' },
              ]}
            >
              {item.type === 'income' ? '+' : '-'}{formatNumber(item.amount)} VND
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Không có giao dịch nào trong khoảng thời gian này.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  calculateButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summary: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#333',
  },
  transactionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 5,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});

export default StatisticsScreen;