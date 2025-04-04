// src/screens/StatisticsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {
  income: '#2ECC71',
  expense: '#EC407A',
};

const StatisticsScreen = () => {
  const [startDate, setStartDate] = useState('2022-04-20');
  const [endDate, setEndDate] = useState('2022-04-25');
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const fetchTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem('transactions');
      return storedTransactions ? JSON.parse(storedTransactions) : [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  };

  const calculateStatistics = async () => {
    if (!startDate || !endDate) {
      alert('Vui lòng nhập khoảng thời gian!');
      return;
    }

    const allTransactions = await fetchTransactions();
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredTransactions = allTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });

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

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDate}>{item.date}</Text>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.type === 'income' ? COLORS.income : COLORS.expense },
        ]}
      >
        {item.type === 'income' ? '+' : '-'}{formatNumber(item.amount)} VND
      </Text>
    </View>
  );

  const renderHeader = () => (
    <>
      <Text style={styles.title}>Thống Kê Thu Chi</Text>
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
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Tổng Thu: {formatNumber(income)} VND</Text>
        <Text style={styles.summaryText}>Tổng Chi: {formatNumber(expense)} VND</Text>
        <Text style={styles.summaryText}>Lợi Nhuận: {formatNumber(income - expense)} VND</Text>
      </View>
      <Text style={styles.title}>Lịch Sử Giao Dịch</Text>
    </>
  );

  return (
    <FlatList
      style={styles.container}
      data={transactions}
      renderItem={renderTransaction}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={<Text style={styles.emptyText}>Không có giao dịch nào trong khoảng thời gian này.</Text>}
    />
  );
};

// Styles giữ nguyên như trong code trước đó
const styles = StyleSheet.create({ /* ... giữ nguyên styles từ code trước ... */ });

export default StatisticsScreen;