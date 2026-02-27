import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../theme/colors';
import { useAuth } from '../context/AuthContext';

function HomeScreen() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }
    setIsLoggingOut(true);
    const result = await logout();
    if (!result.ok) {
      setError(result.error ?? 'Logout failed.');
    }
    setIsLoggingOut(false);
  };

  const isDisabled = isLoggingOut;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>You are logged in as</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user?.name ?? 'Guest'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email ?? 'Not available'}</Text>
        </View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable
        accessibilityRole="button"
        disabled={isDisabled}
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logoutButton,
          isDisabled && styles.logoutButtonDisabled,
          pressed && !isDisabled && styles.logoutButtonPressed,
        ]}
      >
        {isLoggingOut ? (
          <ActivityIndicator color={colors.card} />
        ) : (
          <Text style={styles.logoutButtonText}>Logout</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.card,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 20,
    fontSize: 15,
    color: colors.subtext,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: colors.subtext,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginTop: 16,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  logoutButtonDisabled: {
    backgroundColor: colors.muted,
  },
  logoutButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
