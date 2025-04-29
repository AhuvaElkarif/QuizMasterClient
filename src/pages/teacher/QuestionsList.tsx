import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styled from 'styled-components';
import { Card, Button, Input, Table, Th, Td, Tr } from '../../styles/Theme';
import Loading from '../../components/common/Loading';
import { deleteQuestion, fetchQuestions } from '../../store/slices/questionsSlice';
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

const QuestionsList: React.FC = () => {
  const dispatch = useDispatch();
  const { questions, isLoading, error } = useSelector((state: RootState) => state.questions);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  useEffect(() => {
    dispatch(fetchQuestions() as any);
  }, [dispatch]);
  
  const filteredQuestions = questions.filter(question => 
    question.text.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeleteClick = (id: string) => {
    if (confirmDelete === id) {
      dispatch(deleteQuestion(id) as any);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };
  
  if (isLoading) {
    return <Loading message="טוען שאלות..." />;
  }
  
  return (
    <>
      <ListHeader>
        <h1>רשימת שאלות</h1>
        <Button as={Link} to="/teacher/questions/create">צור שאלה חדשה</Button>
      </ListHeader>
      
      {error && <ErrorMessage message={error} />}
      
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <SearchInput
          type="text"
          placeholder="חפש שאלות..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredQuestions.length > 0 ? (
        <Card>
          <Table>
            <thead>
              <tr>
                <Th style={{ width: '50%' }}>שאלה</Th>
                <Th>תשובה נכונה</Th>
                <Th>נוצר בתאריך</Th>
                <Th>פעולות</Th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((question) => (
                <Tr key={question.id}>
                  <Td>{question.text}</Td>
                  <Td>{question.correctAnswer}</Td>
                  <Td>{new Date(question.createdAt).toLocaleDateString('he-IL')}</Td>
                  <Td>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <Button variant="text" as={Link} to={`/teacher/questions/edit/${question.id}`}>ערוך</Button>
                      <DeleteButton 
                        variant="text" 
                        onClick={() => handleDeleteClick(question.id)}
                      >
                        {confirmDelete === question.id ? 'לאשר מחיקה' : 'מחק'}
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
              ? `לא נמצאו שאלות שתואמות לחיפוש "${searchTerm}"`
              : 'אין שאלות עדיין. צור את השאלה הראשונה שלך.'
            }
          </p>
        </Card>
      )}
    </>
  );
};

export default QuestionsList;