import React, { useEffect, useState } from "react";
import { api } from "../../api";
import { ExamResult, Exam, Question } from "../../types";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Collapse,
  Paper,
  Divider,
  Tooltip,
  Chip,
} from "@mui/material";
import dayjs from "dayjs";
import {
  CheckCircleOutline,
  ExpandLess,
  ExpandMore,
  HighlightOff,
} from "@mui/icons-material";

interface AnswerMap {
  [questionId: string]: string[]; // student's answers for each question
}

const StudentResults: React.FC = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [examsMap, setExamsMap] = useState<Record<string, Exam>>({});
  const [answersMap, setAnswersMap] = useState<Record<string, AnswerMap>>({});
  const [loading, setLoading] = useState(true);
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null);

  const fetchResults = async () => {
    setLoading(true);
    try {
      // Fetch all results for student
      const data: ExamResult[] = await api.fetchResultsForStudent();
      setResults(data);

      // Get unique exam IDs from results
      const examIds = Array.from(
        new Set(
          data.map((res) => res.examId).filter((id): id is string => !!id)
        )
      );

      if (examIds.length === 0) {
        setExamsMap({});
        setAnswersMap({});
        return;
      }

      // Fetch exams data in parallel
      const examsData = await Promise.all(
        examIds.map((id) => api.fetchExamById(id))
      );
      const map: Record<string, Exam> = {};
      examsData.forEach((ex) => (map[ex.id] = ex));
      setExamsMap(map);

      // Fetch student's submitted answers per each exam attempt
      // Assuming api.fetchAnswersForAttempt takes examAttemptId and returns all answers for that attempt
      const answersResults = await Promise.all(
        data.map((res) => api.fetchAnswersForAttempt(res.examAttemptId))
      );
      // Build a map from result ID to answers by questionId
      const answersMapTemp: Record<string, AnswerMap> = {};
      data.forEach((res, i) => {
        // each answersResults[i] is array of { questionId, answerValues }
        const answerEntries = answersResults[i].map((ans: any) => [
          ans.questionId,
          ans.answerValues,
        ]) as [string, string[]][];
        answersMapTemp[res.id] = Object.fromEntries(answerEntries);
      });
      setAnswersMap(answersMapTemp);
    } catch (e) {
      alert("Failed to load results 2");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedResultId(expandedResultId === id ? null : id);
  };

  if (loading) return <CircularProgress />;

  if (results.length === 0)
    return <Typography>No exam results found.</Typography>;

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Exam Results
      </Typography>
      <List>
        {results.map((res) => {
          const exam = res.examId ? examsMap[res.examId] : null;
          const studentAnswers = answersMap[res.id] ?? {};

          return (
            <Box
              key={res.id}
              sx={{ mb: 3, border: "1px solid #ccc", borderRadius: 2 }}
            >
              <ListItem
                component="div"
                onClick={() => toggleExpand(res.id)}
                sx={{
                  cursor: "pointer",
                  bgcolor:
                    expandedResultId === res.id
                      ? "action.hover"
                      : "background.paper",
                }}
              >
                <ListItemText
                  primary={res.examTitle || exam?.title || "Exam Deleted"}
                  secondary={
                    <>
                      <Typography component="span">
                        Correct Answers: {res.score} /{" "}
                        {exam?.questions.length ?? "?"}
                      </Typography>
                      {exam?.questions.length && (
                        <>
                          <br />
                          <Typography component="span">
                            Score: {(100 * res.score) / exam?.questions.length}%
                          </Typography>
                        </>
                      )}
                      <br />
                      <Typography component="span">
                        Taken On:{" "}
                        {res.submittedAt
                          ? dayjs(res.submittedAt).format("MMMM D, YYYY h:mm A")
                          : "Unknown"}
                      </Typography>
                    </>
                  }
                />
                {expandedResultId === res.id ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse
                in={expandedResultId === res.id}
                timeout="auto"
                unmountOnExit
              >
                {exam ? (
                  <>
                    <Divider sx={{ mb: 2 }} />
                    <Box
                      sx={{
                        p: 3,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 2,
                      }}
                    >
                      <Typography
                        variant="h5"
                        gutterBottom
                        fontWeight="bold"
                        color="text.primary"
                      >
                        Exam Details
                      </Typography>

                      <List dense disablePadding>
                        {exam.questions.map((q) => {
                          const correctAnswersNormalized = (
                            q.correctAnswers ?? []
                          ).map((ans) => ans.trim().toLowerCase());
                          const studentAns = (studentAnswers[q.id] ?? []).map(
                            (ans) => ans.trim().toLowerCase()
                          );
                          const isCorrect =
                            correctAnswersNormalized.length ===
                              studentAns.length &&
                            correctAnswersNormalized.every((val) =>
                              studentAns.includes(val)
                            );

                          return (
                            <Paper
                              key={q.id}
                              sx={{
                                mb: 3,
                                p: 3,
                                borderRadius: 3,
                                boxShadow: 3,
                                border: `2px solid`,
                                borderColor: isCorrect
                                  ? "success.main"
                                  : "error.main",
                                bgcolor: "background.paper",
                                transition:
                                  "transform 0.3s ease, box-shadow 0.3s ease",
                                "&:hover": {
                                  boxShadow: 6,
                                  transform: "translateY(-4px)",
                                },
                              }}
                            >
                              <Box display="flex" alignItems="center" mb={1}>
                                {isCorrect ? (
                                  <CheckCircleOutline
                                    color="success"
                                    sx={{ mr: 1, fontSize: 28 }}
                                  />
                                ) : (
                                  <HighlightOff
                                    color="error"
                                    sx={{ mr: 1, fontSize: 28 }}
                                  />
                                )}
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="600"
                                  color="text.primary"
                                >
                                  Q: {q.text}
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  mt: 1,
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                  alignItems: "center",
                                }}
                              >
                                <Typography variant="body2" fontWeight="600">
                                  Your answer:
                                </Typography>
                                {studentAnswers[q.id] &&
                                studentAnswers[q.id].length > 0 ? (
                                  studentAnswers[q.id].map((ans, idx) => (
                                    <Tooltip
                                      key={idx}
                                      title="Your submitted answer"
                                    >
                                      <Chip
                                        label={ans}
                                        size="small"
                                        color={isCorrect ? "success" : "error"}
                                        variant="outlined"
                                      />
                                    </Tooltip>
                                  ))
                                ) : (
                                  <Typography
                                    variant="body2"
                                    fontStyle="italic"
                                    color="text.secondary"
                                  >
                                    No answer provided
                                  </Typography>
                                )}
                              </Box>

                              {!isCorrect &&
                                q.correctAnswers &&
                                q.correctAnswers.length > 0 && (
                                  <Box
                                    sx={{
                                      mt: 2,
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 1,
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      fontWeight="600"
                                    >
                                      Correct answer
                                      {q.correctAnswers.length > 1 ? "s" : ""}:
                                    </Typography>
                                    {q.correctAnswers.map((correctAns, idx) => (
                                      <Tooltip key={idx} title="Correct answer">
                                        <Chip
                                          label={correctAns}
                                          size="small"
                                          color="success"
                                        />
                                      </Tooltip>
                                    ))}
                                  </Box>
                                )}
                            </Paper>
                          );
                        })}
                      </List>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ p: 3 }}>
                    <Typography color="error" variant="body1" fontWeight="bold">
                      Exam data not found for this result.
                    </Typography>
                  </Box>
                )}
              </Collapse>
            </Box>
          );
        })}
      </List>
    </Box>
  );
};

export default StudentResults;
