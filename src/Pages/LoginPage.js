import React, { useContext, useState } from "react";

import styles from "./style";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from "react-native";
import AlertBox from "../Components/AlertBox";
import SuccessAlertBox from "../Components/SuccessAlertBox";
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { AuthContext } from "../Auth/AuthContext";

export default function LoginPage({ navigation }) {
  //const login = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorMessageText, setErrorMessageText] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState('');

  const onLoginPress = async () => {
    if (!email || !password ) {
      setErrorMessage(true);
      setErrorMessageText('Please every field must not be empty!');
      return;
    }

    setIsLoading(true);
    setErrorMessage(false);
    setSuccessMessage(false);

    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://178.62.207.33:8888/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.token);
        setErrorMessage(false);
        setIsLoading(false);
        await AsyncStorage.setItem('authToken', data.token);
        //login(data.token);
        navigation.navigate('DashNav', { screen: 'BoardNav' });
      } else {
        const data = await response.json();
        console.log(data.message);
        setErrorMessage(true);
        setErrorMessageText(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(true);
      setErrorMessageText('An unexpected error occurred. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.containerView} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>
            <View style={styles.imageContainer}>
                <Image 
                    source={require('../../assets/orig.png')}
                    style={styles.image}
                />
            </View>
            <Text style={styles.logoText}>Transport Allocation System</Text>
            {errorMessage ? (
              <AlertBox message={errorMessageText} />
            ):null}
            {successMessage ? (
              <SuccessAlertBox message={successMessageText} />
            ):null}
            <TextInput
              placeholder="Email address"
              value={email}
              onChangeText={text => setEmail(text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={text => setPassword(text)}
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
              secureTextEntry={true}
            />
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => onLoginPress()}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator style={{marginTop: 15}} size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
            <View
                style={{flexDirection: 'row', paddingHorizontal: 15, alignContent: 'center', justifyContent: 'center', marginTop: 10}}
            >
                <Text style={{fontSize: 15}}>Don't have an account? </Text>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Register')}
                    disabled={isLoading}
                >
                    <Text style={{fontSize: 15, color: 'blue'}}>Register Account</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

