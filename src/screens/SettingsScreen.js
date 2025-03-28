import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const categories = {
  expense: [],
  income: [
    { id: '1', name: 'Tiền lương', icon: require('../../assets/salary.png') },
    { id: '2', name: 'Tiền thưởng', icon: require('../../assets/bonus.png') },
    { id: '3', name: 'Tiền đầu tư', icon: require('../../assets/invest.png') },
    { id: '4', name: 'Tiền khác', icon: require('../../assets/othermoney.png') },
    { id: '5', name: 'Khác', icon: require('../../assets/other.png'), isAddButton: true },
  ],
};

const SettingsScreen = () => {
  const [selectedTab, setSelectedTab] = useState('income');
  const [modalVisible, setModalVisible] = useState(false);
  const [isListView, setIsListView] = useState(false); // Thêm state để kiểm soát chế độ xem

  const categoryList = [...categories[selectedTab]];

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
          <TouchableOpacity style={[styles.categoryItem, isListView && styles.listItem]}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {[
              { text: 'Xóa', icon: 'trash-outline' },
              { text: isListView ? 'Hiển thị dưới dạng lưới' : 'Hiển thị dưới dạng danh sách', icon: isListView ? 'grid-outline' : 'list-outline' },
              { text: 'Tạo bản sao', icon: 'copy-outline' },
              { text: 'Chia sẻ', icon: 'share-social-outline' },
              { text: 'Trợ giúp và phản hồi', icon: 'help-circle-outline' },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalItem}
                onPress={() => {
                  if (item.icon === 'list-outline' || item.icon === 'grid-outline') {
                    setIsListView(!isListView);
                  }
                  setModalVisible(false);
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
});

export default SettingsScreen;