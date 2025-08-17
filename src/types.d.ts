export interface User {
  id: string;
  username: string;
  role: 'teacher' | 'student';
  token?: string; // For auth token client-side stored
}

// For backend data (no correctAnswerIndex)
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswers: string[] | null;
  questionType: number;
}

// For frontend UI (extends backend Question)
export interface UIQuestion extends Question {
  correctAnswerIndex: number;
}

// Similarly for Exam:
export interface Exam {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  questions: Question[]; // backend format for API/store
}

export interface UIExam extends Omit<Exam, 'questions'> {
  questions: UIQuestion[];
}

export interface ExamResult {
  id: string;
  examAttemptId: string;
  examTitle: string;
  score: number;
  feedback: string | null;
  examId: string | null;
  submittedAt: string | null;
  studentName: string;
  startedAt?: string;
}