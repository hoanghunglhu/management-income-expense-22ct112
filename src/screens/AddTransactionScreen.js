// src/screens/AddTransactionScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ExpenseCategories from "../screens/ExpenseCategories";

const AddTransactionScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense"); // "expense" hoặc "income"
  const [note, setNote] = useState("Ví của tui"); // Ghi chú mặc định

  const handleSelectCategory = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handleAddTransaction = async () => {
    if (!selectedCategory) {
      Alert.alert("Lỗi", "Vui lòng chọn danh mục!");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ!");
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      category: selectedCategory,
      icon: "💰", // Bạn có thể lấy icon từ danh mục đã chọn
      amount: type === "income" ? Number(amount) : -Number(amount),
      note,
      type,
    };

    try {
      const storedTransactions = await AsyncStorage.getItem("transactions");
      const transactions = storedTransactions
        ? JSON.parse(storedTransactions)
        : [];
      const updatedTransactions = [...transactions, newTransaction];
      await AsyncStorage.setItem(
        "transactions",
        JSON.stringify(updatedTransactions)
      );
      Alert.alert("Thành công", "Giao dịch đã được thêm!");
      setSelectedCategory(null);
      setAmount("");
      setNote("Ví của tui");
    } catch (error) {
      console.error("Error saving transaction:", error);
      Alert.alert("Lỗi", "Không thể lưu giao dịch!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, type === "expense" && styles.activeTab]}
          onPress={() => setType("expense")}
        >
          <Text
            style={[styles.tabText, type === "expense" && styles.activeTabText]}
          >
            Chi tiêu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, type === "income" && styles.activeTab]}
          onPress={() => setType("income")}
        >
          <Text
            style={[styles.tabText, type === "income" && styles.activeTabText]}
          >
            Thu nhập
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Số tiền (VNĐ)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Ghi chú"
        placeholderTextColor="#999"
        value={note}
        onChangeText={setNote}
      />
      <ExpenseCategories onSelectCategory={handleSelectCategory} />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
        <Text style={styles.addButtonText}>Thêm giao dịch</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 10,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#EC407A",
  },
  tabText: {
    color: "#999",
    fontSize: 16,
  },
  activeTabText: {
    color: "#EC407A",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#EC407A",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddTransactionScreen;
