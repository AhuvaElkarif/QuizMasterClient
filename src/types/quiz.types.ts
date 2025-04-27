export interface QuizQuestion {
    id: string;
    text: string;
    options: {
      id: string;
      text: string;
    }[];
  }
  
  export interface QuizAnswer {
    questionId: string;
    selectedOptionId: string;
  }
  
  export interface QuizResult {
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    answers: {
      questionId: string;
      isCorrect: boolean;
      correctOptionId: string;
      selectedOptionId: string;
    }[];
  }
  
  export interface QuizState {
    questions: QuizQuestion[];
    answers: QuizAnswer[];
    result: QuizResult | null;
    currentQuestionIndex: number;
    loading: boolean;
    error: string | null;
  }