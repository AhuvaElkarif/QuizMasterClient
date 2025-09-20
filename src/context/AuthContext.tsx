import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean; // הוספתי loading state
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'teacher' | 'student') => Promise<void>;
  loginWithGoogle: () => void; // שינוי - זה לא async יותר
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const u = localStorage.getItem('exam-app-user');
    return u ? (JSON.parse(u) as User) : null;
  });
  const [loading, setLoading] = useState(true);

  // שמירה ב-localStorage כשהמשתמש משתנה
  useEffect(() => {
    if (user) {
      localStorage.setItem('exam-app-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('exam-app-user');
    }
  }, [user]);

  // בדיקת משתמש נוכחי בטעינת הדף
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const currentUser = await api.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Failed to check current user:', error);
      } finally {
        setLoading(false);
      }
    };

    checkCurrentUser();
  }, []);

  // טיפול בחזרה מ-Google OAuth
  useEffect(() => {
    const handleGoogleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userParam = urlParams.get('user');
      
      if (userParam) {
        try {
          const userData = JSON.parse(decodeURIComponent(userParam));
          
          // המרה לפורמט User
          const googleUser: User = {
            id: userData.id,
            username: userData.name || userData.email,
            role: userData.role.toLowerCase() as 'teacher' | 'student'
          };

          // שמירת הטוקן
          if (userData.token) {
            localStorage.setItem('token', userData.token);
          }

          setUser(googleUser);
          
          // נקה את הפרמטרים מה-URL
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // הודעה למשתמש חדש
          if (userData.isNewUser) {
            setTimeout(() => {
              alert('Welcome! Your account has been created successfully.');
            }, 100);
          }
        } catch (error) {
          console.error('Failed to parse Google user data:', error);
        }
      }

      // טיפול בשגיאות מ-Google
      const errorParam = urlParams.get('message');
      if (errorParam) {
        console.error('Google auth error:', decodeURIComponent(errorParam));
        alert(`Authentication error: ${decodeURIComponent(errorParam)}`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleGoogleCallback();
  }, []);

  const login = async (email: string, password: string) => {
    const loggedInUser = await api.login(email, password);
    setUser({
      id: loggedInUser.id,
      username: loggedInUser.username,
      role: loggedInUser.role
    });
  };

  const register = async (email: string, password: string, role: 'teacher' | 'student') => {
    const registeredUser = await api.register(email, password, role);
    setUser({
      id: registeredUser.id,
      username: registeredUser.username,
      role: registeredUser.role
    });
  };

  const loginWithGoogle = () => {
    // פשוט מפנה ל-Google - לא צריך async
    api.googleLogin();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('exam-app-user');
    
    // ניקוי עוגיית Google Auth
    fetch(`${process.env.REACT_APP_API_BASE}/api/auth/google-logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(console.error);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      loginWithGoogle, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};