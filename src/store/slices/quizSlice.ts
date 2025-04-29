import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { quizAPI } from '../../api/api';
import { QuizState } from '../../types';

// Initial state
const initialState: QuizState = {
  currentQuiz: null,
  currentQuestion: 0,
  selectedAnswers: {},
  result: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchRandomQuiz = createAsyncThunk(
  'quiz/fetchRandomQuiz',
  async (questionCount: number = 10, { rejectWithValue }) => {
    try {
      return await quizAPI.getRandomQuiz(questionCount);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch quiz');
    }
  }
);

export const submitQuiz = createAsyncThunk(
  'quiz/submitQuiz',
  async ({ quizId, answers }: { quizId: string; answers: Record<string, string> }, { rejectWithValue }) => {
    try {
      return await quizAPI.submitQuiz(quizId, answers);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit quiz');
    }
  }
);

// Slice
const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    nextQuestion: (state) => {
      if (state.currentQuiz && state.currentQuestion < state.currentQuiz.questions.length - 1) {
        state.currentQuestion += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestion > 0) {
        state.currentQuestion -= 1;
      }
    },
    selectAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      state.selectedAnswers[questionId] = answer;
    },
    resetQuiz: (state) => {
      state.currentQuiz = null;
      state.currentQuestion = 0;
      state.selectedAnswers = {};
      state.result = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch random quiz
    builder.addCase(fetchRandomQuiz.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchRandomQuiz.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentQuiz = action.payload;
      state.currentQuestion = 0;
      state.selectedAnswers = {};
      state.result = null;
    });
    builder.addCase(fetchRandomQuiz.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Submit quiz
    builder.addCase(submitQuiz.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(submitQuiz.fulfilled, (state, action) => {
      state.isLoading = false;
      state.result = action.payload;
    });
    builder.addCase(submitQuiz.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { nextQuestion, previousQuestion, selectAnswer, resetQuiz, clearError } = quizSlice.actions;
export default quizSlice.reducer;