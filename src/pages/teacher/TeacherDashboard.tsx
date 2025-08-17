import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { Exam } from '../../types';
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newDuration, setNewDuration] = React.useState<number>(60);

  const navigate = useNavigate();

  const fetchExams = async () => {
    setLoading(true);
    try {
      if (!user) return;
      const data = await api.fetchExamsForTeacher();
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

  const handleCreateOpen = () => setCreateOpen(true);
  const handleCreateClose = () => setCreateOpen(false);

  const handleCreateExam = async () => {
    if (!newTitle.trim()) {
      alert('Title is required');
      return;
    }
    try {
      const newExam = await api.createExam({
        title: newTitle,
        durationMinutes: newDuration,
        questions: [],
      });
      setCreateOpen(false);
      console.log(newExam)
      navigate(`/teacher/exam/${newExam.id}`);
    } catch (e) {
      alert('Failed to create exam');
    }
  };

  const handleEdit = (examId: string) => {
    navigate(`/teacher/exam/${examId}`);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Teacher Dashboard
      </Typography>

      <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateOpen} sx={{ mb: 2 }}>
        Create New Exam
      </Button>

      {loading ? (
        <CircularProgress />
      ) : exams.length === 0 ? (
        <Typography>No exams created yet.</Typography>
      ) : (
        <List>
          {exams.map((exam) => (
            <ListItem key={exam.id} divider>
              <ListItemText primary={exam.title} secondary={`Duration: ${exam.durationMinutes} min`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(exam.id)}>
                  <EditIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={createOpen} onClose={handleCreateClose}>
        <DialogTitle>Create New Exam</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}
            noValidate
            autoComplete="off"
          >
            <TextField
              label="Exam Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Duration (minutes)"
              type="number"
              value={newDuration}
              onChange={(e) => setNewDuration(parseInt(e.target.value, 10))}
              inputProps={{ min: 1, max: 180 }}
              required
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateExam}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default TeacherDashboard;