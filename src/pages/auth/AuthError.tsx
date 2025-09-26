import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Typography, Button, Alert, Box } from '@mui/material';

const AuthError: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const message = searchParams.get('message');
    setErrorMessage(decodeURIComponent(message || 'Authentication failed'));
  }, [searchParams]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          Authentication Error
        </Typography>
        
        <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
          {errorMessage}
        </Alert>
        
        <Button
          variant="contained"
          onClick={() => navigate('/auth/login')}
          sx={{ mt: 2 }}
        >
          Back to Login
        </Button>
      </Box>
    </Container>
  );
};

export default AuthError;