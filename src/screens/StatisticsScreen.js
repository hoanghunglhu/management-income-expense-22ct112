// src/screens/StatisticsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatisticsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sổ giao dịch</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e2d',
  },
  text: {
    fontSize: 18,
    color: '#fff',
  },
});

export default StatisticsScreen;