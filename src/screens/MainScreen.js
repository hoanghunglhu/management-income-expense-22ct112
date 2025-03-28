import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import StatisticsScreen from './StatisticsScreen';
import AddTransactionScreen from './AddTransactionScreen';
import ReportsScreen from './ReportsScreen';
import SettingsScreen from './SettingsScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const MainScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#EC407A',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Tổng kê',
                    tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarLabel: 'Sổ giao dịch',
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{
          tabBarLabel: 'Thống kê',
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({ color, size }) => (
            <View style={styles.addButton}>
              <Icon name="plus" color="#fff" size={20} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarLabel: 'Báo cáo',
          tabBarLabelStyle: {
            fontSize: 12,
          },
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
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#272836',
    borderTopWidth: 0,
    elevation: 0,
    height: 55,
  },
  addButton: {
    backgroundColor: '#EC407A',
    width: 25,
    height: 25,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen;