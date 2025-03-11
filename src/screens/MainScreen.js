import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const Tab = createBottomTabNavigator();

const MainScreen = () => {
  const [activeTab, setActiveTab] = useState('Home');
  
  return (
    <View style={styles.container}>
      {/* Thông tin chủ tài khoản */}
      <View style={styles.accountInfo}>
        <Text style={styles.accountText}>Chủ tài khoản: Nguyễn Văn A</Text>
      </View>
      
      {/* Chi tiết chi tiêu với ScrollView */}
      <ScrollView style={styles.detailContainer}>
        <Text>Chi tiết chi tiêu...</Text>
      </ScrollView>
      
      {/* Biểu đồ thu nhập - chi tiêu */}
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
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
      />
      
      {/* Thanh navigation cố định */}
      <View style={styles.navbar}>
        {['Home', 'Stats', 'Settings'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.navItem, activeTab === tab && styles.activeTab]}
          >
            <Ionicons name={tab === 'Home' ? 'home' : tab === 'Stats' ? 'stats-chart' : 'settings'} size={24} />
            <Text>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  accountInfo: { padding: 10, backgroundColor: '#ddd', marginBottom: 10 },
  accountText: { fontSize: 16, fontWeight: 'bold' },
  detailContainer: { flex: 1, marginBottom: 10 },
  navbar: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#ccc' },
  navItem: { alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: 'blue' },
});

export default MainScreen;