import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppointmentDetailsScreen from '../screens/AppointmentDetailsScreen';
import BookingScreen from '../screens/BookingScreen';
import MyAppointmentsScreen from '../screens/MyAppointmentsScreen';

export type RootStackParamList = {
  Booking: undefined;
  MyAppointments: undefined;
  AppointmentDetails: { appointmentId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Booking">
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyAppointments"
        component={MyAppointmentsScreen}
        options={{ title: 'My Appointments' }}
      />
      <Stack.Screen
        name="AppointmentDetails"
        component={AppointmentDetailsScreen}
        options={{ title: 'Appointment Details' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
