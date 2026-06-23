import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api/axiosConfig';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        setUser({
          id: payload.user_id,
          username: payload.username || '',
          role: payload.role || 'User',
        });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.clear();
      }
    }

    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login({
        username,
        password,
      });

      const { access, refresh } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      const payload = JSON.parse(atob(access.split('.')[1]));

      const userData = {
        id: payload.user_id,
        username: payload.username || username,
        role: payload.role || 'User',
      };

      setUser(userData);

      toast.success('Login successful!');

      return {
        success: true,
      };
    } catch (error) {
      console.error('Login error:', error);

      return {
        success: false,
        error:
          error.response?.data?.detail ||
          error.response?.data?.message ||
          'Login failed',
      };
    }
  };

  const register = async (userData) => {
  try {
    const response = await authAPI.register(userData);

    toast.success('Registration successful! Please login.');

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.log("FULL ERROR:", JSON.stringify(error.response?.data, null, 2));
    console.error("Registration error:", error);

    return {
      success: false,
      error:
        error.response?.data ||
        error.response?.data?.detail ||
        error.response?.data?.message ||
        'Registration failed',
    };
  }
};

  const logout = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      await authAPI.logout(refreshToken);
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.clear();
    setUser(null);
    toast.success("Logged out successfully");
  }
};



  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin',
    isTechnician: user?.role === 'Technician',
    isCustomer: user?.role === 'Customer',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
  
};
