import React, { useEffect, useState } from 'react';
import { Exam } from '../../types';
import { api } from '../../api';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StudentExamList: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchExams = async () => {
    setLoading(true);
    try {
      const data = await api.fetchExamsForStudent();
      setExams(data);
    } catch (e) {
      alert('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Available Exams
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : exams.length === 0 ? (
        <Typography>No exams currently available.</Typography>
      ) : (
        <List>
          {exams.map((exam) => (
            <ListItem key={exam.id} divider>
              <ListItemText
                primary={exam.title}
                secondary={`Duration: ${exam.durationMinutes} minutes`}
              />
              <Button variant="contained" onClick={() => navigate(`/student/exam/${exam.id}`)}>
                Take Exam
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default StudentExamList;