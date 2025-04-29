import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import questionsReducer from './slices/questionsSlice';
import quizReducer from './slices/quizSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionsReducer,
    quiz: quizReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['your/action/here'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;