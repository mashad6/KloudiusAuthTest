import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colors';
import { useAuth } from '../context/AuthContext';

function HomeScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
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

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    }
    if (hour < 18) {
      return 'Good afternoon';
    }
    return 'Good evening';
  };

  return (
    <View style={styles.root}>

      {/* Dark Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headerTop}>
          <View style={styles.greetingBlock}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.headerName}>{user?.name ?? 'Guest'}</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>

        <View style={styles.emailBadge}>
          <Icon name="mail-outline" size={15} color={colors.primaryLight} />
          <Text style={styles.emailBadgeText} numberOfLines={1}>
            {user?.email ?? 'Not available'}
          </Text>
        </View>
      </View>

      {/* White Body */}
      <View style={styles.body}>
        <ScrollView
          contentContainerStyle={[styles.bodyContent, { paddingBottom: insets.bottom + 24 }]}
          showsVerticalScrollIndicator={false}
        >

          {/* Profile Card */}
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelText}>Account Details</Text>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailIconBg}>
                <Icon name="person-outline" size={16} color={colors.primary} />
              </View>
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Full Name</Text>
                <Text style={styles.detailValue}>{user?.name ?? 'Guest'}</Text>
              </View>
              <Icon name="chevron-forward" size={16} color={colors.muted} />
            </View>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <View style={styles.detailIconBg}>
                <Icon name="mail-outline" size={16} color={colors.primary} />
              </View>
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Email Address</Text>
                <Text style={styles.detailValue} numberOfLines={1}>
                  {user?.email ?? 'Not available'}
                </Text>
              </View>
              <Icon name="chevron-forward" size={16} color={colors.muted} />
            </View>
          </View>

          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>You are signed in and active</Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Icon name="alert-circle-outline" size={15} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Logout Button */}
          <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelText}>Account</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={isLoggingOut}
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              isLoggingOut && styles.logoutButtonDisabled,
              pressed && !isLoggingOut && styles.logoutButtonPressed,
            ]}
          >
            {isLoggingOut ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.logoutButtonContent}>
                <Icon name="log-out-outline" size={20} color="#FFFFFF" />
                <Text style={styles.logoutButtonText}>Sign Out</Text>
              </View>
            )}
          </Pressable>

        </ScrollView>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  greetingBlock: {
    flex: 1,
    marginRight: 16,
  },
  greeting: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  headerName: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: -0.5,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  emailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 8,
  },
  emailBadgeText: {
    color: colors.textMuted,
    fontSize: 13,
    flex: 1,
  },
  body: {
    flex: 1,
    backgroundColor: colors.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  bodyContent: {
    padding: 24,
    paddingTop: 28,
  },
  sectionLabel: {
    marginBottom: 12,
    marginTop: 4,
  },
  sectionLabelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  detailIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.subtext,
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
  },
  detailDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 64,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  statusText: {
    fontSize: 13,
    color: '#15803D',
    fontWeight: '500',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.errorBg,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  logoutButtonPressed: {
    backgroundColor: '#374151',
    shadowOpacity: 0.08,
  },
  logoutButtonDisabled: {
    backgroundColor: colors.muted,
    shadowOpacity: 0,
    elevation: 0,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default HomeScreen;
