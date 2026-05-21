import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {AuthScreenProps} from '@/types/navigation';
import type {SignUpFormValues} from '@/types/auth';
import {signUpSchema} from '@/utils/validation';
import {useAppDispatch, useAppSelector} from '@/hooks/useAppDispatch';
import {clearAuthError, signUp} from '@/redux/slices/authSlice';
import {Button} from '@/components/common/Button';
import {Input} from '@/components/common/Input';
import {Screen} from '@/components/common/Screen';
import {useTheme} from '@/theme/ThemeContext';
import Toast from 'react-native-toast-message';

type Props = AuthScreenProps<'SignUp'>;

export const SignUpScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {isLoading, error} = useAppSelector(state => state.auth);
  const {colors, spacing} = useTheme();

  const {control, handleSubmit, formState} = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {email: '', password: '', confirmPassword: ''},
  });

  useEffect(() => {
    if (error) {
      Toast.show({type: 'error', text1: 'Sign up failed', text2: error});
      dispatch(clearAuthError());
    }
  }, [dispatch, error]);

  const onSubmit = handleSubmit(values => {
    dispatch(signUp(values));
  });

  return (
    <Screen scroll withHeader contentContainerStyle={styles.content}>
      <Text style={[styles.title, {color: colors.text}]}>Create account</Text>
      <Text style={{color: colors.textSecondary, marginBottom: spacing.lg}}>
        Start organizing tasks offline-first
      </Text>

      <Controller
        control={control}
        name="email"
        render={({field: {onChange, value}}) => (
          <Input
            label="Email"
            value={value}
            onChangeText={onChange}
            placeholder="you@example.com"
            error={formState.errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({field: {onChange, value}}) => (
          <Input
            label="Password"
            value={value}
            onChangeText={onChange}
            placeholder="Min 6 characters"
            secureTextEntry
            showPasswordToggle
            error={formState.errors.password?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({field: {onChange, value}}) => (
          <Input
            label="Confirm Password"
            value={value}
            onChangeText={onChange}
            placeholder="Repeat password"
            secureTextEntry
            showPasswordToggle
            error={formState.errors.confirmPassword?.message}
          />
        )}
      />

      <Button title="Sign Up" onPress={onSubmit} loading={isLoading} />
      <Button
        title="Already have an account?"
        variant="ghost"
        onPress={() => navigation.goBack()}
        style={{marginTop: spacing.md, marginBottom: spacing.lg}}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
});
