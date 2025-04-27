import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { QuizState, QuizQuestion, QuizAnswer, QuizResult } from '../../types/quiz.types';
import { getRandomQuiz, submitQuiz } from '../../api/quiz';

const initialState: QuizState = {
  questions: [],
  answers: [],
  result: null,
  currentQuestionIndex: 0,
  loading: false,
  error: null,
};

export const startQuiz = createAsyncThunk(
  'quiz/start',
  async (questionCount: number = 10, { rejectWithValue }) => {
    try {
      const response = await getRandomQuiz(questionCount);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start quiz');
    }
  }
);

export const submitQuizAnswers = createAsyncThunk(
  'quiz/submit',
  async (answers: QuizAnswer[], { rejectWithValue }) => {
    try {
      const response = await submitQuiz(answers);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit quiz');
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    clearQuiz: () => initialState,
    answerQuestion: (state, action: PayloadAction<QuizAnswer>) => {
      const existingAnswerIndex = state.answers.findIndex(
        answer => answer.questionId === action.payload.questionId
      );
      
      if (existingAnswerIndex >= 0) {
        state.answers[existingAnswerIndex] = action.payload;
      } else {
        state.answers.push(action.payload);
      }
    },
    goToNextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    goToPreviousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Quiz
      .addCase(startQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.questions = [];
        state.answers = [];
        state.result = null;
        state.currentQuestionIndex = 0;
      })
      .addCase(startQuiz.fulfilled, (state, action: PayloadAction<QuizQuestion[]>) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Submit Quiz
      .addCase(submitQuizAnswers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuizAnswers.fulfilled, (state, action: PayloadAction<QuizResult>) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(submitQuizAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearQuiz, 
  answerQuestion, 
  goToNextQuestion, 
  goToPreviousQuestion,
  clearError 
} = quizSlice.actions;
export default quizSlice.reducer;