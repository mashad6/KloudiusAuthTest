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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import AuthTextInput from '../components/AuthTextInput';
import colors from '../theme/colors';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

function SignupScreen({ navigation }: Props) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
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
    const nextErrors = { name: '', email: '', password: '', submit: '' };
    if (!name.trim()) {
      nextErrors.name = 'Name is required.';
    }
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
    return !nextErrors.name && !nextErrors.email && !nextErrors.password;
  };

  const handleSignup = async () => {
    if (isSubmitting) {
      return;
    }
    const isValid = validate();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    const result = await signup(name.trim(), email.trim().toLowerCase(), password);
    if (!result.ok) {
      setErrors((prev) => ({ ...prev, submit: result.error ?? 'Signup failed.' }));
    }
    setIsSubmitting(false);
  };

  const isDisabled = isSubmitting || !name.trim() || !email.trim() || !password;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
    >
      <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          contentInsetAdjustmentBehavior="always"
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.headerIcon}>
                <Icon name="sparkles-outline" size={22} color={colors.primary} />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>Create account</Text>
                <Text style={styles.subtitle}>Sign up to get started</Text>
              </View>
            </View>

            <AuthTextInput
              label="Name"
              placeholder="Jane Doe"
              autoCapitalize="words"
              textContentType="name"
              leftIconName="person-outline"
              value={name}
              onChangeText={(value) => {
                setName(value);
                if (errors.name) {
                  setErrors((prev) => ({ ...prev, name: '' }));
                }
                resetSubmitError();
              }}
              error={errors.name}
            />

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
              placeholder="Create a password"
              secureTextEntry={passwordHidden}
              textContentType="newPassword"
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

            {errors.submit ? <Text style={styles.submitError}>{errors.submit}</Text> : null}

            <Pressable
              accessibilityRole="button"
              disabled={isDisabled}
              onPress={handleSignup}
              style={({ pressed }) => [
                styles.primaryButton,
                isDisabled && styles.primaryButtonDisabled,
                pressed && !isDisabled && styles.primaryButtonPressed,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.card} />
              ) : (
                <View style={styles.primaryButtonContent}>
                  <Text style={styles.primaryButtonText}>Signup</Text>
                  <Icon name="arrow-forward" size={18} color={colors.card} />
                </View>
              )}
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate('Login')}
              style={({ pressed }) => [styles.linkButton, pressed && styles.linkPressed]}
            >
              <View style={styles.linkContent}>
                <Text style={styles.linkText}>Go to Login</Text>
                <Icon name="arrow-forward-outline" size={16} color={colors.primary} />
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
    paddingBottom: 32,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    color: colors.subtext,
  },
  submitError: {
    color: colors.error,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.muted,
  },
  primaryButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  linkPressed: {
    opacity: 0.7,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default SignupScreen;
