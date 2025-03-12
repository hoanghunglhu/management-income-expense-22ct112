import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen'; // Đường dẫn đến LoginScreen.js
import MainScreen from './src/screens/MainScreen';   // Đường dẫn đến MainScreen.js
// cài thư viện thêm = code : npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-vector-icons
// cài thêm thư viện npm install react-native-chart-kit
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
          options={{ headerShown: false }} // Ẩn header cho MainScreen nếu không cần
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

