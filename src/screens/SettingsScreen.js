import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultCategories = {
  expense: [],
  income: [
    { id: '1', name: 'Tiền lương', icon: require('../../assets/salary.png') },
    { id: '2', name: 'Tiền thưởng', icon: require('../../assets/bonus.png') },
    { id: '3', name: 'Tiền đầu tư', icon: require('../../assets/invest.png') },
    { id: '4', name: 'Tiền khác', icon: require('../../assets/othermoney.png') },
    { id: '5', name: 'Thêm', icon: require('../../assets/add.png'), isAddButton: true },
  ],
};

const SettingsScreen = () => {
  const [selectedTab, setSelectedTab] = useState('income');
  const [modalVisible, setModalVisible] = useState(false);
  const [isListView, setIsListView] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false); // Kiểm tra chế độ xóa
  const [selectedCategory, setSelectedCategory] = useState(null); // Lưu item đã chọn để xóa
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Modal xác nhận xóa

  
  useEffect(() => {
    loadCategories();
  }, [selectedTab]);

  const loadCategories = async () => {
    try {
      const savedCategories = await AsyncStorage.getItem(`categories_${selectedTab}`);
      if (savedCategories) {
        const parsedData = JSON.parse(savedCategories);
        const updatedData = parsedData.map(item => ({
          ...item,
          icon: getImageSource(item.icon), // Chuyển đổi icon từ chuỗi thành require()
        }));
        setCategoryList(updatedData);
      } else {
        setCategoryList(defaultCategories[selectedTab]);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };
  
  // Hàm lấy ảnh phù hợp với React Native
  const getImageSource = (icon) => {
    if (typeof icon === 'number') {
      return icon; // Trường hợp icon đã là require()
    }
    
    if (typeof icon === 'string') {
      const localImages = {
        'default.png': require('../../assets/default.png'),
        'add.png': require('../../assets/add.png'),
        'salary.png': require('../../assets/salary.png'),
        'bonus.png': require('../../assets/bonus.png'),
        'invest.png': require('../../assets/invest.png'),
        'othermoney.png': require('../../assets/othermoney.png'),
      };
      return localImages[icon] || require('../../assets/default.png');
    }
  
    return require('../../assets/default.png'); // Dự phòng
  };
  
  
  const saveCategories = async (newCategories) => {
    try {
      await AsyncStorage.setItem(`categories_${selectedTab}`, JSON.stringify(newCategories));
    } catch (error) {
      console.error('Failed to save categories:', error);
    }
  };

  const handleAddCategory = () => {
    if (groupName.trim() === '') return;
    const newCategory = {
      id: Date.now().toString(),
      name: groupName,
      description: description,
      icon: 'default.png', 
    };
  
    const updatedCategories = [
      ...categoryList.filter(item => !item.isAddButton),
      newCategory,
      { id: '5', name: 'Thêm', icon: 'add.png', isAddButton: true },
    ];
  
    setCategoryList(updatedCategories);
    saveCategories(updatedCategories);
    setGroupName('');
    setDescription('');
    setAddModalVisible(false);
  };

  const handleEditCategory = () => {
    if (!selectedCategory) return;
    const updatedCategories = categoryList.map(item => 
      item.id === selectedCategory.id ? { ...item, name: groupName, description: description } : item
    );
    setCategoryList(updatedCategories);
    saveCategories(updatedCategories);
    setEditModalVisible(false);
  };

const handleDeleteCategory = async () => {
  if (selectedCategory) {
    const updatedCategories = categoryList.filter(
      (item) => item.id !== selectedCategory.id
    );

    try {
      // Lưu danh sách đã được cập nhật vào AsyncStorage
      await AsyncStorage.setItem(`categories_${selectedTab}`, JSON.stringify(updatedCategories));
      setCategoryList(updatedCategories);  // Cập nhật lại danh sách trong state
      setDeleteModalVisible(false);  // Đóng Modal
      setIsDeleteMode(false);  // Tắt chế độ xóa
      setSelectedCategory(null);  // Reset mục đã chọn
    } catch (error) {
      console.error("Lỗi khi lưu vào AsyncStorage", error);
    }
  }
};

  
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'expense' && styles.activeTab]}
          onPress={() => setSelectedTab('expense')}
        >
          <Text style={styles.tabText}>Chi tiêu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'income' && styles.activeTab]}
          onPress={() => setSelectedTab('income')}
        >
          <Text style={styles.tabText}>Thu nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ position: 'absolute', right: 0, padding: 10 }}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>


      <FlatList
  key={isListView ? 'list' : 'grid'}
  data={categoryList}
  keyExtractor={(item) => item.id}
  numColumns={isListView ? 1 : 2}
  contentContainerStyle={styles.listContainer}
  renderItem={({ item }) => (
    <TouchableOpacity 
      style={[styles.categoryItem, isListView && styles.listItem]}
      onPress={() => {
        if (isDeleteMode) {
          // Kiểm tra nếu mục được chọn là một trong 5 mục không thể xóa
          const isIncomeCategory = defaultCategories.income.some(incomeItem => incomeItem.id === item.id);
          
          if (isIncomeCategory) {
            alert('Không thể xóa mục này!');  // Thông báo nếu là mục không thể xóa
            setIsDeleteMode(false); // Thoát khỏi chế độ xóa
            return;  // Dừng lại không mở modal xác nhận xóa
          }

          // Nếu không phải mục không thể xóa, mở modal xác nhận xóa
          setSelectedCategory(item);
          setDeleteModalVisible(true); // Hiển thị Modal xác nhận xóa
        } else {
          if (item.isAddButton) {
            setAddModalVisible(true);
            setGroupName('');
            setDescription('');
            setSelectedCategory(item); // Lưu item vào state
          }
        }
      }}
      onLongPress={() => {
        if (!item.isAddButton && !isDeleteMode) { 
          console.log("Long press detected on:", item.name);
          setSelectedCategory(item);
          setGroupName(item.name);
          setDescription(item.description || '');
          setEditModalVisible(true); // Mở modal chỉnh sửa khi nhấn giữ
        }
      }} // Nhấn giữ để chỉnh sửa
    >
      <Image source={getImageSource(item.icon)} style={styles.icon} />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  )}
