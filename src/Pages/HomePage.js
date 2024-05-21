import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomePage({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get('http://178.62.207.33:8888/api/v1/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      console.log(response.data.categories);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCategories();
  }, [fetchCategories]);

  const renderVehicleItem = ({ item }) => (
    <TouchableOpacity style={styles.vehicleContainer} onPress={() => navigation.navigate('Vehicle', {data: item})}>
      <Image source={{ uri: 'http://178.62.207.33:8888/'+item.picture_url }} style={styles.vehicleImage} />
      <View style={styles.vehicleDetails}>
        <Text style={styles.vehicleName}>{item.make} {item.model}</Text>
        <Text style={styles.vehicleRegnum}>Reg No: {item.regnum}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryName}>{item.name}</Text>
      <FlatList
        data={item.vehicles}
        renderItem={renderVehicleItem}
        keyExtractor={(vehicle) => vehicle.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.vehicleSeparator} />}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      renderItem={renderCategoryItem}
      keyExtractor={(category) => category.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.categorySeparator} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  categoryContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  vehicleContainer: {
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 5
  },
  vehicleImage: {
    width: 180,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  vehicleDetails: {
    alignItems: 'center',
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  vehicleRegnum: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  vehicleSeparator: {
    width: 15,
  },
  categorySeparator: {
    height: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
