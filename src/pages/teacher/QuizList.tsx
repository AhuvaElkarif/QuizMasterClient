import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styled from 'styled-components';
import { Card, Button, Input, Table, Th, Td, Tr } from '../../styles/Theme';
import Loading from '../../components/common/Loading';
import { deleteQuiz, fetchQuizzes } from '../../store/slices/quizSlice';
import ErrorMessage from '../../components/common/ErrorMessage';

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
`;

const SearchInput = styled(Input)`
  max-width: 300px;
`;

const DeleteButton = styled(Button)`
  color: var(--color-error);
  border-color: var(--color-error);
  &:hover {
    background-color: rgba(176, 0, 32, 0.05);
  }
`;

const Badge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  background-color: ${props => 
    props.status === 'draft' ? 'var(--color-warning-light)' : 
    props.status === 'published' ? 'var(--color-success-light)' : 
    'var(--color-secondary-light)'};
  color: ${props => 
    props.status === 'draft' ? 'var(--color-warning-dark)' : 
    props.status === 'published' ? 'var(--color-success-dark)' : 
    'var(--color-secondary-dark)'};
`;

const QuizList: React.FC = () => {
  const dispatch = useDispatch();
  const { quizzes, isLoading, error } = useSelector((state: RootState) => state.quizzes);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  useEffect(() => {
    dispatch(fetchQuizzes() as any);
  }, [dispatch]);
  
  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quiz.description && quiz.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleDeleteClick = (id: string) => {
    if (confirmDelete === id) {
      dispatch(deleteQuiz(id) as any);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };
  
  if (isLoading) {
    return <Loading message="טוען חידונים..." />;
  }
  
  return (
    <>
      <ListHeader>
        <h1>רשימת חידונים</h1>
        <Button as={Link} to="/teacher/quizzes/create">צור חידון חדש</Button>
      </ListHeader>
      
      {error && <ErrorMessage message={error} />}
      
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <SearchInput
          type="text"
          placeholder="חפש חידונים..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredQuizzes.length > 0 ? (
        <Card>
          <Table>
            <thead>
              <tr>
                <Th style={{ width: '30%' }}>כותרת</Th>
                <Th>מספר שאלות</Th>
                <Th>סטטוס</Th>
                <Th>תאריך יצירה</Th>
                <Th>פעולות</Th>
              </tr>
            </thead>
            <tbody>
              {filteredQuizzes.map((quiz) => (
                <Tr key={quiz.id}>
                  <Td>
                    <Link to={`/teacher/quiz/${quiz.id}`}>{quiz.title}</Link>
                  </Td>
                  <Td>{quiz.questionCount || 0}</Td>
                  <Td>
                    <Badge status={quiz.status || 'draft'}>
                      {quiz.status === 'published' ? 'פורסם' : 'טיוטה'}
                    </Badge>
                  </Td>
                  <Td>{new Date(quiz.createdAt).toLocaleDateString('he-IL')}</Td>
                  <Td>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <Button variant="text" as={Link} to={`/teacher/quiz/${quiz.id}`}>ערוך</Button>
                      <DeleteButton 
                        variant="text" 
                        onClick={() => handleDeleteClick(quiz.id)}
                      >
                        {confirmDelete === quiz.id ? 'לאשר מחיקה' : 'מחק'}
                      </DeleteButton>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </Card>
      ) : (
        <Card>
          <p style={{ textAlign: 'center' }}>
            {searchTerm 
              ? `לא נמצאו חידונים שתואמים לחיפוש "${searchTerm}"`
              : 'אין חידונים עדיין. צור את החידון הראשון שלך.'
            }
          </p>
        </Card>
      )}
    </>
  );
};

export default QuizList;