import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { Exam } from "../../types";
import {
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";

const StudentTakeExam: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<number[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [timer, setTimer] = useState(0); // seconds left
  const navigate = useNavigate();

  // Timer interval ref to clear on unmount
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchExam = async () => {
    if (!examId) return;
    setLoading(true);
    try {
      console.log("exammm", examId)
      const data = await api.fetchExamById(examId);
      console.log("data", data)
      setExam(data);
      setAnswers(new Array(data.questions.length).fill(-1));
      setTimer(data.durationMinutes * 60);
      const attemptStart = await api.startExamAttempt(data.id);
      setAttemptId(attemptStart.id);
    } catch (e) {
      alert("Failed to load exam");
      navigate("/student/exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExam();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examId]);

  useEffect(() => {
    if (timer <= 0 && exam) handleSubmit();
    if (timer > 0) {
      timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timer]);

  const onAnswerChange = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!exam || !attemptId) return;
    if (answers.some((a) => a === -1)) {
      if (!window.confirm("Some questions are unanswered. Submit anyway?"))
        return;
    }
    try {
      const submitAnswers = exam.questions.map((q, idx) => ({
        questionId: q.id,
        questionType: q.text, //q.questionType,
        answerValues: answers[idx] === -1 ? [] : [q.options[answers[idx]]], // sending selected option text as string
      }));
      console.log("pp", exam, attemptId, submitAnswers)

      await api.submitExamResult(attemptId, submitAnswers);

      alert("Exam submitted successfully!");
      navigate("/student/results");
    } catch (e) {
      alert("Failed to submit exam");
    }
  };

  if (loading || !exam) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {exam.title}
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Time Left:{" "}
        {Math.floor(timer / 60)
          .toString()
          .padStart(2, "0")}
        :{(timer % 60).toString().padStart(2, "0")}
      </Typography>

      {exam.questions.map((q, idx) => (
        <Paper key={q.id} sx={{ padding: 2, mb: 2 }} variant="outlined">
          <Typography variant="h6">
            {idx + 1}. {q.text}
          </Typography>
          <RadioGroup
            value={answers[idx] === -1 ? "" : answers[idx].toString()}
            onChange={(e) => onAnswerChange(idx, parseInt(e.target.value, 10))}
          >
            {q.options.map((opt, i) => (
              <FormControlLabel
                key={i}
                value={i.toString()}
                control={<Radio />}
                label={opt}
              />
            ))}
          </RadioGroup>
        </Paper>
      ))}

      <Box>
        <Button variant="contained" onClick={handleSubmit}>
          Submit Exam
        </Button>
        <Button sx={{ ml: 2 }} onClick={() => navigate("/student/exams")}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default StudentTakeExam;