/>

      {/* Modal cài đặt */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {[{ text: 'Xóa', icon: 'trash-outline' },
              { text: isListView ? 'Hiển thị dưới dạng lưới' : 'Hiển thị dưới dạng danh sách', icon: isListView ? 'grid-outline' : 'list-outline' },
              { text: 'Tạo bản sao', icon: 'copy-outline' },
              { text: 'Chia sẻ', icon: 'share-social-outline' },
              { text: 'Trợ giúp và phản hồi', icon: 'help-circle-outline' }].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalItem}
                onPress={() => {
                  if (item.icon === 'list-outline' || item.icon === 'grid-outline') {
                    setIsListView(!isListView);
                  }
                  if (item.icon === 'trash-outline') {
                    setIsDeleteMode(true);  // Kích hoạt chế độ xóa
                  }
                  setModalVisible(false); // Đóng modal cài đặt
                }}
              >
                <Text style={styles.modalText}>{item.text}</Text>
                <Ionicons name={item.icon} size={24} color="white" />
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal thêm nhóm phân loại */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.addModalContainer}>
          <View style={styles.addModalContent}>
            <Text style={styles.modalText}>Thêm nhóm phân loại</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Tên nhóm phân loại" 
              placeholderTextColor="#bbb" 
              value={groupName} 
              onChangeText={setGroupName} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Mô tả" 
              placeholderTextColor="#bbb" 
              value={description} 
              onChangeText={setDescription} 
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setAddModalVisible(false)}>
                <Text style={styles.modalCloseText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
                <Text style={styles.modalCloseText}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal chỉnh sửa danh mục */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.editModalContainer}>
          <View style={styles.editModalContent}>
            <Text style={styles.modalText}>Chỉnh sửa nhóm phân loại</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Tên nhóm" 
              placeholderTextColor="#bbb" 
              value={groupName} 
              onChangeText={setGroupName} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Mô tả" 
              placeholderTextColor="#bbb" 
              value={description} 
              onChangeText={setDescription} 
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.modalCloseText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={handleEditCategory}>
                <Text style={styles.modalCloseText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal xác nhận xóa */}
<Modal
  animationType="fade"
  transparent={true}
  visible={deleteModalVisible}
  onRequestClose={() => setDeleteModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      {selectedCategory ? (
        <Text style={styles.modalText}>Bạn có chắc chắn muốn xóa "{selectedCategory.name}" không?</Text>
      ) : (
        <Text style={styles.modalText}>Vui lòng chọn một danh mục để xóa.</Text>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => setDeleteModalVisible(false)}>
          <Text style={styles.modalCloseText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={handleDeleteCategory}>
          <Text style={styles.modalCloseText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', 
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#EC407A',
  },
  tabText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  listContainer: {
    justifyContent: 'center',
  },
  categoryItem: {
    flex: 1,
    backgroundColor: '#1E1E2E',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'flex-start',
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  categoryText: {
    padding: 10,
    fontSize: 18,
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 22, 22, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1E1E2E',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  modalText: {
    color: 'white',
    fontSize: 16,
  },
  modalClose: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#EC407A',
    fontSize: 16,
  },
  addModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 22, 22, 0.5)',
  },
  addModalContent: {
    backgroundColor: '#1E1E2E',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#2E2E3E',
    color: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#444',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#444',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 5,
  },
  editModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 22, 22, 0.5)',
  },
  editModalContent: {
    backgroundColor: '#1E1E2E',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  deleteModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 22, 22, 0.5)', // Màu nền mờ cho Modal
  },
  deleteModalContent: {
    backgroundColor: '#2E2E3E', // Nền của Modal
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  deleteModalText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
  deleteButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#444',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#444',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 5,
  },
});

export default SettingsScreen;
