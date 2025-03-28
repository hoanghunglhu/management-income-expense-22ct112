import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';

const categories = [
    { id: '1', name: 'Thực phẩm', icon: require('./assets/icon/thucpham.png') },
    { id: '2', name: 'Chế độ ăn', icon: require('./assets/icon/chedoan.png') },
    { id: '3', name: 'Di chuyển', icon: require('./assets/icon/dichuyen.png') },
    { id: '4', name: 'Thời trang', icon: require('./assets/icon/thoitrang.png') },
    { id: '5', name: 'Chế độ uống', icon: require('./assets/icon/chedouong.png') },
    { id: '6', name: 'Thú cưng', icon: require('./assets/icon/thucung.png') },
    { id: '7', name: 'Giáo dục', icon: require('./assets/icon/giaoduc.png') },
    { id: '8', name: 'Sức khỏe', icon: require('./assets/icon/suckhoe.png') },
    { id: '9', name: 'Du lịch', icon: require('./assets/icon/dulich.png') },
    { id: '10', name: 'Giải trí', icon: require('./assets/icon/giaitri.png') },
    { id: '11', name: 'Hóa đơn nước', icon: require('./assets/icon/hoadonnuoc.png') },
    { id: '12', name: 'Hóa đơn điện', icon: require('./assets/icon/hoadondien.png') },
    { id: '13', name: 'Hóa đơn', icon: require('./assets/icon/hoadon.png') },
    { id: '14', name: 'Quà tặng', icon: require('./assets/icon/quatang.png') },
    { id: '15', name: 'Thêm', icon: require('./assets/icon/them.png') }
];

const ExpenseCategoriesScreen = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  item: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    margin: 8,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  text: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ExpenseCategoriesScreen;
