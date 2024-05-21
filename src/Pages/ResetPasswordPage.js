import React, { useState } from "react";
import { StyleSheet, Keyboard, KeyboardAvoidingView, Text, TextInput, TouchableWithoutFeedback, View, TouchableOpacity, ActivityIndicator } from "react-native";
import AlertBox from "../Components/AlertBox";
import SuccessAlertBox from "../Components/SuccessAlertBox";

export default function ResetPasswordPage({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorMessageText, setErrorMessageText] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState('');

  const onLoginPress = async () => {
    if (!oldPassword || !password || !passwordConfirmation) {
      setErrorMessage(true);
      setErrorMessageText('Please every field must not be empty!');
      return;
    }

    setIsLoading(true);
    setErrorMessage(false);
    setSuccessMessage(false);

    const data = {
      oldPassword: oldPassword,
      password: password,
      password_confirmation: passwordConfirmation
    };

    try {
      const response = await fetch('http://178.62.207.33:8888/api/v1/profiles', {
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
        setErrorMessage(true);
        setErrorMessageText(data.errors[0]);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("67", error, data);
      setErrorMessage(true);
      setErrorMessageText('An unexpected error occurred. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.logoText}>Change Account Password</Text>
          {errorMessage && <AlertBox message={errorMessageText} />}
          {successMessage && <SuccessAlertBox message={successMessageText} />}
          <TextInput
            placeholder="Current Password"
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholderTextColor="#c4c3cb"
            style={styles.input}
            secureTextEntry
          />
          <TextInput
            placeholder="New Password"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#c4c3cb"
            style={styles.input}
            secureTextEntry
          />
          <TextInput
            placeholder="Confirm New Password"
            value={passwordConfirmation}
            onChangeText={setPasswordConfirmation}
            placeholderTextColor="#c4c3cb"
            style={styles.input}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.button}
            onPress={onLoginPress}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Change Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fc',
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

