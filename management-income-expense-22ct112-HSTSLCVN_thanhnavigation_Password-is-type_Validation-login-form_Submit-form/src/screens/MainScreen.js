// src/screens/MainScreen.js
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransactionContext } from '../contexts/TransactionContext'; // Import TransactionContext

// Tạo các màn hình con cho từng tab
const HomeTab = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const { transactionUpdate } = useContext(TransactionContext); // Lấy transactionUpdate từ context
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });

  // Hàm định dạng số tiền
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Lấy dữ liệu giao dịch từ AsyncStorage
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem('transactions');
        console.log("storedTransactions:", storedTransactions);

        if (storedTransactions) {
          const parsedTransactions = JSON.parse(storedTransactions).reverse();
          setTransactions(parsedTransactions);

          let income = 0;
          let expenses = 0;
          parsedTransactions.forEach(transaction => {
            if (transaction.type === 'income') {
              income += parseFloat(transaction.amount);
            } else {
              expenses += parseFloat(transaction.amount);
            }
          });
          setTotalIncome(income);
          setTotalExpenses(expenses);
          setCurrentBalance(income - expenses);

          // Tạo dữ liệu cho biểu đồ
          const currentMonth = new Date().getMonth();
          const transactionCountsByDay = {};

          parsedTransactions.forEach(transaction => {
            try {
              const transactionDate = new Date(transaction.date);
              console.log("transactionDate:", transactionDate, "from", transaction.date);
              if (transactionDate.getMonth() === currentMonth) {
                const day = transactionDate.getDate();
                transactionCountsByDay[day] = (transactionCountsByDay[day] || 0) + 1;
              }
            } catch (dateError) {
              console.error("Error parsing date:", transaction.date, dateError);
            }
          });

          const labels = Object.keys(transactionCountsByDay).sort((a, b) => a - b);
          const data = labels.map(day => transactionCountsByDay[day]);

          const newChartData = {
            labels: labels,
            datasets: [{ data: data }],
          };
          console.log("chartData:", newChartData);
          setChartData(newChartData);
        } else {
          console.log("No transactions found in AsyncStorage");
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, [transactionUpdate]);

  // Hàm render mỗi giao dịch
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
    <View style={styles.tabContainer}>
      <Text style={styles.tabTitle}>Trang Chủ</Text>

      {/* Hiển thị thông tin tổng quan */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Tổng thu: {formatNumber(totalIncome)} VND</Text>
        <Text style={styles.summaryText}>Tổng chi: {formatNumber(totalExpenses)} VND</Text>
        <Text style={styles.summaryText}>Số dư: {formatNumber(currentBalance)} VND</Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Text style={styles.addButtonText}>THÊM GIAO DỊCH</Text>
      </TouchableOpacity>
      <ScrollView style={styles.detailContainer}>
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>Chưa có giao dịch nào.</Text>}
        />
      </ScrollView>
      {(() => { // Thêm hàm bao bọc để có thể thêm console.log
        console.log("Before rendering LineChart, chartData:", chartData);
        return chartData.labels.length > 0 ? (
          <LineChart
            data={chartData}
            width={300}
            height={220}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 0, // Số lượng giao dịch là số nguyên
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
          />
        ) : (
          <Text style={styles.emptyText}>Không có dữ liệu biểu đồ cho tháng này.</Text>
        );
      })()}
    </View>
  );
};

const SettingsTab = () => (
  <View style={styles.tabContainer}>
    <Text style={styles.tabTitle}>Cài Đặt</Text>
    <Text>Đây là màn hình cài đặt...</Text>
  </View>
);

// Tab Navigator
const Tab = createBottomTabNavigator();

const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Thông tin chủ tài khoản */}
      <View style={styles.accountInfo}>
        <Text style={styles.accountText}>Chủ tài khoản: Nguyễn Văn A</Text>
      </View>

      {/* Tab Navigator */}
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Stats') {
              iconName = 'stats-chart';
            } else if (route.name === 'Settings') {
              iconName = 'settings';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeTab} options={{ headerShown: false }} />
        <Tab.Screen
          name="Stats"
          component={() => null} // Không cần component vì sẽ điều hướng
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); // Ngăn không cho tab được chọn
              navigation.navigate('Statistics'); // Điều hướng đến StatisticsScreen
            },
          }}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Settings" component={SettingsTab} options={{ headerShown: false }} />
      </Tab.Navigator>
    </View>
  );
};

//Màn hình thông tin cá nhân

const styles = StyleSheet.create({
  container: { flex: 1 },
  accountInfo: { padding: 10, backgroundColor: '#ddd', marginBottom: 10 },
  accountText: { fontSize: 16, fontWeight: 'bold' },
  tabContainer: { flex: 1, padding: 10 },
  tabTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  detailContainer: { flex: 1, marginBottom: 10 },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  tableContainer: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: '#ffb347', // Màu nền cam
    borderRadius: 10, // Bo tròn góc
    padding: 10, // Thêm padding
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Nền trắng mờ
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)', // Đường kẻ trắng mờ
    borderRadius: 5, // Bo tròn góc
    marginBottom: 5, // Thêm margin
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color: 'white', // Chữ trắng
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)', // Đường kẻ trắng mờ
  },
  tableCell: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white', // Chữ trắng
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  summaryContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default MainScreen;