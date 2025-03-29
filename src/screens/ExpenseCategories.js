// src/components/ExpenseCategories.js
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Dữ liệu danh mục chi tiêu ban đầu
const initialCategories = [
  { id: "1", name: "Thực phẩm", icon: "🍎" },
  { id: "2", name: "Chế độ ăn", icon: "🍽️" },
  { id: "3", name: "Đi chuyển", icon: "✈️" },
  { id: "4", name: "Thời trang", icon: "👗" },
  { id: "5", name: "Chế độ uống", icon: "🥤" },
  { id: "6", name: "Thú cưng", icon: "🐾" },
  { id: "7", name: "Giáo dục", icon: "🎓" },
  { id: "8", name: "Sức khỏe", icon: "👨‍⚕️" },
  { id: "9", name: "Du lịch", icon: "🏖️" },
  { id: "10", name: "Giải trí", icon: "🎮" },
  { id: "11", name: "Hóa đơn nước", icon: "💧" },
  { id: "12", name: "Hóa đơn điện", icon: "💡" },
  { id: "13", name: "Hóa đơn", icon: "🌐" },
  { id: "14", name: "Quà tặng", icon: "💝" },
  { id: "15", name: "", icon: "➕" }, // Nút thêm danh mục
];

const ExpenseCategories = ({ onSelectCategory }) => {
  // Sử dụng state để quản lý danh sách danh mục
  const [categories, setCategories] = useState(initialCategories);

  // Hàm xử lý xóa danh mục
  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.touchableArea}
        onPress={() => onSelectCategory(item.name)}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
      {/* Hiển thị nút xóa nếu không phải là nút "Thêm danh mục" */}
      {item.icon !== "➕" && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteCategory(item.id)}
        >
          <Icon name="close" size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chi tiết</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 10,
    position: "relative", // Để định vị nút xóa
  },
  touchableArea: {
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    fontSize: 30,
  },
  name: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#EC407A", // Màu hồng giống bottom tab
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ExpenseCategories;
