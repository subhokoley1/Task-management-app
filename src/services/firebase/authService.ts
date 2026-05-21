import auth, {type FirebaseAuthTypes} from '@react-native-firebase/auth';
import type {AuthUser} from '@/types/auth';

const mapUser = (user: FirebaseAuthTypes.User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
});

export const authService = {
  getCurrentUser: (): AuthUser | null => {
    const user = auth().currentUser;
    return user ? mapUser(user) : null;
  },

  onAuthStateChanged: (
    callback: (user: AuthUser | null) => void,
  ): (() => void) => {
    return auth().onAuthStateChanged(user => {
      callback(user ? mapUser(user) : null);
    });
  },

  signIn: async (email: string, password: string): Promise<AuthUser> => {
    const credential = await auth().signInWithEmailAndPassword(email, password);
    return mapUser(credential.user);
  },

  signUp: async (email: string, password: string): Promise<AuthUser> => {
    const credential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    return mapUser(credential.user);
  },

  signOut: async (): Promise<void> => {
    await auth().signOut();
  },
};
