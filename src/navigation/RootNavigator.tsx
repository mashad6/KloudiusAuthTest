import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { user, isHydrating } = useAuth();

  if (isHydrating) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      {user ? (
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ title: 'Create Account' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});

export default RootNavigator;
