import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen'; 
import MainScreen from './src/screens/MainScreen'; 
import StatisticsScreen from './src/screens/StatisticsScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen'; 
// cài thư viện thêm = code : npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-vector-icons
// cài thêm thư viện npm install react-native-chart-kit
// npm install @react-native-async-storage/async-storage
const Stack = createStackNavigator();

export default function App() {
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
          component={MainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{ title: 'Thống Kê' }}
        />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
          options={{ title: 'Thêm Giao Dịch' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}