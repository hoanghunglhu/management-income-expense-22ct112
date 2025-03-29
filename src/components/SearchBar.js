// src/components/SearchBar.js
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  suggestions,
  setSuggestions,
  transactions,
  setShowTransactionDetails,
  setIsFilterApplied,
}) => {
  const handleSearch = (text) => {
    setSearchTerm(text);

    if (text.length > 0) {
      const suggestionsList = transactions
        .filter((transaction) =>
          transaction.name.toLowerCase().includes(text.toLowerCase())
        )
        .map((transaction) => transaction.name)
        .filter((value, index, self) => self.indexOf(value) === index);
      setSuggestions(suggestionsList);
    } else {
      setSuggestions([]);
      setShowTransactionDetails(false);
      setIsFilterApplied(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    setShowTransactionDetails(true);
    setIsFilterApplied(true);
  };

  const handleSearchIconPress = () => {
    if (searchTerm.trim() === '') return;
    setShowTransactionDetails(true);
    setIsFilterApplied(true);
    setSuggestions([]);
  };

  const renderSuggestions = () => {
    if (suggestions.length === 0) return null;

    return (
      <View style={styles.suggestionsContainer}>
        <ScrollView
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.suggestionsScrollContainer}
        >
          {suggestions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => selectSuggestion(item)}
            >
              <Text numberOfLines={1} ellipsizeMode="tail">
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.searchWrapper}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên..."
          value={searchTerm}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={styles.searchIconContainer}
          onPress={handleSearchIconPress}
        >
          <Ionicons name="search-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      {renderSuggestions()}
    </View>
  );
};

const styles = StyleSheet.create({
  searchWrapper: {
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 42, // Giảm height để bù cho borderWidth (42 + 2 = 44)
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderWidth: 0,
  },
  searchIconContainer: {
    padding: 10,
  },
  suggestionsContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    maxHeight: 200,
    zIndex: 2,
  },
  suggestionsScrollContainer: {
    flexGrow: 1,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default SearchBar;