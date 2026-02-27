import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_USER_KEY = 'auth.user';
const STORAGE_CREDENTIALS_KEY = 'auth.credentials';

type User = {
  name: string;
  email: string;
};

type Credentials = {
  name: string;
  email: string;
  password: string;
};

type AuthResult = {
  ok: boolean;
  error?: string;
};

type AuthContextValue = {
  user: User | null;
  isHydrating: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const [storedUser, storedCredentials] = await Promise.all([
          AsyncStorage.getItem(STORAGE_USER_KEY),
          AsyncStorage.getItem(STORAGE_CREDENTIALS_KEY),
        ]);
        if (storedUser) {
          setUser(JSON.parse(storedUser) as User);
        }
        if (storedCredentials) {
          setCredentials(JSON.parse(storedCredentials) as Credentials);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsHydrating(false);
      }
    };

    hydrate();
  }, []);

  const persistUser = async (nextUser: User | null) => {
    if (nextUser) {
      await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(nextUser));
    } else {
      await AsyncStorage.removeItem(STORAGE_USER_KEY);
    }
  };

  const persistCredentials = async (nextCredentials: Credentials | null) => {
    if (nextCredentials) {
      await AsyncStorage.setItem(
        STORAGE_CREDENTIALS_KEY,
        JSON.stringify(nextCredentials),
      );
    } else {
      await AsyncStorage.removeItem(STORAGE_CREDENTIALS_KEY);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      if (!credentials) {
        return { ok: false, error: 'No account found. Please sign up first.' };
      }

      if (credentials.email !== email || credentials.password !== password) {
        return { ok: false, error: 'Incorrect email or password.' };
      }

      const nextUser: User = { name: credentials.name, email: credentials.email };
      setUser(nextUser);
      await persistUser(nextUser);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Unable to login right now. Please try again.' };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResult> => {
    try {
      // if (credentials) {
      //   return { ok: false, error: 'An account already exists. Please log in.' };
      // }

      const nextCredentials = { name, email, password };
      setCredentials(nextCredentials);
      await persistCredentials(nextCredentials);

      const nextUser: User = { name, email };
      setUser(nextUser);
      await persistUser(nextUser);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Unable to sign up right now. Please try again.' };
    }
  };

  const logout = async (): Promise<AuthResult> => {
    try {
      setUser(null);
      await persistUser(null);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Unable to log out. Please try again.' };
    }
  };

  const value = useMemo(
    () => ({
      user,
      isHydrating,
      login,
      signup,
      logout,
    }),
    [user, isHydrating],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
export type { User };
