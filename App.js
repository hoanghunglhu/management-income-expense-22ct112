import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import mhdmc from "./manhinhdanhmucchi";
const Tab = createBottomTabNavigator();

// Màn hình giả lập
const TransactionsScreen = () => <View><Text>Giao dịch</Text></View>;
const WalletScreen = () => <View><Text>Ví tiền</Text></View>;
const StatisticsScreen = () => <View><Text>Thống kê</Text></View>;


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
      >
        <Tab.Screen name="Giao dịch" component={TransactionsScreen} />
        <Tab.Screen name="Ví tiền" component={WalletScreen} />
        <Tab.Screen name="Thống kê" component={StatisticsScreen} />
        <Tab.Screen name="Cài đặt" component={mhdmc} />
       
      </Tab.Navigator>
    </NavigationContainer>
  );
}