import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { QuestionState, Question, CreateQuestionData } from '../../types/question.types';
import { getQuestions, createQuestion, deleteQuestion } from '../../api/questions';

const initialState: QuestionState = {
  questions: [],
  loading: false,
  error: null,
};

export const fetchQuestions = createAsyncThunk(
  'questions/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getQuestions();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
    }
  }
);

export const addQuestion = createAsyncThunk(
  'questions/add',
  async (questionData: CreateQuestionData, { rejectWithValue }) => {
    try {
      const response = await createQuestion(questionData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add question');
    }
  }
);

export const removeQuestion = createAsyncThunk(
  'questions/remove',
  async (questionId: string, { rejectWithValue }) => {
    try {
      await deleteQuestion(questionId);
      return questionId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete question');
    }
  }
);

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action: PayloadAction<Question[]>) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Question
      .addCase(addQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuestion.fulfilled, (state, action: PayloadAction<Question>) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove Question
      .addCase(removeQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeQuestion.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.questions = state.questions.filter(question => question.id !== action.payload);
      })
      .addCase(removeQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = questionSlice.actions;
export default questionSlice.reducer;