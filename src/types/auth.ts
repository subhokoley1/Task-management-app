export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignUpFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}
