// src/screens/SearchAndFilter.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import SearchBar from '../components/SearchBar';

const SearchAndFilter = () => {
  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Lương tháng 10', type: 'Thu nhập', amount: 15000000, date: '2023-10-01' },
    { id: 2, name: 'Mua sắm quần áo', type: 'Chi tiêu', amount: 1200000, date: '2023-10-02' },
    { id: 3, name: 'Tiền thưởng dự án', type: 'Thu nhập', amount: 5000000, date: '2023-10-03' },
    { id: 4, name: 'Ăn uống ngoài', type: 'Chi tiêu', amount: 300000, date: '2023-10-04' },
    { id: 5, name: 'Tiền nhà tháng 10', type: 'Chi tiêu', amount: 4000000, date: '2023-10-05' },
    { id: 6, name: 'Lương part-time', type: 'Thu nhập', amount: 3000000, date: '2023-10-06' },
    { id: 7, name: 'Mua điện thoại mới', type: 'Chi tiêu', amount: 8000000, date: '2023-10-07' },
    { id: 8, name: 'Tiền lãi tiết kiệm', type: 'Thu nhập', amount: 500000, date: '2023-10-08' },
    { id: 9, name: 'Đi du lịch Đà Lạt', type: 'Chi tiêu', amount: 3500000, date: '2023-10-09' },
    { id: 10, name: 'Freelance thiết kế', type: 'Thu nhập', amount: 7000000, date: '2023-10-10' },
    { id: 11, name: 'Mua sách học tập', type: 'Chi tiêu', amount: 200000, date: '2023-10-11' },
    { id: 12, name: 'Tiền phụ cấp', type: 'Thu nhập', amount: 1000000, date: '2023-10-12' },
    { id: 13, name: 'Tiền điện nước', type: 'Chi tiêu', amount: 1500000, date: '2023-10-13' },
    { id: 14, name: 'Lương tháng 11', type: 'Thu nhập', amount: 15000000, date: '2023-11-01' },
    { id: 15, name: 'Mua vé xem phim', type: 'Chi tiêu', amount: 150000, date: '2023-11-02' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [transactionType, setTransactionType] = useState('Tất cả');
  const [showDateModal, setShowDateModal] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [open, setOpen] = useState(false);
  const [tempTransactionType, setTempTransactionType] = useState('Tất cả');
  const [items, setItems] = useState([
    { label: 'Tất cả', value: 'Tất cả' },
    { label: 'Thu nhập', value: 'Thu nhập' },
    { label: 'Chi tiêu', value: 'Chi tiêu' },
  ]);

  const formatDateToString = (date) => {
    if (!date) return 'Chưa chọn';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateString = (dateString) => {
    return new Date(dateString);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesName = transaction.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        transactionType === 'Tất cả' || transaction.type === transactionType;

      const transactionDate = parseDateString(transaction.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchesDateRange =
        (!start || transactionDate >= start) && (!end || transactionDate <= end);

      return matchesName && matchesType && matchesDateRange;
    });
  }, [transactions, searchTerm, transactionType, startDate, endDate]);

  const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND';
  };

  const renderTransaction = (item) => (
    <View key={item.id} style={styles.transactionItem}>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionName} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <View style={styles.transactionAmountContainer}>
        <Text
          style={[
            styles.transactionAmount,
            item.type === 'Thu nhập' ? styles.incomeText : styles.expenseText,
          ]}
        >
          {item.type === 'Thu nhập' ? '+' : '-'}
          {formatAmount(item.amount)}
        </Text>
        <Text style={styles.transactionType}>{item.type}</Text>
      </View>
    </View>
  );

  const handleStartDateConfirm = (date) => {
    setShowStartDatePicker(false);
    setTempStartDate(date);
  };

  const handleEndDateConfirm = (date) => {
    setShowEndDatePicker(false);
    setTempEndDate(date);
  };

  const applyDateFilter = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    setTransactionType(tempTransactionType);
    setShowDateModal(false);
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
    setShowTransactionDetails(true);
    setIsFilterApplied(true);
  };

  const resetFilter = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    setStartDate(null);
    setEndDate(null);
    setTransactionType('Tất cả');
    setTempTransactionType('Tất cả');
    setShowDateModal(false);
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
    setShowTransactionDetails(false);
    setIsFilterApplied(false);
    setSearchTerm('');
  };

  return (
    <>
      <View style={styles.filterContainer}>
        <View style={styles.searchAndFilterRow}>
          <View style={styles.searchBarContainer}>
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              suggestions={suggestions}
              setSuggestions={setSuggestions}
              transactions={transactions}
              setShowTransactionDetails={setShowTransactionDetails}
              setIsFilterApplied={setIsFilterApplied}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={isFilterApplied ? resetFilter : () => setShowDateModal(true)}
          >
            <Ionicons
              name={isFilterApplied ? 'close-outline' : 'funnel-outline'}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {showTransactionDetails && (
          <View style={styles.transactionContainer}>
            <Text style={styles.transactionTitle}>Chi tiết chi tiêu</Text>
            <ScrollView style={styles.transactionList}>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => renderTransaction(item))
              ) : (
                <Text style={styles.noDataText}>Không tìm thấy giao dịch nào.</Text>
              )}
            </ScrollView>
          </View>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDateModal}
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn khoảng thời gian</Text>
            <View style={styles.datePickerContainer}>
              <Text>Từ ngày: {formatDateToString(tempStartDate)}</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.datePickerButtonText}>Chọn ngày bắt đầu</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showStartDatePicker}
                mode="date"
                onConfirm={handleStartDateConfirm}
                onCancel={() => setShowStartDatePicker(false)}
                date={tempStartDate || new Date()}
              />

              <Text style={styles.datePickerLabel}>
                Đến ngày: {formatDateToString(tempEndDate)}
              </Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.datePickerButtonText}>Chọn ngày kết thúc</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showEndDatePicker}
                mode="date"
                onConfirm={handleEndDateConfirm}
                onCancel={() => setShowEndDatePicker(false)}
                date={tempEndDate || new Date()}
              />

              <Text style={styles.datePickerLabel}>Trạng thái:</Text>
              <DropDownPicker
                open={open}
                value={tempTransactionType}
                items={items}
                setOpen={setOpen}
                setValue={setTempTransactionType}
                setItems={setItems}
                style={styles.picker}
                containerStyle={styles.pickerContainer}
                dropDownContainerStyle={styles.dropDownContainer}
                placeholder="Chọn trạng thái"
                zIndex={3000}
                zIndexInverse={1000}
              />
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDateModal(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.applyButton]}
                onPress={applyDateFilter}
              >
                <Text style={styles.modalButtonText}>Áp dụng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  searchAndFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarContainer: {
    flex: 1,
  },
  filterButton: {
    backgroundColor: '#3498db',
    height: 40, // Đồng bộ chiều cao với thanh tìm kiếm
    width: 40, // Đặt chiều rộng bằng chiều cao để tạo hình vuông
    borderRadius: 10,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  datePickerContainer: {
    marginBottom: 15,
  },
  datePickerLabel: {
    marginTop: 10,
  },
  datePickerButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  datePickerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    padding: 10,
    borderRadius: 10,
    width: '40%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  applyButton: {
    backgroundColor: '#2ecc71',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropDownContainer: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderRadius: 10,
  },
  transactionContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  transactionList: {
    maxHeight: 200,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  transactionDetails: {
    flex: 1,
    marginRight: 10,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeText: {
    color: '#2ecc71',
  },
  expenseText: {
    color: '#e74c3c',
  },
  transactionType: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default SearchAndFilter;