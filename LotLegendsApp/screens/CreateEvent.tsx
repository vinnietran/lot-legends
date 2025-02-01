import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

function CreateEvent({ navigation }: any): React.JSX.Element {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function validateFields(): boolean {
    const newErrors: { [key: string]: string } = {};

    if (!eventName.trim()) newErrors.eventName = 'Event name is required.';
    if (!location.trim()) newErrors.location = 'Location is required.';
    if (!Date.parse(dateTime)) newErrors.dateTime = 'Invalid date format.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function saveEvent() {
    if (!validateFields()) return;

    try {
      await firestore().collection('tailgateEvents').add({
        eventName,
        location,
        dateTime: new Date(dateTime),
        host: 'Vinnie T',  // Placeholder for now
      });

      Alert.alert('Success', 'Event created successfully!');
      navigation.goBack();
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
        onChangeText={text => {
          setEventName(text);
          if (errors.eventName) setErrors({ ...errors, eventName: '' });
        }}
      />
      {errors.eventName ? <Text style={styles.error}>{errors.eventName}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={text => {
          setLocation(text);
          if (errors.location) setErrors({ ...errors, location: '' });
        }}
      />
      {errors.location ? <Text style={styles.error}>{errors.location}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Date & Time (e.g., 2025-02-01T18:00:00Z)"
        value={dateTime}
        onChangeText={text => {
          setDateTime(text);
          if (errors.dateTime) setErrors({ ...errors, dateTime: '' });
        }}
      />
      {errors.dateTime ? <Text style={styles.error}>{errors.dateTime}</Text> : null}

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
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default CreateEvent;
