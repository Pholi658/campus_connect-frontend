import { create } from 'zustand';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'student' | 'vendor' | null;
  school?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

const getStoredUser = (): User | null => {
  try {
    const data = localStorage.getItem('campus_connect_user');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('campus_connect_token');
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: getStoredToken(),
  loading: true,
  setUser: (user) => {
    try {
      if (user) {
        console.log("**********Persisting user session:")
        localStorage.setItem('campus_connect_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('campus_connect_user');
      }
    } catch (e) {
      console.error('Failed to persist user session:', e);
    }
    set({ user });
  },
  setToken: (token) => {
    try {
      if (token) {
        localStorage.setItem('campus_connect_token', token);
      } else {
        localStorage.removeItem('campus_connect_token');
      }
    } catch (e) {
      console.error('Failed to persist token session:', e);
    }
    set({ token });
  },
  setLoading: (loading) => set({ loading }),
  logout: () => {
    try {
      localStorage.removeItem('campus_connect_user');
      localStorage.removeItem('campus_connect_token');
      localStorage.removeItem('client_student_requests'); // Optionally clear request caches on logout
    } catch (e) {
      console.error('Failed to clear session logs:', e);
    }
    set({ user: null, token: null });
  }
}));
