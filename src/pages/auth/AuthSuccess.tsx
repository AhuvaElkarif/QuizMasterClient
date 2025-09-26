import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setToken } = useAuth(); // אמצעי להעדכן ב-AuthContext

  useEffect(() => {
    const userParam = searchParams.get('user');
    
    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        
        // שמירה ב-localStorage
        localStorage.setItem('token', userData.Token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // עדכון ה-context
        if (setToken && setUser) {
          setToken(userData.Token);
          setUser(userData);
        }
        
        // הפניה לדשבורד
        navigate('/dashboard', { replace: true });
        
      } catch (error) {
        console.error('Failed to parse user data:', error);
        navigate('/auth/login?error=invalid_data', { replace: true });
      }
    } else {
      navigate('/auth/login?error=no_user_data', { replace: true });
    }
  }, [navigate, searchParams, setUser, setToken]);

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="100vh"
    >
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>
        Completing Google login...
      </Typography>
    </Box>
  );
};

export default AuthSuccess;