import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

function CreateEvent({ navigation }: any): React.JSX.Element {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');

  async function saveEvent() {
    if (!eventName || !location || !dateTime) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {
      await firestore().collection('tailgateEvents').add({
        eventName,
        location,
        dateTime: new Date(dateTime),  // Convert dateTime to a Date object
        host: 'John Doe',              // Placeholder for now
      });

      Alert.alert('Success', 'Event created successfully!');
      navigation.goBack();  // Navigate back to the event list
    } catch (error) {
      console.error('Error saving event:', error);
      Alert.alert('Error', 'Failed to create event.');
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Date & Time (e.g., 2025-02-01T18:00:00Z)"
        value={dateTime}
        onChangeText={setDateTime}
      />
      <Button title="Save Event" onPress={saveEvent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});

export default CreateEvent;
