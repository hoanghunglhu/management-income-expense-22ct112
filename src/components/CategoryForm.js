import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CategoryForm = ({ category, onSave, onCancel, type }) => {
  const isEditMode = !!category;
  const initialFormState = category 
    ? { ...category }
    : { name: '', description: '', status: true };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Hàm cập nhật giá trị của form
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Xóa lỗi khi người dùng sửa
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };

  // Hàm kiểm tra hợp lệ của form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên danh mục';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Tên danh mục không được vượt quá 50 ký tự';
    }
    
    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Mô tả không được vượt quá 200 ký tự';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý khi lưu form
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Giả lập API call
    setTimeout(() => {
      onSave(formData);
      setLoading(false);
    }, 500);
  };

  // Màu sắc theo loại danh mục (thu/chi)
  const getPrimaryColor = () => {
    return type === 'expense' ? '#007BFF' : '#FF6B6B';
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isEditMode ? 'Sửa danh mục' : 'Thêm danh mục mới'}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onCancel}
            >
              <Icon name="close" size={24} color="#757575" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Tên danh mục <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Nhập tên danh mục"
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Mô tả</Text>
              <TextInput
                style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                value={formData.description}
                onChangeText={(text) => handleChange('description', text)}
                placeholder="Nhập mô tả (không bắt buộc)"
                multiline
                numberOfLines={4}
              />
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Trạng thái</Text>
              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.status && [styles.activeStatusButton, { backgroundColor: getPrimaryColor() }]
                  ]}
                  onPress={() => handleChange('status', true)}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      formData.status && styles.activeStatusButtonText
                    ]}
                  >
                    Hoạt động
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    !formData.status && [styles.activeStatusButton, { backgroundColor: getPrimaryColor() }]
                  ]}
                  onPress={() => handleChange('status', false)}
                >
                  <Text
                    style={[
                      styles.statusButtonText,
                      !formData.status && styles.activeStatusButtonText
                    ]}
                  >
                    Không hoạt động
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: getPrimaryColor() }]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>
                  {isEditMode ? 'Cập nhật' : 'Thêm'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  required: {
    color: '#FF5252',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF5252',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 14,
    marginTop: 4,
  },
  statusButtons: {
    flexDirection: 'row',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 8,
  },
  activeStatusButton: {
    borderColor: 'transparent',
  },
  statusButtonText: {
    color: '#757575',
    fontWeight: '500',
  },
  activeStatusButtonText: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  saveButton: {
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#757575',
    fontWeight: '500',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default CategoryForm;