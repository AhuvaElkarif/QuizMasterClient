import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Quiz {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'upcoming' | 'available' | 'completed';
  score?: number;
  totalQuestions: number;
}

interface CompletedQuiz extends Quiz {
  status: 'completed';
  score: number;
  submittedAt: string;
}

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  class: string;
  avatarUrl?: string;
}

const StudentsDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'upcoming' | 'completed'>('available');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In real implementation, replace with actual API calls
        // const profileResponse = await fetch('/api/student/profile');
        // const profileData = await profileResponse.json();
        // setStudentProfile(profileData);
        
        // const quizzesResponse = await fetch('/api/student/quizzes');
        // const quizzesData = await quizzesResponse.json();
        // setQuizzes(quizzesData);
        
        // Mock data for development
        setStudentProfile({
          id: 'student-123',
          name: 'Alex Johnson',
          email: 'alex.johnson@example.com',
          class: 'CS 101 - Introduction to Programming',
          avatarUrl: '/api/placeholder/40/40'
        });
        
        setQuizzes([
          {
            id: 'quiz-1',
            title: 'JavaScript Fundamentals',
            subject: 'Programming',
            dueDate: '2025-05-05T23:59:59Z',
            status: 'available',
            totalQuestions: 15
          },
          {
            id: 'quiz-2',
            title: 'React Basics',
            subject: 'Web Development',
            dueDate: '2025-05-10T23:59:59Z',
            status: 'available',
            totalQuestions: 10
          },
          {
            id: 'quiz-3',
            title: 'Advanced TypeScript',
            subject: 'Programming',
            dueDate: '2025-05-15T23:59:59Z',
            status: 'upcoming',
            totalQuestions: 12
          },
          {
            id: 'quiz-4',
            title: 'HTML & CSS Review',
            subject: 'Web Development',
            dueDate: '2025-05-20T23:59:59Z',
            status: 'upcoming',
            totalQuestions: 10
          },
          {
            id: 'quiz-5',
            title: 'Programming Logic',
            subject: 'Computer Science',
            dueDate: '2025-04-20T23:59:59Z',
            status: 'completed',
            score: 85,
            totalQuestions: 20,
            submittedAt: '2025-04-18T14:32:11Z'
          } as CompletedQuiz,
          {
            id: 'quiz-6',
            title: 'Web Accessibility',
            subject: 'Web Development',
            dueDate: '2025-04-15T23:59:59Z',
            status: 'completed',
            score: 92,
            totalQuestions: 15,
            submittedAt: '2025-04-12T09:14:30Z'
          } as CompletedQuiz
        ]);
        
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleStartQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };
  
  const handleViewResults = (quizId: string) => {
    navigate(`/results/${quizId}`);
  };
  
  const filteredQuizzes = quizzes.filter(quiz => quiz.status === activeTab);
  
  const formatDueDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };
  
  const getDaysRemaining = (dateString: string): number => {
    const now = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error || !studentProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-red-700">{error || 'Failed to load student profile'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Header with student info */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-blue-100 p-2 rounded-full mr-4">
              {studentProfile.avatarUrl ? (
                <img 
                  src={studentProfile.avatarUrl} 
                  alt={studentProfile.name} 
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {studentProfile.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{studentProfile.name}'s Dashboard</h1>
              <p className="text-gray-600">{studentProfile.class}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 px-6 py-3 rounded-lg">
            <p className="text-sm font-medium text-blue-800">
              Current Date: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                className={`py-4 px-6 font-medium ${
                  activeTab === 'available'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('available')}
              >
                Available Quizzes
              </button>
              <button
                className={`py-4 px-6 font-medium ${
                  activeTab === 'upcoming'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming Quizzes
              </button>
              <button
                className={`py-4 px-6 font-medium ${
                  activeTab === 'completed'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('completed')}
              >
                Completed Quizzes
              </button>
            </nav>
          </div>
        </div>
        
        {/* Quiz List */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              No {activeTab} quizzes found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuizzes.map(quiz => (
              <div key={quiz.id} className="bg-gray-50 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{quiz.title}</h3>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {quiz.subject}
                  </span>
                </div>
                
                {activeTab === 'available' && (
                  <>
                    <p className="text-gray-600 mb-4">
                      <span className="font-medium">Due: </span>
                      {formatDueDate(quiz.dueDate)}
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        {getDaysRemaining(quiz.dueDate)} days left
                      </span>
                    </p>
                    <p className="text-gray-600 mb-4">
                      <span className="font-medium">Questions: </span>
                      {quiz.totalQuestions}
                    </p>
                    <button
                      onClick={() => handleStartQuiz(quiz.id)}
                      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                      Start Quiz
                    </button>
                  </>
                )}
                
                {activeTab === 'upcoming' && (
                  <>
                    <p className="text-gray-600 mb-4">
                      <span className="font-medium">Available on: </span>
                      {formatDueDate(quiz.dueDate)}
                    </p>
                    <p className="text-gray-600 mb-4">
                      <span className="font-medium">Questions: </span>
                      {quiz.totalQuestions}
                    </p>
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-2 rounded cursor-not-allowed"
                    >
                      Not Available Yet
                    </button>
                  </>
                )}
                
                {activeTab === 'completed' && quiz.status === 'completed' && (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-gray-600">
                        <span className="font-medium">Score: </span>
                        {quiz.score}/{quiz.totalQuestions}
                      </p>
                     {quiz.score && <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (quiz.score / quiz.totalQuestions) * 100 >= 80
                          ? 'bg-green-100 text-green-800'
                          : (quiz.score / quiz.totalQuestions) * 100 >= 60
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                      </span>}
                    </div>
                    <p className="text-gray-600 mb-4">
                      <span className="font-medium">Submitted: </span>
                      {new Date(quiz.dueDate).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => handleViewResults(quiz.id)}
                      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                      View Detailed Results
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsDashboard;