import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// Import Firebase App
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

console.log('Firebase SDK Version:', firebase.SDK_VERSION);

type SectionProps = PropsWithChildren<{
  title: string;
}>;

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

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const [message, setMessage] = useState('Loading message...');

  const isDarkMode = useColorScheme() === 'dark';

  async function fetchMessage() {
    try {
      // Connect to Firestore and fetch the document
      const doc = await firestore().collection('messages').doc('welcome').get();

      if (doc.exists) {
        setMessage(doc.data()?.text || 'No message found');
      } else {
        setMessage('Document not found.');
      }
    } catch (error) {
      console.error('Error fetching Firestore data:', error);
      setMessage('Error connecting to Firestore.');
    }
  }

  fetchMessage();

  // Simple test to check if Firebase is initialized
  const firebaseStatus =
    firebase.apps.length > 0
      ? 'Firebase is ready!'
      : 'Firebase failed to initialize.';
  console.log(firebase);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Firebase Status">{firebaseStatus}</Section>
          <View style={styles.container}>
            <Text style={styles.message}>{message}</Text>
          </View>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  message: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default App;
