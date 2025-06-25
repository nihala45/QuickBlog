import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem(ACCESS_TOKEN);
  });

  const login = (userData) => {
    localStorage.setItem(ACCESS_TOKEN, userData.access || '');
    localStorage.setItem(REFRESH_TOKEN, userData.refresh || '');
    localStorage.setItem('user', JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem('user');

    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
