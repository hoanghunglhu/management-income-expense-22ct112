// src/screens/HomeScreen.js
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

// Get screen width for chart
const screenWidth = Dimensions.get('window').width;

// Màu sắc nhất quán trong toàn ứng dụng
const COLORS = {
  income: '#2ECC71', // Màu xanh lá cho thu nhập
  expense: '#EC407A', // Màu hồng/tím cho chi tiêu
};

const HomeScreen = () => {
  // State để quản lý thanh expansion (ngày được mở rộng)
  const [expandedDate, setExpandedDate] = useState(null);
  
  // PHẦN DISPLAY CHART - BEGIN
  // Mock data for chart với dữ liệu chính xác từ các giao dịch
  const chartData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        data: [0, 0, 0, 30000000, 0, 0], // Thu nhập (chỉ có tháng 4 có tiền lương)
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Màu xanh lá cho thu nhập
        strokeWidth: 2
      },
      {
        data: [0, 0, 0, 5920000, 0, 0], // Chi tiêu (tổng các khoản chi trong tháng 4)
        color: (opacity = 1) => `rgba(236, 64, 122, ${opacity})`, // Màu hồng cho chi tiêu
        strokeWidth: 2
      }
    ],
    legend: ['Thu nhập', 'Chi tiêu']
  };
  // PHẦN DISPLAY CHART - END

  // PHẦN THANH EXPANSION - BEGIN
  // Mock transactions data với dữ liệu được sắp xếp theo thứ tự thời gian
  const transactions = [
    {
      date: '22/04/2022',
      dayOfWeek: 'Thứ sáu',
      items: [
        {
          id: 1,
          icon: '🍔',
          title: 'Ăn uống',
          subtitle: 'Riêng tôi',
          amount: '-100,000 đ',
          wallet: 'Ví của tôi',
          type: 'expense' // Chi tiêu
        },
        {
          id: 2,
          icon: '🎁',
          title: 'Du lịch',
          subtitle: 'Gia đình',
          amount: '-5,000,000 đ',
          wallet: 'Ví của tôi',
          type: 'expense' // Chi tiêu
        },
        {
          id: 3,
          icon: '💰',
          title: 'Tiền lương',
          subtitle: 'Riêng tôi',
          amount: '+30,000,000 đ',
          wallet: 'Ví của tôi',
          type: 'income' // Thu nhập
        },
        {
          id: 7,
          icon: '🌿',
          title: 'Chăm sóc thú cưng',
          subtitle: 'Thú cưng',
          amount: '-500,000 đ',
          wallet: 'Ví của tôi',
          type: 'expense' // Chi tiêu
        }
      ]
    },
    {
      date: '25/04/2022',
      dayOfWeek: 'Thứ hai',
      items: [
        {
          id: 4,
          icon: '👩‍⚕️',
          title: 'Chữa bệnh',
          subtitle: 'Thú cưng',
          amount: '-500,000 đ',
          wallet: 'Ví của tôi',
          type: 'expense' // Chi tiêu
        },
        {
          id: 5,
          icon: '🚌',
          title: 'Di chuyển',
          subtitle: 'Riêng tôi',
          amount: '-20,000 đ',
          wallet: 'Ví của tôi',
          type: 'expense' // Chi tiêu
        },
        {
          id: 6,
          icon: '💧',
          title: 'Hóa đơn nước',
          subtitle: 'Riêng tôi',
          amount: '-300,000 đ',
          wallet: 'Ví của tôi',
          type: 'expense' // Chi tiêu
        }
      ]
    }
  ];

  // Hàm mở rộng/thu gọn khi click vào ngày
  const toggleExpand = (date) => {
    if (expandedDate === date) {
      setExpandedDate(null);
    } else {
      setExpandedDate(date);
    }
  };
  // PHẦN THANH EXPANSION - END

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/40' }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.greeting}>Hi,</Text>
            <Text style={styles.userName}>Minh Hoa</Text>
          </View>
        </View>
      </View>

      {/* PHẦN DISPLAY CHART - BEGIN */}
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
        
        {/* Biểu đồ với trục Y hiển thị giá trị tiền */}
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
            width={screenWidth - 70} // Thu nhỏ để có chỗ cho trục Y
            height={180}
            chartConfig={{
              backgroundColor: '#272836',
              backgroundGradientFrom: '#272836',
              backgroundGradientTo: '#272836',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
              },
              // Định dạng đơn vị tiền tệ
              formatYLabel: (value) => {
                return Number(value / 1000000).toFixed(0) + 'tr';
              },
              // Hiển thị tooltip khi người dùng chạm vào một điểm
              propsForLabels: {
                fontSize: 10,
              },
            }}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLabels={true}
            withHorizontalLabels={false}
            fromZero={true}
            // Bật tính năng tooltip để hiển thị giá trị khi chạm vào điểm
            withShadow={false}
            onDataPointClick={({value, dataset, getColor}) => {
              // Hiển thị popup giá trị khi người dùng chạm vào điểm
              if (value > 0) {
                alert(value.toLocaleString('vi-VN') + ' đ');
              }
            }}
          />
        </View>
      </View>
      {/* PHẦN DISPLAY CHART - END */}

      {/* PHẦN THANH EXPANSION - BEGIN */}
      <ScrollView style={styles.transactionsContainer}>
        {transactions.map((group, index) => (
          <View key={index} style={styles.transactionGroup}>
            <TouchableOpacity 
              style={styles.dateHeader} 
              onPress={() => toggleExpand(group.date)}
            >
              <Text style={styles.dateText}>{group.date}</Text>
              <Text style={styles.dayText}>{group.dayOfWeek}</Text>
            </TouchableOpacity>
            
            {(expandedDate === group.date || expandedDate === null) && group.items.map((item) => (
              <View key={item.id} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Text style={styles.emoji}>{item.icon}</Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>{item.title}</Text>
                  <Text style={styles.transactionSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.amountText, 
                    { color: item.type === 'income' ? COLORS.income : COLORS.expense }
                  ]}>
                    {item.amount}
                  </Text>
                  <Text style={styles.walletText}>{item.wallet}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      {/* PHẦN THANH EXPANSION - END */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e2d',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#59C1BD',
  },
  greeting: {
    color: '#fff',
    fontSize: 14,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Styles for chart display
  chartContainer: {
    backgroundColor: '#272836',
    borderRadius: 12,
    padding: 15,
    margin: 16,
    marginTop: 5,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    color: '#fff',
    fontSize: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  // Styles for Y-axis
  chartWithYAxis: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxis: {
    width: 40,
    height: 180,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 5,
    paddingVertical: 10,
  },
  yAxisLabel: {
    color: '#fff',
    fontSize: 10,
  },
  // Styles for expansion section
  transactionsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  transactionGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#444',
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayText: {
    color: '#aaa',
    fontSize: 14,
  },
  transactionItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3C3C4D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  transactionTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  transactionSubtitle: {
    color: '#aaa',
    fontSize: 14,
  },
  transactionAmount: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  walletText: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default HomeScreen;