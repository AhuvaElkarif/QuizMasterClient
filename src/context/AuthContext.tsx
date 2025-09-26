import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean; 
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'teacher' | 'student') => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => void;
  setUser: (user: User | null) => void; // הוספה
  setToken: (token: string) => void; // הוספה
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

  // טיפול בחזרה מ-Google OAuth - UPDATED
  useEffect(() => {
    const handleGoogleCallback = () => {
      // בדוק אם זה הדף auth-success
      if (window.location.pathname === '/auth-success') {
        const urlParams = new URLSearchParams(window.location.search);
        const userParam = urlParams.get('user');
        
        if (userParam) {
          try {
            const userData = JSON.parse(decodeURIComponent(userParam));
            
            // המרה לפורמט User - תיקון שדות
            const googleUser: User = {
              id: userData.Id || userData.id,
              email: userData.Email || userData.email,
              role: (userData.Role || userData.role).toLowerCase() as 'teacher' | 'student'
            };

            // שמירת הטוקן
            if (userData.Token || userData.token) {
              localStorage.setItem('token', userData.Token || userData.token);
            }

            setUser(googleUser);
            
            // הודעה למשתמש חדש
            if (userData.IsNewUser || userData.isNewUser) {
              setTimeout(() => {
                alert('Welcome! Your account has been created successfully.');
              }, 100);
            }

            // הפניה ל-dashboard אחרי עיבוד הנתונים
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 500);
            
          } catch (error) {
            console.error('Failed to parse Google user data:', error);
            window.location.href = '/auth/login?error=invalid_data';
          }
        } else {
          window.location.href = '/auth/login?error=no_user_data';
        }
      }

      // טיפול בשגיאות מ-Google - עבור דף auth-error
      if (window.location.pathname === '/auth-error') {
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('message');
        if (errorParam) {
          console.error('Google auth error:', decodeURIComponent(errorParam));
          setTimeout(() => {
            alert(`Authentication error: ${decodeURIComponent(errorParam)}`);
            window.location.href = '/auth/login';
          }, 100);
        }
      }
    };

    handleGoogleCallback();
  }, []);

  const login = async (email: string, password: string) => {
    const loggedInUser = await api.login(email, password);
    setUser({
      id: loggedInUser.id,
      email: loggedInUser.email,
      role: loggedInUser.role
    });
  };

  const register = async (email: string, password: string, role: 'teacher' | 'student') => {
    const registeredUser = await api.register(email, password, role);
    setUser({
      id: registeredUser.id,
      email: registeredUser.email,
      role: registeredUser.role
    });
  };

  const loginWithGoogle = () => {
    api.googleLogin();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('exam-app-user');
    
    fetch(`${process.env.REACT_APP_API_BASE}/api/auth/google-logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(console.error);
  };

  // פונקציות עזר חדשות
  const setToken = (token: string) => {
    localStorage.setItem('token', token);
  };

  const setUserHelper = (newUser: User | null) => {
    setUser(newUser);
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      loginWithGoogle, 
      logout,
      setUser: setUserHelper,
      setToken
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