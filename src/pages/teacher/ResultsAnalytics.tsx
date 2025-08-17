import React, { useEffect, useState } from 'react';
import { api } from '../../api';
import { ExamResult, Exam, Question } from '../../types';
import {
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  Paper,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const ResultsAnalytics: React.FC = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [examsMap, setExamsMap] = useState<Record<string, Exam>>({});
  const [loading, setLoading] = useState(true);
  const [openExamIds, setOpenExamIds] = useState<Record<string, boolean>>({});

  const fetchAllResults = async () => {
    setLoading(true);
    try {
      const data = await api.fetchResultsForTeacher();
      setResults(data);
      const examIds = Array.from(new Set(data.map((res) => res.examId)))
        .filter((id): id is string => Boolean(id));
      const examsPromises = examIds.map((id) => api.fetchExamById(id));
      const examsData = await Promise.all(examsPromises);
      const map: Record<string, Exam> = {};
      examsData
        .filter((ex): ex is Exam & { questions: Question[] } => ex !== null)
        .forEach((ex) => (map[ex.id] = ex));
      setExamsMap(map);
    } catch (e) {
      alert('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllResults();
  }, []);

  if (loading) return <CircularProgress />;

  if (results.length === 0)
    return <Typography>No results available to analyze.</Typography>;

  // Group results by examId
  const resultsByExam = results.reduce<Record<string, ExamResult[]>>((acc, res) => {
    if (!res.examId) return acc;
    if (!acc[res.examId]) acc[res.examId] = [];
    acc[res.examId].push(res);
    return acc;
  }, {});

  // Calculate exam-level stats including average score, attempts, max score
  const examStats = Object.entries(resultsByExam).map(([examId, examResults]) => {
    const exam = examsMap[examId] || null;
    const totalScore = examResults.reduce((sum, r) => sum + r.score, 0);
    const count = examResults.length;
    const averageScore = count > 0 ? totalScore / count : 0;
    return { examId, exam, averageScore, count, examResults };
  });

  // Data for Recharts bar charts
  const chartData = examStats.map(({ exam, averageScore, count }) => ({
    examTitle: exam?.title || 'Deleted Exam',
    'Average Score': Number(averageScore.toFixed(2)),
    'Max Score': exam?.questions.length || 0,
    Attempts: count,
  }));

  // Toggle expand/collapse for exam details
  const toggleOpen = (examId: string) => {
    setOpenExamIds((prev) => ({ ...prev, [examId]: !prev[examId] }));
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Results Analytics
      </Typography>

      <Paper sx={{ width: '100%', maxWidth: 900, mb: 4, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Average Scores Per Exam
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="examTitle"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={70}
            />
            <YAxis domain={[0, (dataMax:number) => Math.ceil(dataMax)]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Average Score" fill="#1976d2" />
            <Bar dataKey="Max Score" fill="#90caf9" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Paper sx={{ width: '100%', maxWidth: 900, mb: 4, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Number of Attempts Per Exam
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="examTitle"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={70}
            />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="Attempts" fill="#388e3c" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Detailed Exam Results
      </Typography>

      <List>
        {examStats.map(({ examId, exam, averageScore, count, examResults }) => (
          <React.Fragment key={examId}>
            <ListItem  onClick={() => toggleOpen(examId)} divider>
              <ListItemText
                primary={exam?.title || 'Deleted Exam'}
                secondary={`Attempts: ${count} — Average Score: ${averageScore.toFixed(2)} / ${exam?.questions.length ?? '?'}`}
              />
              {openExamIds[examId] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openExamIds[examId]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ pl: 4 }}>
                {examResults.map(({ studentName, score, startedAt, id }) => (
                  <ListItem key={id} divider>
                    <ListItemText
                      primary={studentName || 'Unknown Student'}
                      secondary={`Score: ${score} — Started at: ${startedAt ? new Date(startedAt).toLocaleString() : 'N/A'}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ResultsAnalytics;