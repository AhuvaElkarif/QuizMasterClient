export interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
  }
  
  export interface Question {
    id: string;
    text: string;
    options: Option[];
    createdBy: string;
    createdAt: string;
  }
  
  export interface QuestionState {
    questions: Question[];
    loading: boolean;
    error: string | null;
  }
  
  export interface CreateQuestionData {
    text: string;
    correctOption: string;
    incorrectOptions: string[];
  }