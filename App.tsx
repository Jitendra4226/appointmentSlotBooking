import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BookingScreen from './src/screens/BookingScreen';

const App = () => (
  <SafeAreaProvider>
    <BookingScreen />
  </SafeAreaProvider>
);

export default App;
