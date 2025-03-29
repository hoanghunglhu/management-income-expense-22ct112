// src/screens/AddTransactionScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const AddTransactionScreen = ({ navigation, route, transactions, setTransactions }) => {
  const { transactionToEdit, date: originalDate } = route.params || {};

  const [group, setGroup] = useState(transactionToEdit?.title || '');
  const [title, setTitle] = useState(transactionToEdit?.title || '');
  const [amount, setAmount] = useState(transactionToEdit?.amount?.replace(/[^0-9]/g, '') || '');
  const [friend, setFriend] = useState(transactionToEdit?.subtitle || '');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState(transactionToEdit?.type || 'expense');
  const [transactionDate, setTransactionDate] = useState(
    transactionToEdit ? originalDate : new Date().toLocaleDateString('vi-VN')
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // State cho DropDownPicker
  const [openGroup, setOpenGroup] = useState(false);
  const [openFriend, setOpenFriend] = useState(false);
  const [groupItems, setGroupItems] = useState([
    { label: 'Chọn nhóm', value: '' },
    { label: 'Ăn uống', value: 'Ăn uống' },
    { label: 'Du lịch', value: 'Du lịch' },
    { label: 'Tiền lương', value: 'Tiền lương' },
    { label: 'Chăm sóc thú cưng', value: 'Chăm sóc thú cưng' },
    { label: 'Chữa bệnh', value: 'Chữa bệnh' },
    { label: 'Di chuyển', value: 'Di chuyển' },
    { label: 'Hóa đơn', value: 'Hóa đơn' },
  ]);
  const [friendItems, setFriendItems] = useState([
    { label: 'Chọn bạn', value: '' },
    { label: 'Riêng tôi', value: 'Riêng tôi' },
    { label: 'Gia đình', value: 'Gia đình' },
    { label: 'Thú cưng', value: 'Thú cưng' },
  ]);

  useEffect(() => {
    if (transactionToEdit) {
      setGroup(transactionToEdit.title);
      setTitle(transactionToEdit.title);
      setAmount(transactionToEdit.amount.replace(/[^0-9]/g, ''));
      setFriend(transactionToEdit.subtitle);
      setType(transactionToEdit.type);
      setTransactionDate(originalDate);
    }
  }, [transactionToEdit, originalDate]);

  const formatDateToString = (date) => {
    if (!date) return 'Chưa chọn';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  };

  const handleDateConfirm = (date) => {
    setShowDatePicker(false);
    setTransactionDate(formatDateToString(date));
  };

  const handleSubmit = () => {
    if (!group || !title || !amount || !transactionDate) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }

    const newTransaction = {
      id: transactionToEdit?.id || uuidv4(),
      icon: transactionToEdit?.icon || '💸',
      title,
      amount: `${type === 'income' ? '+' : '-'}${amount} đ`,
      subtitle: friend || 'Riêng tôi',
      wallet: 'Ví của tôi',
      type,
    };

    const selectedDate = transactionDate;
    const selectedDayOfWeek = new Date(
      selectedDate.split('/')[2],
      selectedDate.split('/')[1] - 1,
      selectedDate.split('/')[0]
    ).toLocaleString('vi-VN', { weekday: 'long' });

    const updatedTransactions = [...transactions];
    const dateIndex = updatedTransactions.findIndex((group) =>
      group.date === (transactionToEdit ? originalDate : selectedDate)
    );

    if (transactionToEdit) {
      if (dateIndex !== -1) {
        updatedTransactions[dateIndex].items = updatedTransactions[dateIndex].items.filter(
          (item) => item.id !== transactionToEdit.id
        );
        if (updatedTransactions[dateIndex].items.length === 0) {
          updatedTransactions.splice(dateIndex, 1);
        }
      }

      const selectedDateIndex = updatedTransactions.findIndex((group) => group.date === selectedDate);
      if (selectedDateIndex !== -1) {
        updatedTransactions[selectedDateIndex].items.push(newTransaction);
      } else {
        updatedTransactions.push({
          date: selectedDate,
          dayOfWeek: selectedDayOfWeek,
          items: [newTransaction],
        });
      }
    } else {
      if (dateIndex !== -1) {
        updatedTransactions[dateIndex].items.push(newTransaction);
      } else {
        updatedTransactions.push({
          date: selectedDate,
          dayOfWeek: selectedDayOfWeek,
          items: [newTransaction],
        });
      }
    }

    updatedTransactions.sort((a, b) =>
      new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'))
    );

    setTransactions(updatedTransactions);
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{transactionToEdit ? 'Sửa giao dịch' : 'Giao dịch mới'}</Text>

      {/* Chọn ngày giao dịch */}
      <Text style={styles.label}>
        Ngày giao dịch <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.dateInputContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Chọn ngày"
          placeholderTextColor="#aaa"
          value={transactionDate}
          editable={false}
        />
        <TouchableOpacity style={styles.calendarIcon} onPress={() => setShowDatePicker(true)}>
          <Icon name="calendar" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setShowDatePicker(false)}
        date={new Date()}
      />

      {/* Chọn nhóm giao dịch */}
      <Text style={styles.label}>
        Chọn nhóm giao dịch <Text style={styles.required}>*</Text>
      </Text>
      <DropDownPicker
        open={openGroup}
        value={group}
        items={groupItems}
        setOpen={setOpenGroup}
        setValue={setGroup}
        setItems={setGroupItems}
        style={styles.picker}
        containerStyle={styles.pickerContainer}
        dropDownContainerStyle={styles.dropDownContainer}
        placeholder="Chọn nhóm"
        zIndex={3000}
        zIndexInverse={1000}
        listMode="SCROLLVIEW"
        onChangeValue={(value) => console.log('Selected group:', value)}
        textStyle={styles.dropdownText}
        placeholderStyle={styles.placeholderText}
      />

      {/* Tên giao dịch */}
      <Text style={styles.label}>
        Tên giao dịch <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên giao dịch"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />

      {/* Số tiền giao dịch */}
      <Text style={styles.label}>
        Số tiền giao dịch <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số tiền"
        placeholderTextColor="#aaa"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      {/* Thêm bạn */}
      <Text style={styles.label}>Thêm bạn</Text>
      <DropDownPicker
        open={openFriend}
        value={friend}
        items={friendItems}
        setOpen={setOpenFriend}
        setValue={setFriend}
        setItems={setFriendItems}
        style={styles.picker}
        containerStyle={styles.pickerContainer}
        dropDownContainerStyle={styles.dropDownContainer}
        placeholder="Chọn bạn"
        zIndex={2000}
        zIndexInverse={2000}
        listMode="SCROLLVIEW"
        onChangeValue={(value) => console.log('Selected friend:', value)}
        textStyle={styles.dropdownText}
        placeholderStyle={styles.placeholderText}
      />

      {/* Đến hạn */}
      <Text style={styles.label}>Đến hạn</Text>
      <View style={styles.dateInputContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Chọn ngày"
          placeholderTextColor="#aaa"
          value={dueDate}
          onChangeText={setDueDate}
        />
        <TouchableOpacity style={styles.calendarIcon}>
          <Icon name="calendar" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Ghi chú */}
      <Text style={styles.label}>Ghi chú</Text>
      <TextInput
        style={[styles.input, styles.noteInput]}
        placeholder="Nhập ghi chú"
        placeholderTextColor="#aaa"
        value={note}
        onChangeText={setNote}
        multiline
      />

      {/* Nút Hủy và Lưu */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>HỦY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>LƯU</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2d',
    padding: 16,
  },
  header: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  required: {
    color: 'red',
  },
  input: {
    backgroundColor: '#272836',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    backgroundColor: '#272836',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    color: '#FFFFFF', // Màu chữ của mục được chọn
  },
  dropDownContainer: {
    backgroundColor: '#272836',
    borderColor: '#444',
    borderRadius: 8,
  },
  dropdownText: {
    color: '#FFFFFF', // Màu chữ của các option trong danh sách dropdown
    fontSize: 16,
  },
  placeholderText: {
    color: '#aaa', // Màu chữ của placeholder
    fontSize: 16,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarIcon: {
    padding: 12,
    backgroundColor: '#272836',
    borderRadius: 8,
    marginLeft: 8,
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#FF4D4F',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#1890FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTransactionScreen;