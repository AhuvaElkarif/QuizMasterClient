import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <AppBar position="static" sx={{ marginBottom: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Exam Platform
          </Typography>

          {!user && (
            <>
              <Button color="inherit" component={NavLink} to="/auth/login">
                Login
              </Button>
              <Button color="inherit" component={NavLink} to="/auth/register">
                Register
              </Button>
            </>
          )}

          {user?.role === 'teacher' && (
            <>
              <Button
                color="inherit"
                component={NavLink}
                to="/dashboard/teacher"
                sx={{ '&.active': { fontWeight: 'bold', borderBottom: '2px solid #fff' } }}
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                component={NavLink}
                to="/dashboard/teacher/results"
                sx={{ '&.active': { fontWeight: 'bold', borderBottom: '2px solid #fff' } }}
              >
                Results Analytics
              </Button>
            </>
          )}

          {user?.role === 'student' && (
            <>
              <Button
                color="inherit"
                component={NavLink}
                to="/student/exams"
                sx={{ '&.active': { fontWeight: 'bold', borderBottom: '2px solid #fff' } }}
              >
                Exams
              </Button>
              <Button
                color="inherit"
                component={NavLink}
                to="/dashboard/student/results"
                sx={{ '&.active': { fontWeight: 'bold', borderBottom: '2px solid #fff' } }}
              >
                My Results
              </Button>
            </>
          )}

          {user && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 900, margin: 'auto', padding: 2 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default Header;