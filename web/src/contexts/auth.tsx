import React, { createContext, useCallback, useContext, useState } from 'react';

import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar: string;
  whatsapp: string;
  bio: string;
  subject: string;
  cost: string;
  schedules: Schedule[];
}

interface Schedule {
  class_id: number;
  week_day: number;
  from: number;
  to: number;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
  rememberPassword?: boolean;
}

interface AuthContextData {
  signed: boolean;
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    let token = localStorage.getItem('@Proffy:token');

    if (!token) {
      token = sessionStorage.getItem('@Proffy:token');
    }

    let user = localStorage.getItem('@Proffy:user');

    if (!user) {
      user = sessionStorage.getItem('@Proffy:user');
    }

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password, rememberPassword }) => {
    const login = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = login.data;

    api.defaults.headers.authorization = `Bearer ${token}`;

    const classes = await api.get(`classes/${user.id}`);

    if (classes.data[0]) {
      user.subject = classes.data[0].subject;
      user.cost = classes.data[0].cost;

      const schedules = await api.get(`classes/schedules/${user.id}`);

      user.schedules = schedules.data;
    }

    if (rememberPassword) {
      localStorage.setItem('@Proffy:token', token);
      localStorage.setItem('@Proffy:user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('@Proffy:token', token);
      sessionStorage.setItem('@Proffy:user', JSON.stringify(user));
    }

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Proffy:token');
    localStorage.removeItem('@Proffy:user');

    sessionStorage.removeItem('@Proffy:token');
    sessionStorage.removeItem('@Proffy:user');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    async (user: User) => {
      localStorage.setItem('@Proffy:user', JSON.stringify(user));
      sessionStorage.setItem('@Proffy:user', JSON.stringify(user));

      const classes = await api.get(`classes/${user.id}`);

      if (classes.data[0]) {
        user.subject = classes.data[0].subject;
        user.cost = classes.data[0].cost;

        const schedules = await api.get(`classes/schedules/${user.id}`);

        user.schedules = schedules.data;
      }

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{
        signed: !!data.token,
        user: data.user,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
