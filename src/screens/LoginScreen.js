import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!email || !password) {
      setError('Email và mật khẩu không được để trống');
      return false;
    }
    if (!email.includes('@') && isNaN(email)) {
      setError('Email hoặc số điện thoại không hợp lệ');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Đăng nhập thành công với:', email, password);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email hoặc Số điện thoại</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Nhập email hoặc số điện thoại"
      />

      <Text>Mật khẩu</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Nhập mật khẩu"
          secureTextEntry={hidePassword}
        />
        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={24} />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, flex: 1 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center' },
  button: { backgroundColor: 'blue', padding: 10, marginTop: 10 },
  buttonText: { color: 'white', textAlign: 'center' },
  error: { color: 'red', marginTop: 5 },
});

export default LoginScreen;