import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import EditCategoryModal from '../../src/components/EditCategoryModal'

const categoriesData = [
    { id: '1', name: 'Thực phẩm', icon: require('../assets/icon/thucpham.png') },
    { id: '2', name: 'Chế độ ăn', icon: require('../assets/icon/chedoan.png') },
    { id: '3', name: 'Di chuyển', icon: require('../assets/icon/dichuyen.png') },
    { id: '4', name: 'Thời trang', icon: require('../assets/icon/thoitrang.png') },
    { id: '5', name: 'Chế độ uống', icon: require('../assets/icon/chedouong.png') },
];

const ExpenseCategoriesScreen = () => {
    const [categories, setCategories] = useState(categoriesData);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleLongPress = (category) => {
        setSelectedCategory(category);
        setNewCategoryName(category.name);
        setModalVisible(true);
    };

    const handleSave = () => {
        setCategories((prevCategories) =>
            prevCategories.map((cat) =>
                cat.id === selectedCategory.id ? { ...cat, name: newCategoryName } : cat
            )
        );
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                numColumns={3}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onLongPress={() => handleLongPress(item)}>
                        <Image source={item.icon} style={styles.icon} />
                        <Text style={styles.text}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* Gọi modal chỉnh sửa */}
            <EditCategoryModal
                visible={modalVisible}
                category={selectedCategory}
                newName={newCategoryName}
                setNewName={setNewCategoryName}
                onSave={handleSave}
                onCancel={() => setModalVisible(false)}
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
