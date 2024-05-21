import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, RefreshControl, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TripsPage({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('authToken');
    try {
      const response = await fetch('http://178.62.207.33:8888/api/v1/trips', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTrips(data.trips);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTrips().then(() => setRefreshing(false));
  };

  const handleTripPress = (trip) => {
    navigation.navigate('Trip', { tripId: trip.id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.pageTitle}>Trips</Text>
      {trips.length === 0 ? (
        <Text style={styles.noTripsText}>No trips found.</Text>
      ) : (
        trips.map(trip => (
          <TouchableOpacity
            key={trip.id}
            style={[
              styles.tripCard, 
              trip.status === 'PENDING' ? styles.pending : 
              trip.status === 'DECLINED' ? styles.declined : 
              trip.status === 'ACCEPTED' ? styles.accepted : styles.default
            ]}
            onPress={() => handleTripPress(trip)}
          >
            <Image source={{ uri: 'http://178.62.207.33:8888/storage/' +trip.picture }} style={styles.vehicleImage} />
            <View style={styles.tripDetails}>
              <Text style={styles.vehicleMakeModel}>{trip.make} {trip.model}</Text>
              <Text style={styles.tripInfo}>Passengers: {trip.passengers}</Text>
              <Text style={styles.tripInfo}>Fee: ${trip.fee}</Text>
              <Text style={styles.tripInfo}>Status: {trip.status}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  noTripsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  tripCard: {
    flexDirection: 'row',
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 3,
  },
  vehicleImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  tripDetails: {
    flex: 1,
    marginLeft: 10,
  },
  vehicleMakeModel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tripInfo: {
    fontSize: 14,
    color: 'gray',
  },
  pending: {
    backgroundColor: '#e0f7fa',
  },
  declined: {
    backgroundColor: '#ffebee',
  },
  accepted: {
    backgroundColor: '#e8f5e9',
  },
  default: {
    backgroundColor: '#fff',
  },
});
