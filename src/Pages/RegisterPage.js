import React, { useState } from "react";
import styles from "./style";
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import AlertBox from "../Components/AlertBox";
import SuccessAlertBox from "../Components/SuccessAlertBox";

export default function RegisterPage({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorMessageText, setErrorMessageText] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState('');

  const onLoginPress = async () => {
    if (!username || !email || !password || !passwordConfirmation) {
      setErrorMessage(true);
      setErrorMessageText('Please every field must not be empty!');
      return;
    }

    setIsLoading(true);
    setErrorMessage(false);
    setSuccessMessage(false);

    const data = {
      name: username,
      email: email,
      phone: phone,
      password: password,
      password_confirmation: passwordConfirmation
    };

    try {
      const response = await fetch('http://178.62.207.33:8888/api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setErrorMessage(false);
        setSuccessMessage(true);
        setSuccessMessageText(data.message);
        setIsLoading(false);
      } else {
        const data = await response.json();
        //console.log(data.errors[0]);
        setErrorMessage(true);
        setErrorMessageText(data.errors[0]);
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
          <View style={styles.registerFormView}>
            <Text style={styles.logoText}>Register Account</Text>
            {errorMessage ? (
              <AlertBox message={errorMessageText} />
            ):null}
            {successMessage ? (
              <SuccessAlertBox message={successMessageText} />
            ):null}
            
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={text => setUsername(text)}
              placeholderColor="#c4c3cb"
              style={styles.loginFormTextInput}
            />
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
              placeholder="Phone e.g +263783540959"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad" // Show numeric keyboard
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
            <TextInput
              placeholder="Confirm password"
              value={passwordConfirmation}
              onChangeText={text => setPasswordConfirmation(text)}
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
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>
            <View
                style={{flexDirection: 'row', paddingHorizontal: 15, alignContent: 'center', justifyContent: 'center', marginTop: 10}}
            >
                <Text style={{fontSize: 15}}>Already have an account? </Text>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Login')}
                    disabled={isLoading}
                >
                    <Text style={{fontSize: 15, color: 'blue'}}>Login here</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

