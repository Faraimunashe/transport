import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SuccessAlertBox = ({ message }) => {
    return (
      <View style={styles.alert}>
        <Text style={styles.alertText}>{message}</Text>
      </View>
    );
};

export default SuccessAlertBox;

const styles = StyleSheet.create({
    alert: {
      padding: 15,
      marginBottom: 10,
      borderRadius: 5,
      backgroundColor: '#78c474',
      borderColor: '#0fab07',
      borderWidth: 1,
    },
    alertText: {
      color: '#053d02',
    },
});