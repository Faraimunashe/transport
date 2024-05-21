import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { CommonActions } from '@react-navigation/native';

export default function ConfirmRequestPage({ route, navigation }) {
  const tripId = route.params.data.id;
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startLat, setStartLat] = useState(null);
  const [startLon, setStartLon] = useState(null);
  const [stopLat, setStopLat] = useState(null);
  const [stopLon, setStopLon] = useState(null);

  useEffect(() => {
    const fetchRequestData = async () => {
      const token = await AsyncStorage.getItem('authToken');
      try {
        const response = await fetch(`http://178.62.207.33:8888/api/v1/trips/${tripId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setRequestData(data.trip);
        const [startlatitudeStr, startlongitudeStr] = data.trip.start_location.split(',');
        const [stoplatitudeStr, stoplongitudeStr] = data.trip.stop_location.split(',');
        setStartLat(startlatitudeStr);
        setStartLon(startlongitudeStr);
        setStopLat(stoplatitudeStr);
        setStopLon(stoplongitudeStr);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch request data');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestData();
  }, []);

  const handleConfirm = async () => {
    const token = await AsyncStorage.getItem('authToken');
    try {
      const response = await fetch(`http://178.62.207.33:8888/api/v1/trips/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        //body: JSON.stringify(requestData),
      });
      if (response.ok) {
        Alert.alert('Success', 'Request confirmed!');
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'Home' },
            ],
          })
        );
      } else {
        Alert.alert('Error', 'Failed to confirm request');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while confirming the request');
    }
  };

  const handleDelete = async () => {
    const token = await AsyncStorage.getItem('authToken');
    try {
      const response = await fetch(`http://178.62.207.33:8888/api/v1/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        Alert.alert('Success', 'Request deleted!');
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              { name: 'Home' },
            ],
          })
        );
      } else {
        Alert.alert('Error', 'Failed to delete request');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while deleting the request');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!requestData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No request data available</Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: -19.4926241,
    longitude: 29.8341228,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Confirm Your Request</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Vehicle:</Text>
            <Text style={styles.value}>{requestData.make} {requestData.model}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Registration#:</Text>
            <Text style={styles.value}>{requestData.regnum}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Driver:</Text>
            <Text style={styles.value}>{requestData.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fee:</Text>
            <Text style={styles.value}>${requestData.fee}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Passengers:</Text>
            <Text style={styles.value}>{requestData.passengers}</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: 'http://178.62.207.33:8888/storage/' + requestData.picture }} style={styles.vehicleImage} />
          </View>
        </View>
        <View style={styles.mapCard}>
          <Text style={styles.label}>Route Directions:</Text>
          <MapView style={styles.map} initialRegion={initialRegion}>
            <Marker coordinate={{ latitude: -19.4926241, longitude: 29.8341228 }} />
            <Marker coordinate={{ latitude: -19.476727678844366, longitude: 29.780601896345615 }} />
            <Polyline
              coordinates={[
                { latitude: -19.4926241, longitude: 29.8341228 },
                { latitude: -19.476727678844366, longitude: 29.780601896345615 }
              ]}
              strokeColor="#007bff"
              strokeWidth={6}
            />
          </MapView>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  mapCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  vehicleImage: {
    width: 300,
    height: 150,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  button: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
