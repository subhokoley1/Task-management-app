import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

export type MyTasksStackParamList = {
  Home: undefined;
  TaskDetail: {taskId: string};
  TaskForm: {taskId?: string};
};

export type MainTabParamList = {
  MyTasks: NavigatorScreenParams<MyTasksStackParamList> | undefined;
  Settings: undefined;
};

/** @deprecated Use MyTasksStackParamList — kept for existing screen imports */
export type AppStackParamList = MyTasksStackParamList;

export type RootStackParamList = {
  Boot: undefined;
  Auth: undefined;
  App: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MyTasksScreenProps<T extends keyof MyTasksStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<MyTasksStackParamList, T>,
    BottomTabScreenProps<MainTabParamList>
  >;

export type SettingsScreenProps = BottomTabScreenProps<MainTabParamList, 'Settings'>;

/** @deprecated Use MyTasksScreenProps for task screens or SettingsScreenProps for settings */
export type AppScreenProps<T extends keyof AppStackParamList> = MyTasksScreenProps<T>;
