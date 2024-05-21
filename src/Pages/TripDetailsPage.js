import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function TripDetailsPage({ route }) {
  const { tripId } = route.params;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reportMessage, setReportMessage] = useState('');

  useEffect(() => {
    fetchTripDetails();
  }, []);

  useEffect(() => {
    if (trip && trip.status === 'ACCEPTED') {
      fetchCurrentLocation();
    }
  }, [trip]);

  useEffect(() => {
    if (trip && currentLocation) {
      fetchRoute();
    }
  }, [currentLocation]);

  const fetchTripDetails = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('authToken');
    try {
      const response = await fetch(`http://178.62.207.33:8888/api/v1/trips/${tripId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTrip(data.trip);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch trip details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentLocation = async () => {
    const token = await AsyncStorage.getItem('authToken');
    try {
      const response = await fetch(`http://178.62.207.33:8888/api/v1/trips/${tripId}/location`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCurrentLocation({
        latitude: parseFloat(data.location.lat),
        longitude: parseFloat(data.location.lon),
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch current location');
    }
  };

  const fetchRoute = async () => {
    // Example of using static route coordinates
    // Replace this with a call to a routing API to get dynamic route coordinates
    const startLocation = {
      latitude: parseFloat(trip.start_location.split(",")[0]),
      longitude: parseFloat(trip.start_location.split(",")[1]),
    };

    const stopLocation = {
      latitude: parseFloat(trip.stop_location.split(",")[0]),
      longitude: parseFloat(trip.stop_location.split(",")[1]),
    };

    const route = [
      startLocation,
      currentLocation,
      stopLocation,
    ];

    setRouteCoordinates(route);
  };

  const handleReport = () => {
    // Handle the report message submission
    console.log('Report message:', reportMessage);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.noTripText}>Trip not found.</Text>
      </View>
    );
  }

  const startLocation = {
    latitude: parseFloat(trip.start_location.split(",")[0]),
    longitude: parseFloat(trip.start_location.split(",")[1]),
  };

  const stopLocation = {
    latitude: parseFloat(trip.stop_location.split(",")[0]),
    longitude: parseFloat(trip.stop_location.split(",")[1]),
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Trip Details</Text>
      <Image source={{ uri: 'http://178.62.207.33:8888/storage/' +trip.picture }} style={styles.vehicleImage} />
      <View style={styles.card}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Make:</Text>
          <Text style={styles.detailValue}>{trip.make}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Model:</Text>
          <Text style={styles.detailValue}>{trip.model}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Passengers:</Text>
          <Text style={styles.detailValue}>{trip.passengers}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fee:</Text>
          <Text style={styles.detailValue}>${trip.fee}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <Text style={styles.detailValue}>{trip.status}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Start Location:</Text>
          <Text style={styles.detailValue}>{trip.start_location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Stop Location:</Text>
          <Text style={styles.detailValue}>{trip.stop_location}</Text>
        </View>
      </View>

      <View style={styles.card}>
        {trip.status === 'ACCEPTED' ? (
          currentLocation ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}
                title="Current Location"
                pinColor="blue"
              />
              <Marker
                coordinate={startLocation}
                title="Start Location"
                pinColor="green"
              />
              <Marker
                coordinate={stopLocation}
                title="Stop Location"
                pinColor="red"
              />
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="#000" // black color
                strokeWidth={6}
              />
            </MapView>
          ) : (
            <Text style={styles.statusMessage}>Loading current location...</Text>
          )
        ) : trip.status === 'PENDING' ? (
          <Text style={styles.statusMessage}>Trip hasn't started</Text>
        ) : trip.status === 'COMPLETED' ? (
          <Text style={styles.statusMessage}>Trip Was Completed</Text>
        ) : (
          <Text style={styles.statusMessage}>No data</Text>
        )}
      </View>

      <TouchableOpacity style={styles.reportButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.reportButtonText}>Report an Issue</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Report an Issue</Text>
            <TextInput
              style={styles.input}
              placeholder="Type your message here..."
              multiline
              numberOfLines={4}
              onChangeText={text => setReportMessage(text)}
              value={reportMessage}
            />
            <View style={styles.modalButtons}>
              <Button title="Submit" onPress={handleReport} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  noTripText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  vehicleImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  detailValue: {
    fontSize: 16,
    color: '#777',
  },
  map: {
    height: 200,
    borderRadius: 10,
  },
  statusMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  reportButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: '100%',
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
