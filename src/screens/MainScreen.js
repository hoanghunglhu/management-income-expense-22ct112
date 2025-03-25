import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from 'react-native-vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const MainScreen = () => {
  // Dữ liệu mẫu cho danh sách giao dịch
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

  // State cho bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [transactionType, setTransactionType] = useState('Tất cả');
  const [activeTab, setActiveTab] = useState('Home');

  // State cho bộ lọc ngày
  const [showDateModal, setShowDateModal] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // State để kiểm soát hiển thị khung "Chi tiết chi tiêu"
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  // State để kiểm soát trạng thái nút "Lọc theo ngày" hoặc "Quay về mặc định"
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  // State cho DropDownPicker trong modal lọc ngày
  const [open, setOpen] = useState(false);
  const [tempTransactionType, setTempTransactionType] = useState('Tất cả');
  const [items, setItems] = useState([
    { label: 'Tất cả', value: 'Tất cả' },
    { label: 'Thu nhập', value: 'Thu nhập' },
    { label: 'Chi tiêu', value: 'Chi tiêu' },
  ]);

  // Hàm xử lý tìm kiếm và gợi ý
  const handleSearch = (text) => {
    setSearchTerm(text);

    if (text.length > 0) {
      const suggestionsList = transactions
        .filter((transaction) =>
          transaction.name.toLowerCase().includes(text.toLowerCase())
        )
        .map((transaction) => transaction.name)
        .filter((value, index, self) => self.indexOf(value) === index);
      setSuggestions(suggestionsList);
    } else {
      setSuggestions([]);
    }
  };

  // Hàm chọn gợi ý
  const selectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    setShowTransactionDetails(true);
    setIsFilterApplied(true);
  };

  // Hàm xử lý khi nhấn vào kính lúp
  const handleSearchIconPress = () => {
    if (searchTerm.trim() === '') return;
    setShowTransactionDetails(true);
    setIsFilterApplied(true);
    setSuggestions([]);
  };

  // Hàm định dạng ngày thành chuỗi YYYY-MM-DD
  const formatDateToString = (date) => {
    if (!date) return 'Chưa chọn';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Hàm chuyển chuỗi ngày thành Date object để so sánh
  const parseDateString = (dateString) => {
    return new Date(dateString);
  };

  // Hàm lọc giao dịch
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

  // Hàm định dạng số tiền
  const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND';
  };

  // Hàm render từng giao dịch trong ScrollView
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

  // Render gợi ý tìm kiếm
  const renderSuggestions = () => {
    if (suggestions.length === 0) return null;
  
    return (
      <View style={styles.suggestionsContainer}>
        <ScrollView 
          nestedScrollEnabled={true} 
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.suggestionsScrollContainer}
        >
          {suggestions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => selectSuggestion(item)}
            >
              <Text numberOfLines={1} ellipsizeMode="tail">
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Xử lý chọn ngày
  const handleStartDateConfirm = (date) => {
    setShowStartDatePicker(false);
    setTempStartDate(date);
  };

  const handleEndDateConfirm = (date) => {
    setShowEndDatePicker(false);
    setTempEndDate(date);
  };

  // Áp dụng bộ lọc ngày và trạng thái
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

  // Reset bộ lọc ngày và trạng thái
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

  // Hàm tính toán dữ liệu cho biểu đồ
  const getChartData = () => {
    const monthlyData = {};

    filteredTransactions.forEach((transaction) => {
      const date = parseDateString(transaction.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { income: 0, expense: 0 };
      }

      if (transaction.type === 'Thu nhập') {
        monthlyData[monthYear].income += transaction.amount;
      } else if (transaction.type === 'Chi tiêu') {
        monthlyData[monthYear].expense += transaction.amount;
      }
    });

    const labels = Object.keys(monthlyData).sort();
    const incomeData = labels.map((month) => monthlyData[month].income / 1000000);
    const expenseData = labels.map((month) => monthlyData[month].expense / 1000000);

    const formattedLabels = labels.map((label) => {
      const [year, month] = label.split('-');
      return `${month}/${year}`;
    });

    return {
      labels: formattedLabels.length > 0 ? formattedLabels : ['Không có dữ liệu'],
      datasets: [
        {
          data: incomeData.length > 0 ? incomeData : [0],
          color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: expenseData.length > 0 ? expenseData : [0],
          color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ['Thu nhập (triệu VND)', 'Chi tiêu (triệu VND)'],
    };
  };

  // Render nội dung theo tab
  const renderContent = () => {
    const chartData = getChartData();

    switch (activeTab) {
      case 'Home':
        return (
          <>
            {/* Thông tin chủ tài khoản */}
            <View style={styles.accountInfo}>
              <Text style={styles.accountText}>Chủ tài khoản: Nguyễn Văn A</Text>
            </View>

            {/* Bộ lọc tìm kiếm */}
            <View style={styles.filterContainer}>
              {/* Ô tìm kiếm theo tên với kính lúp */}
              <View style={styles.searchWrapper}>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm theo tên..."
                    value={searchTerm}
                    onChangeText={handleSearch}
                  />
                  <TouchableOpacity
                    style={styles.searchIconContainer}
                    onPress={handleSearchIconPress}
                  >
                    <Ionicons name="search-outline" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
                {renderSuggestions()}
              </View>

              {/* Nút "Lọc theo ngày" hoặc "Quay về mặc định" */}
              <TouchableOpacity
                style={styles.dateFilterButton}
                onPress={isFilterApplied ? resetFilter : () => setShowDateModal(true)}
              >
                <Ionicons
                  name={isFilterApplied ? 'refresh-outline' : 'calendar-outline'}
                  size={20}
                  color="white"
                  style={styles.icon}
                />
                <Text style={styles.dateFilterButtonText}>
                  {isFilterApplied ? 'Quay về mặc định' : 'Lọc theo ngày'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Danh sách giao dịch với ScrollView - Chỉ hiển thị khi áp dụng bộ lọc */}
            {showTransactionDetails && (
              <View style={styles.detailContainer}>
                <Text style={styles.sectionTitle}>Chi tiết chi tiêu</Text>
                <Text style={styles.filterCount}>
                  Tìm thấy {filteredTransactions.length} giao dịch
                </Text>
                <ScrollView style={styles.transactionList}>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((item) => renderTransaction(item))
                  ) : (
                    <Text style={styles.noDataText}>Không tìm thấy giao dịch nào.</Text>
                  )}
                </ScrollView>
              </View>
            )}

            {/* Biểu đồ thu nhập - chi tiêu */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Biểu đồ thu nhập - chi tiêu</Text>
              <LineChart
                data={chartData}
                width={Dimensions.get('window').width - 40}
                height={220}
                chartConfig={{
                  backgroundColor: '#e26a00',
                  backgroundGradientFrom: '#fb8c00',
                  backgroundGradientTo: '#ffa726',
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#ffa726',
                  },
                }}
                style={styles.chart}
                withDots={true}
                withShadow={true}
                withInnerLines={true}
                withOuterLines={true}
              />
            </View>
          </>
        );
      case 'Stats':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Thống kê</Text>
            {/* Nội dung tab Thống kê */}
          </View>
        );
      case 'Settings':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Cài đặt</Text>
            {/* Nội dung tab Cài đặt */}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.mainScrollViewContent}>
          {renderContent()}
        </ScrollView>

        {/* Modal lọc ngày */}
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

                {/* Bộ lọc trạng thái (DropDownPicker) */}
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

        {/* Thanh navigation cố định ở dưới cùng */}
        <View style={styles.navbar}>
          {['Home', 'Stats', 'Settings'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.navItem, activeTab === tab && styles.activeTab]}
            >
              <Ionicons
                name={
                  tab === 'Home'
                    ? 'home'
                    : tab === 'Stats'
                    ? 'stats-chart'
                    : 'settings'
                }
                size={24}
                color={activeTab === tab ? '#3498db' : '#666'}
              />
              <Text style={activeTab === tab ? styles.activeTabText : styles.navText}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainScrollViewContent: {
    paddingBottom: 80,
  },
  accountInfo: {
    padding: 15,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    margin: 10,
  },
  accountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  searchWrapper: {
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderWidth: 0,
  },
  searchIconContainer: {
    padding: 10,
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    maxHeight: 200,
    zIndex: 2,
  },
  suggestionsScrollContainer: {
    flexGrow: 1,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  dateFilterButton: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  dateFilterButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },
  detailContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  filterCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  transactionList: {
    maxHeight: 300,
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
  chartContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  chart: {
    borderRadius: 16,
  },
  tabContent: {
    flex: 1,
    padding: 20,
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
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  navItem: {
    alignItems: 'center',
    padding: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  navText: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: 'bold',
  },
});

export default MainScreen;