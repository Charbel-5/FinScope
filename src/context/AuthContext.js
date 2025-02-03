import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Also get stored user data
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      const { token, userId, userName } = response.data;
      const userData = { userId, userName };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const signup = async (email, password, userName, primaryCurrency, secondaryCurrency, conversionRate) => {
    try {
      // Register user
      const response = await axios.post('/api/register', {
        email,
        password,
        user_name: userName,
        primary_currency_name: primaryCurrency,
        secondary_currency_name: secondaryCurrency
      });

      // After registration, automatically set the initial conversion rate
      await axios.post('/api/currency_rates', {
        conversion_rate: conversionRate,
        start_date: new Date().toISOString().split('T')[0],
        user_id: response.data.userId 
      });

      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}