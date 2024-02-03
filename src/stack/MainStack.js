import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import SignUp from '../components/SignUp';
import Dashboard from '../components/Dashboard';
import SingIn from '../components/SignIn';

const globalScreenOptions = {
  headerShown: false,
};

function AppMainStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={globalScreenOptions}
        initialRouteName="SingIn"
        component={SingIn}>
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{title: 'SingUp'}}
        />
        <Stack.Screen
          name="SignIn"
          component={SingIn}
          options={{title: 'SingIn'}}
        />

        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{title: 'Dashboard'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppMainStack;
