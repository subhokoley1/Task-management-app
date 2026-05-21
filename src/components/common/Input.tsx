import React, {memo, useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '@/theme/ThemeContext';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  error?: string;
  multiline?: boolean;
}

export const Input = memo(
  ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    showPasswordToggle,
    error,
    multiline,
  }: InputProps) => {
    const {colors, radius, spacing} = useTheme();
    const [passwordVisible, setPasswordVisible] = useState(false);

    const isPasswordField = Boolean(secureTextEntry && showPasswordToggle);
    const hidePassword = isPasswordField && !passwordVisible;

    return (
      <View style={{marginBottom: spacing.md}}>
        <Text style={[styles.label, {color: colors.textSecondary}]}>{label}</Text>
        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: colors.surface,
              borderColor: error ? colors.error : colors.border,
              borderRadius: radius.md,
              minHeight: multiline ? 100 : 48,
            },
          ]}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry={hidePassword || (secureTextEntry && !showPasswordToggle)}
            multiline={multiline}
            style={[
              styles.input,
              {
                color: colors.text,
                padding: spacing.md,
                paddingRight: isPasswordField ? spacing.xs : spacing.md,
              },
              multiline && styles.multiline,
            ]}
          />
          {isPasswordField ? (
            <Pressable
              onPress={() => setPasswordVisible(prev => !prev)}
              style={styles.toggle}
              accessibilityRole="button"
              accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}>
              <MaterialCommunityIcons
                name={passwordVisible ? 'eye' : 'eye-off'}
                size={22}
                color={colors.textSecondary}
              />
            </Pressable>
          ) : null}
        </View>
        {error ? (
          <Text style={[styles.error, {color: colors.error}]}>{error}</Text>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  multiline: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  toggle: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
});
