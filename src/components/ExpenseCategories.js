// src/components/TransactionCategories.js
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal, // Import Modal
  TextInput, // Import TextInput
  Button, // Import Button
  Alert, // Import Alert for feedback/validation
  ScrollView, // Import ScrollView for potentially long content
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// --- Initial Data ---
const initialExpenseCategories = [
  { id: "e1", name: "Thực phẩm", icon: "🍎", type: "expense" },
  { id: "e2", name: "Chế độ ăn", icon: "🍽️", type: "expense" },
  { id: "e3", name: "Đi chuyển", icon: "✈️", type: "expense" },
  { id: "e4", name: "Thời trang", icon: "👗", type: "expense" },
  { id: "e5", name: "Chế độ uống", icon: "🥤", type: "expense" },
  { id: "e6", name: "Thú cưng", icon: "🐾", type: "expense" },
  { id: "e7", name: "Giáo dục", icon: "🎓", type: "expense" },
  { id: "e8", name: "Sức khỏe", icon: "👨‍⚕️", type: "expense" },
  { id: "e9", name: "Du lịch", icon: "🏖️", type: "expense" },
  { id: "e10", name: "Giải trí", icon: "🎮", type: "expense" },
  { id: "e11", name: "Hóa đơn nước", icon: "💧", type: "expense" },
  { id: "e12", name: "Hóa đơn điện", icon: "💡", type: "expense" },
  { id: "e13", name: "Hóa đơn", icon: "🌐", type: "expense" },
  { id: "e14", name: "Quà tặng", icon: "💝", type: "expense" },
  { id: "e_add", name: "", icon: "➕", type: "expense", isAddButton: true }, // Add button for expenses
];

const initialIncomeCategories = [
  { id: "i1", name: "Lương", icon: "💰", type: "income" },
  { id: "i2", name: "Thưởng", icon: "🎁", type: "income" },
  { id: "i3", name: "Bán đồ", icon: "🛒", type: "income" },
  { id: "i4", name: "Quà tặng", icon: "💝", type: "income" },
  { id: "i5", name: "Đầu tư", icon: "📈", type: "income" },
  { id: "i_add", name: "", icon: "➕", type: "income", isAddButton: true }, // Add button for income
];

