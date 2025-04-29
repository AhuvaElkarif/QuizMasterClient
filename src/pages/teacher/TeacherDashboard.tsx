import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styled from 'styled-components';
import { Card, Button, Section } from '../../styles/Theme';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { fetchQuestions } from '../../store/slices/questionsSlice';

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
`;

const RecentQuestionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
`;

const QuestionItem = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
`;

const QuestionText = styled.div`
  flex: 1;
`;

const QuestionActions = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const TeacherDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { questions, isLoading, error } = useSelector((state: RootState) => state.questions);
  
  useEffect(() => {
    dispatch(fetchQuestions() as any);
  }, [dispatch]);
  
  const recentQuestions = questions.slice(0, 5);
  
  if (isLoading) {
    return <Loading message="טוען את לוח הבקרה..." />;
  }
  
  return (
    <>
      <DashboardHeader>
        <h1>לוח הבקרה של המורה</h1>
        <Button as={Link} to="/teacher/questions/create">צור שאלה חדשה</Button>
      </DashboardHeader>
      
      {error && <ErrorMessage message={error} />}
      
      <StatsGrid>
        <StatCard>
          <h3>סך הכל שאלות</h3>
          <StatValue>{questions.length}</StatValue>
        </StatCard>
        
        <StatCard>
          <h3>שאלות שנוצרו החודש</h3>
          <StatValue>
            {questions.filter(q => {
              const createdAt = new Date(q.createdAt);
              const now = new Date();
              return (
                createdAt.getMonth() === now.getMonth() &&
                createdAt.getFullYear() === now.getFullYear()
              );
            }).length}
          </StatValue>
        </StatCard>
      </StatsGrid>
      
      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
          <h2>שאלות אחרונות</h2>
          <Button variant="text" as={Link} to="/teacher/questions">צפה בכל השאלות</Button>
        </div>
        
        {recentQuestions.length > 0 ? (
          <RecentQuestionsGrid>
            {recentQuestions.map((question) => (
              <QuestionItem key={question.id}>
                <QuestionText>
                  <p style={{ margin: 0 }}>{question.text}</p>
                </QuestionText>
                <QuestionActions>
                  <Button variant="text" as={Link} to={`/teacher/questions/edit/${question.id}`}>ערוך</Button>
                </QuestionActions>
              </QuestionItem>
            ))}
          </RecentQuestionsGrid>
        ) : (
          <Card>
            <p style={{ textAlign: 'center' }}>אין שאלות עדיין. <Link to="/teacher/questions/create">צור את השאלה הראשונה שלך</Link></p>
          </Card>
        )}
      </Section>
    </>
  );
};

export default TeacherDashboard;