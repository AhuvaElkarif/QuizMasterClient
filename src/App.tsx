import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppRoutes from './routes';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/common/Header';
import { Container } from './styles/Theme';
import { authAPI } from './api/api';

const App = () => {
  useEffect(() => {
    // אם יש טוקן בזיכרון המקומי, נשלוף את פרטי המשתמש
    if (localStorage.getItem('token')) {
      store.dispatch(authAPI.getCurrentUser() as any);
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <GlobalStyles />
        <Header />
        <Container>
          <AppRoutes />
        </Container>
      </Router>
    </Provider>
  );
};

export default App;