import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AlertBox = ({ message }) => {
    return (
      <View style={styles.alert}>
        <Text style={styles.alertText}>{message}</Text>
      </View>
    );
};

export default AlertBox;

const styles = StyleSheet.create({
    alert: {
      padding: 15,
      marginBottom: 5,
      borderRadius: 5,
      backgroundColor: '#f8d7da', // Light red for danger
      borderColor: '#f5c6cb', // Red border for danger
      borderWidth: 1,
      marginTop: 5
    },
    alertText: {
      color: '#721c24', // Dark red text for danger
    },
});