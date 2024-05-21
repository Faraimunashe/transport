import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import CheckBox from 'react-native-check-box';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import AlertBox from "../Components/AlertBox";

export default function RequestVehiclePage({ route, navigation }) {
  const vehicleId = route.params.data.id;
  const [startLongitude, setStartLongitude] = useState('');
  const [startLatitude, setStartLatitude] = useState('');
  const [stopLongitude, setStopLongitude] = useState('');
  const [stopLatitude, setStopLatitude] = useState('');
  const [passengers, setPassengers] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorMessageText, setErrorMessageText] = useState('');

  const handleGetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setStartLatitude(location.coords.latitude.toString());
    setStartLongitude(location.coords.longitude.toString());
  };

  const handleUseCurrentLocationToggle = () => {
    setUseCurrentLocation(!useCurrentLocation);
    if (!useCurrentLocation) {
      handleGetCurrentLocation();
    } else {
      setStartLatitude('');
      setStartLongitude('');
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(false);
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const data = {
        vehicle_id: vehicleId,
        start_location: startLatitude + ',' + startLongitude,
        stop_location: stopLatitude + ',' + stopLongitude,
        passengers: passengers,
      };

      const response = await axios.post('http://178.62.207.33:8888/api/v1/trips', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log(response.data.trip);
        navigation.navigate('Confirm',{data: response.data.trip});
      } else {
        console.log(response.message);
        setErrorMessage(true);
        setErrorMessageText(response.message);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(true);
      setErrorMessageText('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Request Vehicle</Text>
        
        <Text style={styles.label}>Start Location (Geo-coordinates)</Text>
        <View style={styles.geoContainer}>
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            value={startLatitude}
            onChangeText={setStartLatitude}
            keyboardType="numeric"
            editable={!useCurrentLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Longitude"
            value={startLongitude}
            onChangeText={setStartLongitude}
            keyboardType="numeric"
            editable={!useCurrentLocation}
          />
        </View>
        <CheckBox
          style={styles.checkbox}
          onClick={handleUseCurrentLocationToggle}
          isChecked={useCurrentLocation}
          rightText="Use Current Location"
          rightTextStyle={styles.checkboxText}
        />
        <MapView
          style={styles.map}
          region={{
            latitude: startLatitude ? parseFloat(startLatitude) : -19.4845308,
            longitude: startLongitude ? parseFloat(startLongitude) : 29.8327092,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={(e) => {
            if (!useCurrentLocation) {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setStartLatitude(latitude.toString());
              setStartLongitude(longitude.toString());
            }
          }}
        >
          {startLatitude && startLongitude && (
            <Marker
              coordinate={{ latitude: parseFloat(startLatitude), longitude: parseFloat(startLongitude) }}
              title="Start Location"
            />
          )}
        </MapView>
        
        <Text style={styles.label}>Stop Location (Geo-coordinates)</Text>
        <View style={styles.geoContainer}>
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            value={stopLatitude}
            onChangeText={setStopLatitude}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Longitude"
            value={stopLongitude}
            onChangeText={setStopLongitude}
            keyboardType="numeric"
          />
        </View>
        <MapView
          style={styles.map}
          region={{
            latitude: stopLatitude ? parseFloat(stopLatitude) : -19.4845308,
            longitude: stopLongitude ? parseFloat(stopLongitude) : 29.8327092,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={(e) => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setStopLatitude(latitude.toString());
            setStopLongitude(longitude.toString());
          }}
        >
          {stopLatitude && stopLongitude && (
            <Marker
              coordinate={{ latitude: parseFloat(stopLatitude), longitude: parseFloat(stopLongitude) }}
              title="Stop Location"
            />
          )}
        </MapView>
        
        <TextInput
          style={styles.input}
          placeholder="Passengers"
          value={passengers}
          onChangeText={setPassengers}
          keyboardType="numeric"
        />
        {errorMessage ? (
              <AlertBox message={errorMessageText} />
            ):null}
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit Request</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  geoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    flex: 1,
    marginRight: 8,
  },
  checkbox: {
    marginBottom: 16,
  },
  checkboxText: {
    color: '#333',
  },
  map: {
    height: 130,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
