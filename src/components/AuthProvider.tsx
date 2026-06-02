import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Artificial delay to show the modern loading animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [setLoading]);

  return <>{children}</>;
};
