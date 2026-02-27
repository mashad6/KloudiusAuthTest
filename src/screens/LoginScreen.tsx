import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import AuthTextInput from '../components/AuthTextInput';
import colors from '../theme/colors';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    submit: '',
  });

  const resetSubmitError = () => {
    if (errors.submit) {
      setErrors((prev) => ({ ...prev, submit: '' }));
    }
  };

  const validate = () => {
    const nextErrors = { email: '', password: '', submit: '' };
    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password;
  };

  const handleLogin = async () => {
    if (isSubmitting) {
      return;
    }
    const isValid = validate();
    if (!isValid) {
      return;
    }
    setIsSubmitting(true);
    const result = await login(email.trim().toLowerCase(), password);
    if (!result.ok) {
      setErrors((prev) => ({ ...prev, submit: result.error ?? 'Login failed.' }));
    }
    setIsSubmitting(false);
  };

  const isDisabled = isSubmitting || !email.trim() || !password;

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
        <View style={styles.inner}>

          {/* Hero Section */}
          <View style={[styles.hero, { paddingTop: insets.top + 32 }]}>
            {/* <View style={styles.logoRing}>
              <View style={styles.logoDot}>
                <Icon name="cloud" size={23} color={colors.primaryLight} />
              </View>
            </View> */}
            <Text style={styles.heroTitle}>Welcome Back</Text>
            <Text style={styles.heroSubtitle}>Sign in to your account</Text>
          </View>

          {/* Form Panel */}
          <View style={styles.panel}>
            <ScrollView
              contentContainerStyle={styles.panelContent}
              keyboardShouldPersistTaps="handled"
              // keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.panelTitle}>Login</Text>

              <AuthTextInput
                label="Email"
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
                leftIconName="mail-outline"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: '' }));
                  }
                  resetSubmitError();
                }}
                error={errors.email}
              />

              <AuthTextInput
                label="Password"
                placeholder="Enter your password"
                secureTextEntry={passwordHidden}
                textContentType="password"
                leftIconName="lock-closed-outline"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: '' }));
                  }
                  resetSubmitError();
                }}
                rightActionLabel="Toggle password visibility"
                rightActionIconName={passwordHidden ? 'eye-outline' : 'eye-off-outline'}
                onRightActionPress={() => setPasswordHidden((prev) => !prev)}
                error={errors.password}
              />

              {errors.submit ? (
                <View style={styles.submitErrorBox}>
                  <Icon name="warning-outline" size={14} color={colors.error} />
                  <Text style={styles.submitErrorText}>{errors.submit}</Text>
                </View>
              ) : null}

              <Pressable
                accessibilityRole="button"
                disabled={isDisabled}
                onPress={handleLogin}
                style={({ pressed }) => [
                  styles.primaryButton,
                  isDisabled && styles.primaryButtonDisabled,
                  pressed && !isDisabled && styles.primaryButtonPressed,
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <View style={styles.primaryButtonContent}>
                    <Text style={styles.primaryButtonText}>Sign In</Text>
                    <Icon name="arrow-forward" size={18} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={() => navigation.navigate('Signup')}
                style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
              >
                <Text style={styles.secondaryButtonText}>Create an account</Text>
              </Pressable>
            </ScrollView>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    paddingBottom: 36,
    paddingHorizontal: 32,
  },
  logoRing: {
    width: 50,
    height: 50,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoDot: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: colors.textMuted,
    letterSpacing: 0.2,
  },
  panel: {
    // flex: 1,
    backgroundColor: colors.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    height:"100%",
  },
  panelContent: {
    padding: 28,
    paddingTop: 32,
    paddingBottom: 40,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
  },
  submitErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.errorBg,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  submitErrorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  primaryButtonPressed: {
    backgroundColor: colors.primaryDark,
    shadowOpacity: 0.2,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.muted,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '500',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  secondaryButtonPressed: {
    backgroundColor: colors.inputBg,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default LoginScreen;
