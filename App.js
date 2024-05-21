import React, { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import AuthNav from './src/Navigation/AuthNav';
import DashNav from './src/Navigation/DashNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CredentialsContext } from './src/Auth/CredentialsContext';

const MainStack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

  useEffect(() => {
    checkLoggedInStatus();
  }, []);
  

  const checkLoggedInStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      setStoredCredentials(token);
      //setIsLoggedIn(!!token);
    } catch (error) {
      Alert.alert('Error', 'Error checking logged in status!');
      console.log('Error checking logged in status: ', error);
    }
  };
  return (
    <CredentialsContext.Provider value={{storedCredentials, setStoredCredentials}}>
      <NavigationContainer>
        <MainStack.Navigator>
          {storedCredentials ? (
            <MainStack.Screen name="DashNav" component={DashNav} options={{ headerShown: false }}/>
          ) : (
            <MainStack.Screen
              name="AuthNav"
              component={AuthNav}
              options={{ headerShown: false }}
            />
          )}
        </MainStack.Navigator>
      </NavigationContainer>
    </CredentialsContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
});
