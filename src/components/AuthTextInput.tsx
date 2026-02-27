import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colors';

type AuthTextInputProps = TextInputProps & {
  label: string;
  error?: string;
  leftIconName?: string;
  rightActionLabel?: string;
  rightActionIconName?: string;
  onRightActionPress?: () => void;
};

function AuthTextInput({
  label,
  error,
  leftIconName,
  rightActionLabel,
  rightActionIconName,
  onRightActionPress,
  onFocus,
  onBlur,
  editable = true,
  ...props
}: AuthTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  const iconColor = error
    ? colors.error
    : isFocused
    ? colors.inputFocus
    : colors.muted;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, borderAnim]);

  useEffect(() => {
    if (!error) {
      return;
    }
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 1, duration: 55, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 55, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: 1, duration: 55, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 55, useNativeDriver: false }),
    ]).start();
  }, [error, shakeAnim]);

  const translateX = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-6, 6],
  });

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? colors.error : 'transparent', error ? colors.error : colors.inputFocus],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View
        style={[
          styles.inputRow,
          { borderColor, transform: [{ translateX }] },
          error ? styles.inputRowError : null,
        ]}
      >
        {leftIconName ? (
          <View style={styles.leftIcon}>
            <Icon name={leftIconName} size={18} color={iconColor} />
          </View>
        ) : null}
        <TextInput
          {...props}
          editable={editable}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor={colors.muted}
          style={[styles.input, !editable && styles.inputDisabled]}
        />
        {rightActionLabel || rightActionIconName ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={rightActionLabel}
            onPress={onRightActionPress}
            style={({ pressed }) => [
              styles.rightAction,
              pressed && styles.rightActionPressed,
            ]}
          >
            {rightActionIconName ? (
              <Icon name={rightActionIconName} size={18} color={isFocused ? colors.primary : colors.muted} />
            ) : rightActionLabel ? (
              <Text style={styles.rightActionText}>{rightActionLabel}</Text>
            ) : null}
          </Pressable>
        ) : null}
      </Animated.View>
      {error ? (
        <View style={styles.errorRow}>
          <Icon name="alert-circle-outline" size={12} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.subtext,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 14,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 14,
  },
  inputRowError: {
    borderColor: colors.error,
    backgroundColor: colors.errorBg,
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 15,
  },
  inputDisabled: {
    color: colors.muted,
  },
  rightAction: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  rightActionPressed: {
    opacity: 0.6,
  },
  rightActionText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default AuthTextInput;
