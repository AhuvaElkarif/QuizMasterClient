export interface User {
    id: string;
    email: string;
    name: string;
    role: 'teacher' | 'student';
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    email: string;
    password: string;
    name: string;
    role: 'teacher' | 'student';
  }