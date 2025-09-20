import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { Exam, Question, UIQuestion } from "../../types";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const ExamEditor: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const [exam, setExam] = useState<
    (Omit<Exam, "questions"> & { questions: UIQuestion[] }) | null
  >(null);
  const [editingQuestion, setEditingQuestion] = useState<UIQuestion | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);

  const navigate = useNavigate();

  const fetchExam = useCallback(async () => {
    if (!examId) return;
    setLoading(true);
    try {
      const data = await api.fetchExamById(examId);
      const questionsWithIndex = mapQuestionsToUI(data.questions ?? []);
      setExam({ ...data, questions: questionsWithIndex });
    } catch (e) {
      alert("Exam not found");
      navigate("/dashboard/teacher");
    } finally {
      setLoading(false);
    }
  }, [examId, navigate]);

  useEffect(() => {
    fetchExam();
  }, [examId, fetchExam]);

  // Handlers for exam title and duration change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!exam) return;
    setExam({ ...exam, title: e.target.value });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!exam) return;
    let v = parseInt(e.target.value, 10);
    if (isNaN(v) || v < 1) v = 1;
    setExam({ ...exam, durationMinutes: v });
  };

  // Question dialog handlers
  const openNewQuestionDialog = () => {
    setEditingQuestion({
      id: "q" + Date.now(),
      text: "",
      options: ["", ""],
      correctAnswerIndex: 0,
      correctAnswers: [],
      questionType: 0,
    });
    setQuestionDialogOpen(true);
  };

  const mapQuestionsToUI = (
    questions: Question[]
  ): (Question & { correctAnswerIndex: number })[] => {
    return questions.map((q) => {
      let correctAnswerIndex = 0;
      if (q.correctAnswers && q.correctAnswers.length > 0 && q.options) {
        const idx = q.options.indexOf(q.correctAnswers[0]);
        correctAnswerIndex = idx >= 0 ? idx : 0;
      }
      return { ...q, correctAnswerIndex };
    });
  };

  const openEditQuestionDialog = (q: Question) => {
    let correctAnswerIndex = 0;
    if (q.correctAnswers && q.correctAnswers.length > 0 && q.options) {
      const idx = q.options.indexOf(q.correctAnswers[0]);
      correctAnswerIndex = idx >= 0 ? idx : 0;
    }

    setEditingQuestion({
      ...q,
      correctAnswerIndex,
    });

    setQuestionDialogOpen(true);
  };

  const closeQuestionDialog = () => {
    setEditingQuestion(null);
    setQuestionDialogOpen(false);
  };

  const handleQuestionTextChange = (text: string) => {
    if (!editingQuestion) return;
    setEditingQuestion({ ...editingQuestion, text });
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!editingQuestion) return;
    const newOptions = [...editingQuestion.options];
    newOptions[index] = value;
    setEditingQuestion({ ...editingQuestion, options: newOptions });
  };

  const handleAddOption = () => {
    if (!editingQuestion) return;
    setEditingQuestion({
      ...editingQuestion,
      options: [...editingQuestion.options, ""],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (!editingQuestion) return;
    if (editingQuestion.options?.length <= 2) {
      alert("Each question must have at least 2 options");
      return;
    }
    let newOptions = [...editingQuestion.options];
    newOptions.splice(index, 1);
    let newCorrectIndex = editingQuestion.correctAnswerIndex;
    if (index < editingQuestion.correctAnswerIndex) newCorrectIndex--;
    else if (index === editingQuestion.correctAnswerIndex) newCorrectIndex = 0;
    setEditingQuestion({
      ...editingQuestion,
      options: newOptions,
      correctAnswerIndex: newCorrectIndex,
    });
  };

  const handleCorrectAnswerChange = (index: number) => {
    if (!editingQuestion) return;
    setEditingQuestion({ ...editingQuestion, correctAnswerIndex: index });
  };

  const handleSaveQuestion = () => {
    if (!exam || !editingQuestion) return;

    if (!editingQuestion.text.trim()) {
      alert("Question text is required");
      return;
    }

    if (editingQuestion.options.some((o) => !o.trim())) {
      alert("Option texts cannot be empty");
      return;
    }

    console.log("exam", exam);
    // Update or add question
    const existingIndex = exam.questions.findIndex(
      (q) => q.id === editingQuestion.id
    );
    let updatedQuestions = [...exam.questions];
    if (existingIndex >= 0) {
      updatedQuestions[existingIndex] = editingQuestion;
    } else {
      updatedQuestions.push(editingQuestion);
    }

    setExam({ ...exam, questions: updatedQuestions });
    closeQuestionDialog();
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!exam) return;
    if (!window.confirm("Delete this question?")) return;

    const filtered = exam.questions.filter((q) => q.id !== questionId);
    setExam({ ...exam, questions: filtered });
  };

  const handleSaveExam = async () => {
    if (!exam) return;
    if (!exam.title.trim()) {
      alert("Exam title is required");
      return;
    }
    if (!exam.questions.length) {
      alert("Add at least one question");
      return;
    }
    setSaving(true);
    try {
      const examToSave: Omit<Exam, "id"> = {
        title: exam.title,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
        questions: exam.questions.map(({ correctAnswerIndex, ...q }) => ({
          ...q,
          correctAnswers:
            q.options && typeof correctAnswerIndex === "number"
              ? [q.options[correctAnswerIndex]]
              : null,
        })),
      };
      console.log("examm", exam, examToSave);
      await api.updateExam(exam.id, examToSave);
      alert("Exam saved successfully");
      navigate("/dashboard/teacher");
    } catch (e) {
      alert("Failed to save exam");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !exam) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Edit Exam: {exam.title || "Untitled"}
      </Typography>

      <TextField
        label="Exam Title"
        value={exam.title}
        onChange={handleTitleChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Duration (minutes)"
        type="number"
        value={exam.durationMinutes}
        onChange={handleDurationChange}
        sx={{ mb: 3, maxWidth: 150 }}
        inputProps={{ min: 1, max: 180 }}
      />

      <Typography variant="h6">Questions</Typography>
      {exam.questions?.length === 0 && (
        <Typography>No questions added yet.</Typography>
      )}
      <List>
        {exam.questions?.map((q) => (
          <React.Fragment key={q.id}>
            <ListItem>
              <ListItemText
                primary={q.text}
                secondary={`Correct Answer: ${q.options[q.correctAnswerIndex]}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => openEditQuestionDialog(q)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteQuestion(q.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={openNewQuestionDialog}
        sx={{ mt: 2 }}
      >
        Add Question
      </Button>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveExam}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Exam"}
        </Button>
        <Button sx={{ ml: 2 }} onClick={() => navigate("/dashboard/teacher")}>
          Cancel
        </Button>
      </Box>

      {/* Question Dialog */}
      <Dialog
        open={questionDialogOpen}
        onClose={closeQuestionDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingQuestion?.id ? "Edit Question" : "New Question"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Question Text"
            value={editingQuestion?.text || ""}
            onChange={(e) => handleQuestionTextChange(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            sx={{ mt: 1, mb: 2 }}
          />

          <Typography variant="subtitle1" gutterBottom>
            Options (select correct answer)
          </Typography>
          {editingQuestion?.options?.map((opt, idx) => (
            <Box
              key={idx}
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <Radio
                checked={editingQuestion.correctAnswerIndex === idx}
                onChange={() => handleCorrectAnswerChange(idx)}
                value={idx}
              />
              <TextField
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                fullWidth
              />
              <IconButton
                onClick={() => handleRemoveOption(idx)}
                disabled={editingQuestion.options?.length <= 2}
                edge="end"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            onClick={handleAddOption}
            startIcon={<AddIcon />}
            sx={{ mt: 1 }}
          >
            Add Option
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeQuestionDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveQuestion}>
            Save Question
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default ExamEditor;
