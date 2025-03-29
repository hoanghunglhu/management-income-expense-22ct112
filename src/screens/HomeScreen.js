// src/screens/HomeScreen.js
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import SearchAndFilter from './SearchAndFilter';

const screenWidth = Dimensions.get('window').width;

const COLORS = {
  income: '#2ECC71',
  expense: '#EC407A',
};

const HomeScreen = ({ navigation, transactions }) => {
  const [expandedDate, setExpandedDate] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(
    transactions.flatMap((group) =>
      group.items.map((item) => ({
        ...item,
        date: group.date,
        dayOfWeek: group.dayOfWeek,
      }))
    )
  );

  const chartData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0], // Thu nhập
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [0, 0, 0, 0, 0, 0], // Chi tiêu
        color: (opacity = 1) => `rgba(236, 64, 122, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Thu nhập', 'Chi tiêu'],
  };

  // Cập nhật dữ liệu biểu đồ dựa trên transactions
  transactions.forEach((group) => {
    const month = parseInt(group.date.split('/')[1], 10);
    const monthIndex = month - 1;

    group.items.forEach((item) => {
      const amount = parseInt(item.amount.replace(/[^0-9]/g, ''), 10);
      if (item.type === 'income') {
        chartData.datasets[0].data[monthIndex] += amount;
      } else {
        chartData.datasets[1].data[monthIndex] += amount;
      }
    });
  });

  // Chuyển filteredTransactions thành định dạng nhóm theo ngày
  const groupedTransactions = filteredTransactions.reduce((acc, item) => {
    const date = item.date;
    const existingGroup = acc.find((group) => group.date === date);
    const dayOfWeek = item.dayOfWeek || new Date(
      date.split('/')[2], // Năm
      date.split('/')[1] - 1, // Tháng (trừ 1 vì tháng trong JS bắt đầu từ 0)
      date.split('/')[0] // Ngày
    ).toLocaleDateString('vi-VN', { weekday: 'long' });

    if (existingGroup) {
      existingGroup.items.push(item);
    } else {
      acc.push({
        date,
        dayOfWeek,
        items: [item],
      });
    }
    return acc;
  }, []);

  const toggleExpand = (date) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.avatar} />
          <View>
            <Text style={styles.greeting}>Hi,</Text>
            <Text style={styles.userName}>Minh Hoa</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: COLORS.income }]} />
            <Text style={styles.legendText}>Thu nhập</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: COLORS.expense }]} />
            <Text style={styles.legendText}>Chi tiêu</Text>
          </View>
        </View>

        <View style={styles.chartWithYAxis}>
          <View style={styles.yAxis}>
            <Text style={styles.yAxisLabel}>30tr</Text>
            <Text style={styles.yAxisLabel}>24tr</Text>
            <Text style={styles.yAxisLabel}>18tr</Text>
            <Text style={styles.yAxisLabel}>12tr</Text>
            <Text style={styles.yAxisLabel}>6tr</Text>
            <Text style={styles.yAxisLabel}>0</Text>
          </View>

          <LineChart
            data={chartData}
            width={screenWidth - 70}
            height={180}
            chartConfig={{
              backgroundColor: '#272836',
              backgroundGradientFrom: '#272836',
              backgroundGradientTo: '#272836',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '6', strokeWidth: '2' },
              formatYLabel: (value) => `${Number(value / 1000000).toFixed(0)}tr`,
              propsForLabels: { fontSize: 10 },
            }}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLabels={true}
            withHorizontalLabels={false}
            fromZero={true}
            withShadow={false}
            onDataPointClick={({ value }) => {
              if (value > 0) alert(value.toLocaleString('vi-VN') + ' đ');
            }}
          />
        </View>
      </View>

      {/* Thanh tìm kiếm và bộ lọc */}
      <SearchAndFilter
        transactions={transactions}
        onFilterChange={(filtered) => setFilteredTransactions(filtered)}
      />

      <ScrollView style={styles.transactionsContainer}>
        {groupedTransactions.length > 0 ? (
          groupedTransactions.map((group, index) => (
            <View key={index} style={styles.transactionGroup}>
              <TouchableOpacity style={styles.dateHeader} onPress={() => toggleExpand(group.date)}>
                <Text style={styles.dateText}>{group.date}</Text>
                <Text style={styles.dayText}>{group.dayOfWeek}</Text>
              </TouchableOpacity>

              {(expandedDate === group.date || expandedDate === null) &&
                group.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.transactionItem}
                    onPress={() =>
                      navigation.navigate('AddTransaction', { transactionToEdit: item, date: group.date })
                    }
                  >
                    <View style={styles.transactionIcon}>
                      <Text style={styles.emoji}>{item.icon}</Text>
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle}>{item.title}</Text>
                      <Text style={styles.transactionSubtitle}>{item.subtitle}</Text>
                    </View>
                    <View style={styles.transactionAmount}>
                      <Text
                        style={[
                          styles.amountText,
                          { color: item.type === 'income' ? COLORS.income : COLORS.expense },
                        ]}
                      >
                        {item.amount}
                      </Text>
                      <Text style={styles.walletText}>{item.wallet}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>Không tìm thấy giao dịch nào.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e2d' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#59C1BD' },
  greeting: { color: '#fff', fontSize: 14 },
  userName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  chartContainer: { backgroundColor: '#272836', borderRadius: 12, padding: 15, margin: 16, marginTop: 5 },
  chartLegend: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  legendColor: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  legendText: { color: '#fff', fontSize: 12 },
  chart: { marginVertical: 8, borderRadius: 16 },
  chartWithYAxis: { flexDirection: 'row', alignItems: 'center' },
  yAxis: { width: 40, height: 180, justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: 5, paddingVertical: 10 },
  yAxisLabel: { color: '#fff', fontSize: 10 },
  transactionsContainer: { flex: 1, paddingHorizontal: 16 },
  transactionGroup: { marginBottom: 16 },
  dateHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#444' },
  dateText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  dayText: { color: '#aaa', fontSize: 14 },
  transactionItem: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  transactionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#3C3C4D', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  emoji: { fontSize: 20 },
  transactionInfo: { flex: 1, justifyContent: 'center' },
  transactionTitle: { color: '#fff', fontSize: 16, marginBottom: 4 },
  transactionSubtitle: { color: '#aaa', fontSize: 14 },
  transactionAmount: { alignItems: 'flex-end', justifyContent: 'center' },
  amountText: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  walletText: { color: '#aaa', fontSize: 14 },
  noDataText: { color: '#aaa', fontSize: 16, textAlign: 'center', marginTop: 20 },
});

export default HomeScreen;