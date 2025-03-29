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

  // Hàm định dạng số tiền
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Lấy dữ liệu giao dịch từ AsyncStorage
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem('transactions');
        if (storedTransactions) {
          const parsedTransactions = JSON.parse(storedTransactions).reverse();
          setTransactions(parsedTransactions);

          // Tính toán tổng thu, tổng chi và số dư
          let income = 0;
          let expenses = 0;
          parsedTransactions.forEach(transaction => {
            if (transaction.type === 'income') {
              income += parseFloat(transaction.amount); // Chuyển thành số trước khi cộng
            } else {
              expenses += parseFloat(transaction.amount); // Chuyển thành số trước khi cộng
            }
          });
          setTotalIncome(income);
          setTotalExpenses(expenses);
          setCurrentBalance(income - expenses);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, [transactionUpdate]); // Thêm transactionUpdate vào dependency array

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
      <LineChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [{ data: [500, 700, 800, 600, 900] }],
        }}
        width={300}
        height={220}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
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