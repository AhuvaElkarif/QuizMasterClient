import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { NavBar, Container, Button } from '../../styles/Theme';

const HeaderContainer = styled(NavBar)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: var(--color-text-on-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin-left: var(--spacing-lg);
`;

const NavLink = styled(Link)`
  color: var(--color-text-on-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  
  &:hover {
    text-decoration: underline;
  }
`;

const Header: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  return (
    <HeaderContainer>
      <Container>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Logo to="/">QuizMaster</Logo>
          
          <Nav>
            <NavList>
              {isAuthenticated ? (
                <>
                  {user?.role === 'teacher' && (
                    <>
                      <NavItem>
                        <NavLink to="/teacher">לוח בקרה</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink to="/teacher/questions">שאלות</NavLink>
                      </NavItem>
                    </>
                  )}
                  
                  {user?.role === 'student' && (
                    <>
                      <NavItem>
                        <NavLink to="/student">לוח בקרה</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink to="/student/quiz">מבחן חדש</NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink to="/student/results">תוצאות</NavLink>
                      </NavItem>
                    </>
                  )}
                  
                  <NavItem>
                    <Button variant="outline" onClick={handleLogout}>התנתק</Button>
                  </NavItem>
                </>
              ) : (
                <>
                  <NavItem>
                    <NavLink to="/login">התחברות</NavLink>
                  </NavItem>
                  <NavItem>
                    <Button variant="outline" as={Link} to="/register">הרשמה</Button>
                  </NavItem>
                </>
              )}
            </NavList>
          </Nav>
        </div>
      </Container>
    </HeaderContainer>
  );
};

export default Header;