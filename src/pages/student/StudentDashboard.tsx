import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  max-width: 1152px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const AvatarContainer = styled.div`
  background-color: #e6f0ff;
  padding: 0.5rem;
  border-radius: 9999px;
  margin-right: 1rem;
`;

const Avatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
`;

const AvatarPlaceholder = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background-color: #3b82f6;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const ProfileInfo = styled.div``;

const DashboardTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
`;

const ClassInfo = styled.p`
  color: #4b5563;
`;

const DateContainer = styled.div`
  background-color: #ebf5ff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
`;

const DateText = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e40af;
`;

const TabContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const TabNav = styled.nav`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 1rem 1.5rem;
  font-weight: 500;
  color: ${props => (props.active ? '#2563eb' : '#6b7280')};
  border-bottom: ${props => (props.active ? '2px solid #3b82f6' : 'none')};
  
  &:hover {
    color: ${props => (props.active ? '#2563eb' : '#4b5563')};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
  background-color: #f9fafb;
  border-radius: 0.5rem;
`;

const EmptyStateText = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
`;

const QuizGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const QuizCard = styled.div`
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1.25rem;
  transition: box-shadow 0.3s;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const QuizHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const QuizTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
`;

const SubjectTag = styled.span`
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  background-color: #e6f0ff;
  color: #1e40af;
`;

const InfoText = styled.p`
  color: #4b5563;
  margin-bottom: 1rem;
`;

const DaysLeftTag = styled.span`
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: #fef9c3;
  color: #854d0e;
  font-size: 0.75rem;
  border-radius: 0.25rem;
`;

const ActionButton = styled.button`
  width: 100%;
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 0;
  border-radius: 0.25rem;
  
  &:hover {
    background-color: #2563eb;
  }
  
  &:disabled {
    background-color: #d1d5db;
    color: #6b7280;
    cursor: not-allowed;
  }
`;

const ScoreTag = styled.span<{ score: number }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${props => {
    const percentage = props.score;
    if (percentage >= 80) return '#dcfce7';
    if (percentage >= 60) return '#fef9c3';
    return '#fee2e2';
  }};
  color: ${props => {
    const percentage = props.score;
    if (percentage >= 80) return '#166534';
    if (percentage >= 60) return '#854d0e';
    return '#b91c1c';
  }};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const LoadingContent = styled.div`
  text-align: center;
`;

const Spinner = styled.div`
  width: 4rem;
  height: 4rem;
  border: 4px solid #3b82f6;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1.125rem;
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const ErrorContent = styled.div`
  background-color: #fef2f2;
  border-left: 4px solid #ef4444;
  padding: 1rem;
  border-radius: 0.375rem;
`;

const ErrorText = styled.p`
  color: #b91c1c;
`;

const RetryButton = styled.button`
  margin-top: 1rem;
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  
  &:hover {
    background-color: #2563eb;
  }
`;

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
      <LoadingContainer>
        <LoadingContent>
          <Spinner />
          <LoadingText>Loading dashboard...</LoadingText>
        </LoadingContent>
      </LoadingContainer>
    );
  }
  
  if (error || !studentProfile) {
    return (
      <ErrorContainer>
        <ErrorContent>
          <ErrorText>{error || 'Failed to load student profile'}</ErrorText>
          <RetryButton onClick={() => window.location.reload()}>
            Retry
          </RetryButton>
        </ErrorContent>
      </ErrorContainer>
    );
  }
  
  return (
    <Container>
      <Card>
        {/* Header with student info */}
        <Header>
          <ProfileSection>
            <AvatarContainer>
              {studentProfile.avatarUrl ? (
                <Avatar 
                  src={studentProfile.avatarUrl} 
                  alt={studentProfile.name} 
                />
              ) : (
                <AvatarPlaceholder>
                  {studentProfile.name.charAt(0)}
                </AvatarPlaceholder>
              )}
            </AvatarContainer>
            <ProfileInfo>
              <DashboardTitle>{studentProfile.name}'s Dashboard</DashboardTitle>
              <ClassInfo>{studentProfile.class}</ClassInfo>
            </ProfileInfo>
          </ProfileSection>
          
          <DateContainer>
            <DateText>
              Current Date: {new Date().toLocaleDateString()}
            </DateText>
          </DateContainer>
        </Header>
        
        {/* Tabs */}
        <TabContainer>
          <TabNav>
            <TabButton
              active={activeTab === 'available'}
              onClick={() => setActiveTab('available')}
            >
              Available Quizzes
            </TabButton>
            <TabButton
              active={activeTab === 'upcoming'}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Quizzes
            </TabButton>
            <TabButton
              active={activeTab === 'completed'}
              onClick={() => setActiveTab('completed')}
            >
              Completed Quizzes
            </TabButton>
          </TabNav>
        </TabContainer>
        
        {/* Quiz List */}
        {filteredQuizzes.length === 0 ? (
          <EmptyState>
            <EmptyStateText>
              No {activeTab} quizzes found.
            </EmptyStateText>
          </EmptyState>
        ) : (
          <QuizGrid>
            {filteredQuizzes.map(quiz => (
              <QuizCard key={quiz.id}>
                <QuizHeader>
                  <QuizTitle>{quiz.title}</QuizTitle>
                  <SubjectTag>
                    {quiz.subject}
                  </SubjectTag>
                </QuizHeader>
                
                {activeTab === 'available' && (
                  <>
                    <InfoText>
                      <strong>Due: </strong>
                      {formatDueDate(quiz.dueDate)}
                      <DaysLeftTag>
                        {getDaysRemaining(quiz.dueDate)} days left
                      </DaysLeftTag>
                    </InfoText>
                    <InfoText>
                      <strong>Questions: </strong>
                      {quiz.totalQuestions}
                    </InfoText>
                    <ActionButton onClick={() => handleStartQuiz(quiz.id)}>
                      Start Quiz
                    </ActionButton>
                  </>
                )}
                
                {activeTab === 'upcoming' && (
                  <>
                    <InfoText>
                      <strong>Available on: </strong>
                      {formatDueDate(quiz.dueDate)}
                    </InfoText>
                    <InfoText>
                      <strong>Questions: </strong>
                      {quiz.totalQuestions}
                    </InfoText>
                    <ActionButton disabled>
                      Not Available Yet
                    </ActionButton>
                  </>
                )}
                
                {activeTab === 'completed' && quiz.status === 'completed' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <InfoText style={{ margin: 0 }}>
                        <strong>Score: </strong>
                        {quiz.score}/{quiz.totalQuestions}
                      </InfoText>
                      {quiz.score && (
                        <ScoreTag score={(quiz.score / quiz.totalQuestions) * 100}>
                          {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                        </ScoreTag>
                      )}
                    </div>
                    <InfoText>
                      <strong>Submitted: </strong>
                      {new Date(quiz.dueDate).toLocaleDateString()}
                    </InfoText>
                    <ActionButton onClick={() => handleViewResults(quiz.id)}>
                      View Detailed Results
                    </ActionButton>
                  </>
                )}
              </QuizCard>
            ))}
          </QuizGrid>
        )}
      </Card>
    </Container>
  );
};

export default StudentsDashboard;