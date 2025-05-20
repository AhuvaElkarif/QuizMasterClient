import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { questionsAPI } from '../../api/api';
import { QuestionsState, Question } from '../../types';

// Initial state
const initialState: QuestionsState = {
  questions: [],
  currentQuestion: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchQuestions = createAsyncThunk(
  'questions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await questionsAPI.getQuestions();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
    }
  }
);

export const fetchQuestion = createAsyncThunk(
  'questions/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      return await questionsAPI.getQuestion(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch question');
    }
  }
);

export const createQuestion = createAsyncThunk(
  'questions/create',
  async (question: Omit<Question, 'id' | 'createdAt' | 'createdBy'>, { rejectWithValue }) => {
    try {
      console.log(question)
      return await questionsAPI.createQuestion(question);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create question');
    }
  }
);

export const updateQuestion = createAsyncThunk(
  'questions/update',
  async ({ id, questionData }: { id: string; questionData: Partial<Question> }, { rejectWithValue }) => {
    try {
      return await questionsAPI.updateQuestion(id, questionData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update question');
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  'questions/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await questionsAPI.deleteQuestion(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete question');
    }
  }
);

// Slice
const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    clearCurrentQuestion: (state) => {
      state.currentQuestion = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch questions
    builder.addCase(fetchQuestions.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchQuestions.fulfilled, (state, action) => {
      state.isLoading = false;
      state.questions = action.payload;
    });
    builder.addCase(fetchQuestions.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch question
    builder.addCase(fetchQuestion.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchQuestion.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentQuestion = action.payload;
    });
    builder.addCase(fetchQuestion.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create question
    builder.addCase(createQuestion.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createQuestion.fulfilled, (state, action) => {
      state.isLoading = false;
      state.questions.push(action.payload);
    });
    builder.addCase(createQuestion.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update question
    builder.addCase(updateQuestion.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateQuestion.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.questions.findIndex((q) => q.id === action.payload.id);
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
      state.currentQuestion = action.payload;
    });
    builder.addCase(updateQuestion.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete question
    builder.addCase(deleteQuestion.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteQuestion.fulfilled, (state, action) => {
      state.isLoading = false;
      state.questions = state.questions.filter((q) => q.id !== action.payload);
      if (state.currentQuestion?.id === action.payload) {
        state.currentQuestion = null;
      }
    });
    builder.addCase(deleteQuestion.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCurrentQuestion, clearError } = questionsSlice.actions;
export default questionsSlice.reducer;