// --- Component ---
const TransactionCategories = ({ onSelectCategory }) => {
  const [expenseCategories, setExpenseCategories] = useState(initialExpenseCategories);
  const [incomeCategories, setIncomeCategories] = useState(initialIncomeCategories);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("❓"); // Default icon
  const [categoryTypeToAdd, setCategoryTypeToAdd] = useState("expense"); // 'expense' or 'income'

  // --- Handlers ---

  // Handle deleting a category
  const handleDeleteCategory = (id, type) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa danh mục này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: () => {
            if (type === "expense") {
              setExpenseCategories((prev) =>
                prev.filter((category) => category.id !== id)
              );
            } else {
              setIncomeCategories((prev) =>
                prev.filter((category) => category.id !== id)
              );
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // Handle opening the modal to add a category
  const handleOpenAddModal = (type) => {
    setCategoryTypeToAdd(type);
    setNewCategoryName(""); // Reset fields
    setNewCategoryIcon("❓"); // Reset icon
    setModalVisible(true);
  };

  // Handle adding the new category
  const handleAddNewCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên danh mục.");
      return;
    }

    const newCategory = {
      // Generate a simple unique ID (consider using uuid in a real app)
      id: `${categoryTypeToAdd}_${Date.now()}`,
      name: newCategoryName.trim(),
      icon: newCategoryIcon.trim() || "❓", // Use default if empty
      type: categoryTypeToAdd,
    };

    if (categoryTypeToAdd === "expense") {
      // Add before the "Add" button
      setExpenseCategories((prev) => {
        const addButtonIndex = prev.findIndex((cat) => cat.isAddButton);
        const updatedCategories = [...prev];
        updatedCategories.splice(addButtonIndex, 0, newCategory);
        return updatedCategories;
      });
    } else {
      // Add before the "Add" button
      setIncomeCategories((prev) => {
        const addButtonIndex = prev.findIndex((cat) => cat.isAddButton);
        const updatedCategories = [...prev];
        updatedCategories.splice(addButtonIndex, 0, newCategory);
        return updatedCategories;
      });
    }

    setModalVisible(false); // Close modal
  };

  // --- Render Item Function ---
  const renderItem = ({ item }) => {
    // Don't render delete button for the "Add" item
    const showDeleteButton = !item.isAddButton;

    const handlePress = () => {
      if (item.isAddButton) {
        handleOpenAddModal(item.type); // Open modal for expense or income
      } else if (onSelectCategory) {
        onSelectCategory({ name: item.name, type: item.type }); // Pass name and type
      }
    };

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity style={styles.touchableArea} onPress={handlePress}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{item.icon}</Text>
          </View>
          {/* Only show name if it's not the add button */}
          {!item.isAddButton && <Text style={styles.name}>{item.name}</Text>}
        </TouchableOpacity>
        {/* Show delete button only for regular items */}
        {showDeleteButton && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteCategory(item.id, item.type)}
          >
            <Icon name="close" size={14} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // --- Component Return ---
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Expense Section */}
        <Text style={styles.header}>Chi Tiêu</Text>
        <FlatList
          data={expenseCategories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.list}
          scrollEnabled={false} // Disable FlatList scrolling, use ScrollView
        />

        {/* Income Section */}
        <Text style={[styles.header, styles.incomeHeader]}>Thu Nhập</Text>
        <FlatList
          data={incomeCategories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.list}
          scrollEnabled={false} // Disable FlatList scrolling, use ScrollView
        />

        {/* Add Category Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalCenteredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Thêm danh mục {categoryTypeToAdd === "expense" ? "Chi Tiêu" : "Thu Nhập"}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Tên danh mục (ví dụ: Mua sắm)"
                placeholderTextColor="#aaa"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />
              <TextInput
                style={styles.input}
                placeholder="Biểu tượng (ví dụ: 🛒 hoặc để trống)"
                placeholderTextColor="#aaa"
                value={newCategoryIcon}
                onChangeText={setNewCategoryIcon}
              />
              <View style={styles.modalButtonContainer}>
                 <Button title="Hủy" onPress={() => setModalVisible(false)} color="#EC407A" />
                 <View style={{ width: 20 }} /> {/* Spacer */}
                 <Button title="Thêm" onPress={handleAddNewCategory} color="#4CAF50" />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  scrollView: {
      flex: 1,
      backgroundColor: "#1a1a1a",
  },
  container: {
    flex: 1,
    padding: 15, // Increased padding
  },
  header: {
    fontSize: 22, // Slightly larger header
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15, // More space below header
    marginTop: 10, // Add some top margin
  },
  incomeHeader: {
      marginTop: 30, // More space above income header
  },
  list: {
    paddingBottom: 10, // Reduced padding as ScrollView handles overall scroll
  },
  itemContainer: {
    flex: 1,
    margin: 6, // Slightly increased margin
    // Removed padding to let touchableArea handle it
    backgroundColor: "#333",
    borderRadius: 12, // Slightly more rounded
    aspectRatio: 1, // Make items square-ish
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    position: "relative",
  },
  touchableArea: {
    flex: 1, // Take up all space for touch
    padding: 10, // Add padding inside touchable area
    alignItems: "center",
    justifyContent: 'center', // Center content within touchable area
    width: '100%', // Ensure touchable area fills container
    height: '100%',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#555", // Darker background for icon
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8, // More space below icon
  },
  icon: {
    fontSize: 28, // Slightly smaller icon if needed
  },
  name: {
    fontSize: 13, // Slightly smaller text
    color: "#eee", // Lighter text color
    textAlign: "center",
    marginTop: 4, // Space between icon and text
  },
  deleteButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#EC407A",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure button is clickable on top
  },
  // Modal Styles
  modalCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: "#333", // Dark modal background
    borderRadius: 15,
    padding: 30, // More padding
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%', // Control modal width
  },
  modalText: {
    marginBottom: 20, // More space below title
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // White text
  },
  input: {
    height: 45, // Taller input
    borderColor: "#555", // Darker border
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15, // More padding inside input
    width: "100%",
    borderRadius: 8, // Rounded corners for input
    color: "#fff", // White text input
    backgroundColor: '#444', // Slightly lighter input background
  },
   modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Space out buttons
    marginTop: 15,
    width: '100%',
  },
});

export default TransactionCategories;