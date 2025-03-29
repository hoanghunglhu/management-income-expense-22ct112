import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import ReportsScreen from './src/screens/ReportsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Component BottomTabNavigator: Quản lý các tab điều hướng
const BottomTabNavigator = ({ transactions, setTransactions }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#EC407A',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: 'Tổng kê',
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard-outline" color={color} size={size} />
          ),
        }}
      >
        {(props) => <HomeScreen {...props} transactions={transactions} setTransactions={setTransactions} />}
      </Tab.Screen>
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarLabel: 'Sổ giao dịch',
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AddTransaction"
        options={{
          tabBarLabel: 'Thêm', // Sửa lại label cho đúng với chức năng
          tabBarIcon: ({ color, size }) => (
            <View style={styles.addButton}>
              <Icon name="plus" color="#fff" size={size} />
            </View>
          ),
        }}
      >
        {(props) => <AddTransactionScreen {...props} transactions={transactions} setTransactions={setTransactions} />}
      </Tab.Screen>
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarLabel: 'Báo cáo',
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-pie" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Cài đặt',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Ứng dụng chính: Quản lý trạng thái giao dịch
export default function App() {
  // State để lưu trữ danh sách giao dịch
  const [transactions, setTransactions] = useState([
    {
      date: '22/04/2022',
      dayOfWeek: 'Thứ sáu',
      items: [
        { id: '1', icon: '🍔', title: 'Ăn uống', subtitle: 'Riêng tôi', amount: '-100,000 đ', wallet: 'Ví của tôi', type: 'expense' },
        { id: '2', icon: '🎁', title: 'Du lịch', subtitle: 'Gia đình', amount: '-5,000,000 đ', wallet: 'Ví của tôi', type: 'expense' },
        { id: '3', icon: '💰', title: 'Tiền lương', subtitle: 'Riêng tôi', amount: '+30,000,000 đ', wallet: 'Ví của tôi', type: 'income' },
        { id: '7', icon: '🌿', title: 'Chăm sóc thú cưng', subtitle: 'Thú cưng', amount: '-500,000 đ', wallet: 'Ví của tôi', type: 'expense' },
      ],
    },
    {
      date: '25/04/2022',
      dayOfWeek: 'Thứ hai',
      items: [
        { id: '4', icon: '👩‍⚕️', title: 'Chữa bệnh', subtitle: 'Thú cưng', amount: '-500,000 đ', wallet: 'Ví của tôi', type: 'expense' },
        { id: '5', icon: '🚌', title: 'Di chuyển', subtitle: 'Riêng tôi', amount: '-20,000 đ', wallet: 'Ví của tôi', type: 'expense' },
        { id: '6', icon: '💧', title: 'Hóa đơn nước', subtitle: 'Riêng tôi', amount: '-300,000 đ', wallet: 'Ví của tôi', type: 'expense' },
      ],
    },
  ]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          options={{ headerShown: false }}
        >
          {(props) => <BottomTabNavigator {...props} transactions={transactions} setTransactions={setTransactions} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles cho tab bar
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#272836',
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
  },
  addButton: {
    backgroundColor: '#EC407A',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});