import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CredentialsContext } from '../Auth/CredentialsContext';

export default function ProfilePage({ navigation }) {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

  const handleResetPassword = () => {
    navigation.navigate('Reset');
  };

  const handleLogoutPrompt = async () => {
    Alert.alert(
      'Warning',
      'Are you sure you want to logout?',
      [{ text: 'Yes logout', onPress: () => clearUserData() }]
    );
  };

  const clearUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch('http://178.62.207.33:8888/api/v1/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        const data = await response.json();
        console.log(data);
      }
      await AsyncStorage.removeItem('authToken');
      setStoredCredentials("");
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = await AsyncStorage.getItem('authToken');
    console.log(token);

    setIsLoading(true);

    try {
      const response = await fetch('http://178.62.207.33:8888/api/v1/profiles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        setUser(responseData.data);
        setLocation(responseData.location);
        setIsLoading(false);
      } else {
        const responseData = await response.json();
        console.log(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = async () => {
    fetchData();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#9Bd35A', '#689F38']}
          progressBackgroundColor="#056ef7"
        />
      }
    >
      <View style={styles.header}>
        <Image
          source={require('../../assets/user.png')}
          style={styles.profilePic}
        />
        <Text style={styles.username}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Joined</Text>
        <Text style={styles.detailsText}>{user.created_at}</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleResetPassword} style={styles.resetPasswordButton}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogoutPrompt} style={styles.logoutButton}>
          <Text style={styles.buttonText}>Logout Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
    padding: 20,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  body: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  detailsText: {
    fontSize: 16,
    color: '#666',
  },
  footer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  resetPasswordButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButton: {
    backgroundColor: '#e80707',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

