// src/screens/AddTransactionScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { addTransaction } from '../services/TransactionService';

const AddTransactionScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income'); // Mặc định là thu
  const [date, setDate] = useState(''); // Thêm state cho ngày

  const handleAddTransaction = async () => {
    if (!description || !amount || !date) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const transaction = {
      date, // Sử dụng ngày người dùng nhập
      description,
      amount: parseFloat(amount),
      type,
    };

    await addTransaction(transaction);
    alert('Thêm giao dịch thành công!');
    navigation.goBack(); // Quay lại màn hình trước (MainScreen)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Giao Dịch</Text>

      <TextInput
        style={styles.input}
        placeholder="Ngày (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả (ví dụ: Bán hàng)"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Số tiền (VND)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'income' && styles.typeButtonActiveIncome]}
          onPress={() => setType('income')}
        >
          <Text style={styles.typeButtonText}>Thu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'expense' && styles.typeButtonActiveExpense]}
          onPress={() => setType('expense')}
        >
          <Text style={styles.typeButtonText}>Chi</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
        <Text style={styles.addButtonText}>Thêm Giao Dịch</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  typeButtonActiveIncome: {
    backgroundColor: '#28a745',
  },
  typeButtonActiveExpense: {
    backgroundColor: '#dc3545',
  },
  typeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTransactionScreen;