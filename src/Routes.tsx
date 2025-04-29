import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import QuestionsList from './pages/teacher/QuestionsList';
import CreateQuestion from './pages/teacher/CreateQuestion';
import EditQuestion from './pages/teacher/EditQuestion';
import StudentDashboard from './pages/student/StudentDashboard';
import QuizPage from './pages/student/QuizPage';
import ResultsPage from './pages/student/ResultsPage';
import NotFoundPage from './pages/NotFoundPage';

// רכיב שמגן על דפים שדורשים הרשאת מורה
const TeacherRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== 'teacher') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// רכיב שמגן על דפים שדורשים הרשאת תלמיד
const StudentRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== 'student') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// רכיב שמגן על דפים שדורשים משתמש מחובר (מורה או תלמיד)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// רכיב שמגן על דפי התחברות והרשמה ממשתמש מחובר
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* דף הבית - פתוח לכולם */}
      <Route path="/" element={<HomePage />} />
      
      {/* דפי אימות */}
      <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
      
      {/* דפי מורה */}
      <Route path="/teacher" element={<TeacherRoute><TeacherDashboard /></TeacherRoute>} />
      <Route path="/teacher/questions" element={<TeacherRoute><QuestionsList /></TeacherRoute>} />
      <Route path="/teacher/questions/create" element={<TeacherRoute><CreateQuestion /></TeacherRoute>} />
      <Route path="/teacher/questions/edit/:id" element={<TeacherRoute><EditQuestion /></TeacherRoute>} />
      
      {/* דפי תלמיד */}
      <Route path="/student" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
      <Route path="/student/quiz" element={<StudentRoute><QuizPage /></StudentRoute>} />
      <Route path="/student/results" element={<StudentRoute><ResultsPage /></StudentRoute>} />
      
      {/* דף 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;