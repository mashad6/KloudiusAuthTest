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

  const iconColor = error
    ? colors.error
    : isFocused
    ? colors.inputFocus
    : colors.subtext;

  const borderColor = error
    ? colors.error
    : isFocused
    ? colors.inputFocus
    : colors.border;

  useEffect(() => {
    if (!error) {
      return;
    }
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [error, shakeAnim]);

  const translateX = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-6, 6],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Animated.View style={[styles.inputRow, { borderColor, transform: [{ translateX }] }]}>
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
              <Icon name={rightActionIconName} size={18} color={colors.primary} />
            ) : rightActionLabel ? (
              <Text style={styles.rightActionText}>{rightActionLabel}</Text>
            ) : null}
          </Pressable>
        ) : null}
      </Animated.View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 16,
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
  errorText: {
    color: colors.error,
    marginTop: 6,
    fontSize: 12,
  },
});

export default AuthTextInput;
