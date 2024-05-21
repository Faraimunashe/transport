import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VehiclePage({ route, navigation }) {
  const vehicleId = route.params.data.id;
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVehicleData = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No auth token found');

      const response = await axios.get(`http://178.62.207.33:8888/api/v1/vehicles/${vehicleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { vehicle, picture_url } = response.data;
      setVehicle({ ...vehicle, picture_url });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    fetchVehicleData();
  }, [fetchVehicleData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchVehicleData().then(() => setRefreshing(false));
  }, [fetchVehicleData]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {vehicle ? (
        <>
          <View style={styles.card}>
            <Image source={{ uri: 'http://178.62.207.33:8888/storage/' + vehicle.picture }} style={styles.image} />
            <Text style={styles.title}>{vehicle.make} {vehicle.model}</Text>
            <Text style={styles.description}>{vehicle.regnum}</Text>
          </View>
          <View style={styles.statusCard}>
            <Text style={styles.cardTitle}>Details</Text>
            <View style={styles.row}>
              <View style={[styles.cell, styles.striped]}>
                <Text style={[styles.description, styles.boldText]}>Capacity:</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.description}>{vehicle.capacity}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.striped]}>
                <Text style={[styles.description, styles.boldText]}>Status:</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.description}>FREE</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.striped]}>
                <Text style={[styles.description, styles.boldText]}>Driver:</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.description}>Not Allocated</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.cell, styles.striped]}>
                <Text style={[styles.description, styles.boldText]}>Fee (/km):</Text>
              </View>
              <View style={styles.cell}>
                <Text style={styles.description}>${vehicle.fee}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={() =>  navigation.navigate('Request', {data: vehicle})}>
            <Text style={styles.buttonText}>Request Vehicle</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>No vehicle data available.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    padding: 8,
  },
  striped: {
    //backgroundColor: '#f9f9f9',
  },
  boldText: {
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
