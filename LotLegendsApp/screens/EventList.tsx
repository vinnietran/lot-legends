import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import { format } from 'date-fns';


type Event = {
  id: string;
  eventName: string;
  location: string;
  dateTime: string;  // We will display this as a string for now
  host: string;
};

function formatTimestamp(timestamp: any): string {
    if (!timestamp || !timestamp._seconds) {return 'Invalid Date';}
    // Convert Firestore timestamp to Date object
    const date = new Date(timestamp._seconds * 1000);
    return format(date, 'MMMM d, yyyy h:mm a');  // Example format: "January 31, 2025 4:30 PM"
  }

const firebaseConfig = {
  apiKey: 'AIzaSyCa2REIrFZBsibn5UGrajmoU70gJ1fmmJQ',
  appId: '1:49801702948:ios:a2ae314bf50cdbd85232b1',
  messagingSenderId: '49801702948',
  projectId: 'lot-legends',
  storageBucket: 'lot-legends.firebasestorage.app',
  databaseURL: '', // Leave empty if you don't have Realtime Database set up
};

// Initialize Firebase manually if no apps exist
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase manually initialized.');
}

function EventList(): React.JSX.Element {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('tailgateEvents')
      .onSnapshot(snapshot => {
        const eventList: Event[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];

        setEvents(eventList);
        setLoading(false);
      });

    return () => unsubscribe();  // Clean up listener on unmount
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventName}>{item.eventName}</Text>
            <Text style={styles.eventDetails}>{item.location}</Text>
            <Text style={styles.eventDetails}>Hosted by: {item.host}</Text>
            <Text style={styles.eventDetails}>{formatTimestamp(item.dateTime)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 55,
      backgroundColor: '#f0f0f0',  // Light background to contrast the cards
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    eventItem: {
      padding: 20,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,  // Adds shadow for Android
    },
    eventName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    eventDetails: {
      fontSize: 16,
      color: '#666',
      marginTop: 5,
    },
  });
  

export default EventList;
