import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth } from './components/RequireAuth';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Layout from './components/Layout';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ExamEditor from './pages/teacher/ExamEditor';
import ResultsAnalytics from './pages/teacher/ResultsAnalytics';
import StudentExamList from './pages/student/StudentExamList';
import StudentTakeExam from './pages/student/StudentTakeExam';
import StudentResults from './pages/student/StudentResults';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
        
        {/* Protected routes with Layout */}
        <Route element={<RequireAuth allowedRoles={['teacher', 'student']} />}>
          <Route path="/dashboard" element={<Layout />}>
            
            {/* Teacher routes */}
            <Route element={<RequireAuth allowedRoles={['teacher']} />}>
              <Route path="teacher" element={<TeacherDashboard />} />
              <Route path="teacher/exam/:examId" element={<ExamEditor />} />
              <Route path="teacher/results" element={<ResultsAnalytics />} />
            </Route>
            
            {/* Student routes */}
            <Route element={<RequireAuth allowedRoles={['student']} />}>
              <Route path="student" element={<StudentExamList />} />
              <Route path="student/exam/:examId" element={<StudentTakeExam />} />
              <Route path="student/results" element={<StudentResults />} />
            </Route>
            
            <Route index element={<Navigate to="teacher" replace />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;