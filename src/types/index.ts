export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface Question {
  id: string;
  text: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  createdBy: string;
  createdAt: Date;
}

export interface Quiz {
  id: string;
  questions: Question[];
}

export interface QuizResult {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  answers: Record<string, string>; // questionId -> selectedAnswer
  completedAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface QuestionsState {
  questions: Question[];
  currentQuestion: Question | null;
  isLoading: boolean;
  error: string | null;
}

export interface QuizState {
  currentQuiz: Quiz | null;
  currentQuestion: number;
  selectedAnswers: Record<string, string>;
  result: QuizResult | null;
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  questions: QuestionsState;
  quiz: QuizState;
}