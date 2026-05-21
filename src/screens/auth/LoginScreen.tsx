import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import type {AuthScreenProps} from '@/types/navigation';
import type {LoginFormValues} from '@/types/auth';
import {loginSchema} from '@/utils/validation';
import {useAppDispatch, useAppSelector} from '@/hooks/useAppDispatch';
import {clearAuthError, login} from '@/redux/slices/authSlice';
import {Button} from '@/components/common/Button';
import {Input} from '@/components/common/Input';
import {Screen} from '@/components/common/Screen';
import {useTheme} from '@/theme/ThemeContext';
import Toast from 'react-native-toast-message';

type Props = AuthScreenProps<'Login'>;

export const LoginScreen: React.FC<Props> = ({navigation}) => {
  const dispatch = useAppDispatch();
  const {isLoading, error} = useAppSelector(state => state.auth);
  const {colors, spacing} = useTheme();

  const {control, handleSubmit, formState} = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {email: '', password: ''},
  });

  useEffect(() => {
    if (error) {
      Toast.show({type: 'error', text1: 'Login failed', text2: error});
      dispatch(clearAuthError());
    }
  }, [dispatch, error]);

  const onSubmit = handleSubmit(values => {
    console.log('values', values);
    dispatch(login(values));
  });

  return (
    <Screen contentContainerStyle={styles.content}>
      <Text style={[styles.title, {color: colors.text}]}>Welcome back</Text>
      <Text style={{color: colors.textSecondary, marginBottom: spacing.lg}}>
        Sign in to manage your tasks
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
            placeholder="••••••••"
            secureTextEntry
            showPasswordToggle
            error={formState.errors.password?.message}
          />
        )}
      />

      <Button title="Sign In" onPress={onSubmit} loading={isLoading} />

      <Button
        title="Create an account"
        variant="ghost"
        onPress={() => navigation.navigate('SignUp')}
        style={{marginTop: spacing.md}}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
});
