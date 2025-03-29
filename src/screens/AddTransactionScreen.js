import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

// Import react-native-get-random-values before uuid
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// Component AddTransactionScreen: Xử lý thêm và sửa giao dịch
const AddTransactionScreen = ({ navigation, route, transactions, setTransactions }) => {
  const { transactionToEdit, date: originalDate } = route.params || {};

  const [title, setTitle] = useState(transactionToEdit?.title || '');
  const [amount, setAmount] = useState(transactionToEdit?.amount?.replace(/[^0-9]/g, '') || '');
  const [type, setType] = useState(transactionToEdit?.type || 'expense');

  useEffect(() => {
    if (transactionToEdit) {
      setTitle(transactionToEdit.title);
      setAmount(transactionToEdit.amount.replace(/[^0-9]/g, ''));
      setType(transactionToEdit.type);
    }
  }, [transactionToEdit]);

  const handleSubmit = () => {
    if (title && amount) {
      const newTransaction = {
        id: transactionToEdit?.id || uuidv4(),
        icon: transactionToEdit?.icon || '💸',
        title,
        amount: `${type === 'income' ? '+' : '-'}${amount} đ`,
        subtitle: 'Riêng tôi',
        wallet: 'Ví của tôi',
        type,
      };

      const currentDate = new Date().toLocaleDateString('vi-VN');
      const currentDayOfWeek = new Date().toLocaleString('vi-VN', { weekday: 'long' });

      const updatedTransactions = [...transactions];
      const dateIndex = updatedTransactions.findIndex((group) => group.date === (transactionToEdit ? originalDate : currentDate));

      if (transactionToEdit) {
        if (dateIndex !== -1) {
          updatedTransactions[dateIndex].items = updatedTransactions[dateIndex].items.filter(
            (item) => item.id !== transactionToEdit.id
          );
          if (updatedTransactions[dateIndex].items.length === 0) {
            updatedTransactions.splice(dateIndex, 1);
          }
        }

        const currentDateIndex = updatedTransactions.findIndex((group) => group.date === currentDate);
        if (currentDateIndex !== -1) {
          updatedTransactions[currentDateIndex].items.push(newTransaction);
        } else {
          updatedTransactions.push({
            date: currentDate,
            dayOfWeek: currentDayOfWeek,
            items: [newTransaction],
          });
        }
      } else {
        if (dateIndex !== -1) {
          updatedTransactions[dateIndex].items.push(newTransaction);
        } else {
          updatedTransactions.push({
            date: currentDate,
            dayOfWeek: currentDayOfWeek,
            items: [newTransaction],
          });
        }
      }

      updatedTransactions.sort((a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));

      setTransactions(updatedTransactions);
      navigation.goBack();
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{transactionToEdit ? 'Sửa giao dịch' : 'Thêm giao dịch'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Tiêu đề (VD: Ăn uống)"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Số tiền (VD: 100000)"
        placeholderTextColor="#aaa"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'income' && styles.activeButton]}
          onPress={() => setType('income')}
        >
          <Text style={styles.typeText}>Thu nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'expense' && styles.activeButton]}
          onPress={() => setType('expense')}
        >
          <Text style={styles.typeText}>Chi tiêu</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>{transactionToEdit ? 'Cập nhật' : 'Thêm giao dịch'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e2d',
    padding: 16,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#272836',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 16,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 20,
  },
  typeButton: {
    padding: 10,
    backgroundColor: '#3C3C4D',
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#EC407A',
  },
  typeText: {
    color: '#fff',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#EC407A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddTransactionScreen;