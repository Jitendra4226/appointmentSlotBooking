import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => (
  <Provider store={store}>
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  </Provider>
);

export default App;
