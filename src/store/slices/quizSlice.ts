import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { quizAPI, Quiz, QuizSubmitResponse } from '../../api/quiz';

// Types
export interface QuizState {
  currentQuiz: Quiz | null;
  currentQuestion: number;
  selectedAnswers: Record<string, any>; // Can store string, string[], or other answer types
  result: QuizSubmitResponse | null;
  quizzes: Quiz[];
  studentResults: any[]; // Student results for all quizzes
  isLoading: boolean;
  error: string | null;
  timeLeft: number | null; // Time left in seconds
}

// Initial state
const initialState: QuizState = {
  currentQuiz: null,
  currentQuestion: 0,
  selectedAnswers: {},
  result: null,
  quizzes: [],
  studentResults: [],
  isLoading: false,
  error: null,
  timeLeft: null
};

// Async thunks
export const fetchRandomQuiz = createAsyncThunk(
  'quiz/fetchRandomQuiz',
  async (questionCount: number = 10, { rejectWithValue }) => {
    try {
      return await quizAPI.getRandomQuiz(questionCount);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch quiz');
    }
  }
);

export const submitQuiz = createAsyncThunk(
  'quiz/submitQuiz',
  async ({ quizId, answers }: { quizId: string; answers: Record<string, any> }, { rejectWithValue }) => {
    try {
      return await quizAPI.submitQuiz(quizId, answers);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit quiz');
    }
  }
);

export const fetchStudentResults = createAsyncThunk(
  'quiz/fetchStudentResults',
  async (_, { rejectWithValue }) => {
    try {
      return await quizAPI.getStudentResults();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch results');
    }
  }
);

export const fetchAllQuizzes = createAsyncThunk(
  'quiz/fetchAllQuizzes',
  async (_, { rejectWithValue }) => {
    try {
      return await quizAPI.getAllQuizzes();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch quizzes');
    }
  }
);

export const fetchQuizById = createAsyncThunk(
  'quiz/fetchQuizById',
  async (quizId: string, { rejectWithValue }) => {
    try {
      return await quizAPI.getQuizById(quizId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch quiz');
    }
  }
);

export const createQuiz = createAsyncThunk(
  'quiz/createQuiz',
  async (quizData: Omit<Quiz, 'id'>, { rejectWithValue }) => {
    try {
      return await quizAPI.createQuiz(quizData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create quiz');
    }
  }
);

export const updateQuiz = createAsyncThunk(
  'quiz/updateQuiz',
  async ({ quizId, quizData }: { quizId: string; quizData: Partial<Quiz> }, { rejectWithValue }) => {
    try {
      return await quizAPI.updateQuiz(quizId, quizData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update quiz');
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  'quiz/deleteQuiz',
  async (quizId: string, { rejectWithValue }) => {
    try {
      await quizAPI.deleteQuiz(quizId);
      return quizId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete quiz');
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
    selectAnswer: (state, action: PayloadAction<{ questionId: string; answer: any }>) => {
      const { questionId, answer } = action.payload;
      state.selectedAnswers[questionId] = answer;
    },
    resetQuiz: (state) => {
      state.currentQuiz = null;
      state.currentQuestion = 0;
      state.selectedAnswers = {};
      state.result = null;
      state.error = null;
      state.timeLeft = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setTimeLeft: (state, action: PayloadAction<number>) => {
      state.timeLeft = action.payload;
    },
    decrementTimeLeft: (state) => {
      if (state.timeLeft !== null && state.timeLeft > 0) {
        state.timeLeft -= 1;
      }
    }
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
      
      // Set timer if quiz has time limit
      if (action.payload.timeLimit) {
        state.timeLeft = action.payload.timeLimit * 60; // Convert minutes to seconds
      } else {
        state.timeLeft = null;
      }
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
    
    // Fetch student results
    builder.addCase(fetchStudentResults.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchStudentResults.fulfilled, (state, action) => {
      state.isLoading = false;
      state.studentResults = action.payload;
    });
    builder.addCase(fetchStudentResults.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch all quizzes (teacher view)
    builder.addCase(fetchAllQuizzes.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllQuizzes.fulfilled, (state, action) => {
      state.isLoading = false;
      state.quizzes = action.payload;
    });
    builder.addCase(fetchAllQuizzes.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch quiz by ID
    builder.addCase(fetchQuizById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchQuizById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentQuiz = action.payload;
      state.currentQuestion = 0;
      state.selectedAnswers = {};
      state.result = null;
      
      // Set timer if quiz has time limit
      if (action.payload.timeLimit) {
        state.timeLeft = action.payload.timeLimit * 60;
      } else {
        state.timeLeft = null;
      }
    });
    builder.addCase(fetchQuizById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Create quiz
    builder.addCase(createQuiz.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createQuiz.fulfilled, (state, action) => {
      state.isLoading = false;
      state.quizzes.push(action.payload);
    });
    builder.addCase(createQuiz.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Update quiz
    builder.addCase(updateQuiz.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateQuiz.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.quizzes.findIndex(quiz => quiz.id === action.payload.id);
      if (index !== -1) {
        state.quizzes[index] = action.payload;
      }
    });
    builder.addCase(updateQuiz.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Delete quiz
    builder.addCase(deleteQuiz.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteQuiz.fulfilled, (state, action) => {
      state.isLoading = false;
      state.quizzes = state.quizzes.filter(quiz => quiz.id !== action.payload);
    });
    builder.addCase(deleteQuiz.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { 
  nextQuestion, 
  previousQuestion, 
  selectAnswer, 
  resetQuiz, 
  clearError,
  setTimeLeft,
  decrementTimeLeft
} = quizSlice.actions;

export default quizSlice.reducer;