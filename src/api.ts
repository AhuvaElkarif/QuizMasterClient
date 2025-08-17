import { Exam, ExamResult, User, Question } from "./types";

const API_BASE = "https://localhost:7100/api";

// Helper to get JWT token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

// Helper to handle JSON response & errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const errorMessage =
      errorBody?.message ||
      errorBody?.error ||
      response.statusText ||
      "API request failed";
    throw new Error(errorMessage);
  }
  return response.json();
}

export const api = {
  async login(
    username: string,
    password: string
  ): Promise<User & { token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await handleResponse<{
      token: string;
      username: string;
      role: string;
    }>(res);

    localStorage.setItem("token", data.token);

    // Convert role string to lowercase and assert type
    const role = data.role.toLowerCase();
    if (role !== "teacher" && role !== "student")
      throw new Error("Invalid role from server");

    return {
      id: "",
      username: data.username,
      role: role as "teacher" | "student",
      token: data.token,
    };
  },

  async register(
    username: string,
    password: string,
    role: "teacher" | "student"
  ): Promise<User & { token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        role: role.charAt(0).toUpperCase() + role.slice(1),
      }),
    });
    const data = await handleResponse<{
      token: string;
      username: string;
      role: string;
    }>(res);

    localStorage.setItem("token", data.token);

    const roleLower = data.role.toLowerCase();
    if (roleLower !== "teacher" && roleLower !== "student")
      throw new Error("Invalid role from server");

    return {
      id: "",
      username: data.username,
      role: roleLower as "teacher" | "student",
      token: data.token,
    };
  },

  async fetchExamsForTeacher(): Promise<Exam[]> {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");
    const res = await fetch(`${API_BASE}/exam`, {
      headers: { Authorization: "Bearer " + token },
    });
    return handleResponse<Exam[]>(res);
  },

  async createExam(exam: Omit<Exam, "id">): Promise<Exam> {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");
    const res = await fetch(`${API_BASE}/exam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(exam),
    });
    return handleResponse<Exam>(res);
  },

  async updateExam(examId: string, exam: Omit<Exam, "id">): Promise<void> {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");
    const res = await fetch(`${API_BASE}/exam/${examId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(exam),
    });
    if (!res.ok) throw new Error("Failed to update exam");
  },

  async deleteExam(examId: string): Promise<void> {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");
    const res = await fetch(`${API_BASE}/exam/${examId}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
    if (!res.ok) throw new Error("Failed to delete exam");
  },

  async fetchExamsForStudent(): Promise<Exam[]> {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");
    const res = await fetch(`${API_BASE}/student/exams`, {
      headers: { Authorization: "Bearer " + token },
    });
    return handleResponse<Exam[]>(res);
  },

  async startExamAttempt(
    examId: string
  ): Promise<{ id: string; durationMinutes: number }> {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");
    const res = await fetch(`${API_BASE}/student/examattempt/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ ExamId: examId }),
    });
    return handleResponse<{ id: string; durationMinutes: number }>(res);
  },

  async submitExamResult(
    attemptId: string,
    answers: Array<{
      questionId: string;
      questionType: string;
      answerValues?: string[]; // For MCQ/TrueFalse multiple selected answers or open text responses in array
    }>
  ): Promise<{ score: number; totalQuestions: number }> {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");
    const res = await fetch(
      `${API_BASE}/student/examattempt/${attemptId}/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(answers),
      }
    );
    return handleResponse<{ score: number; totalQuestions: number }>(res);
  },

  async fetchResultsForStudent(): Promise<ExamResult[]> {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");
    const res = await fetch(`${API_BASE}/student/results`, {
      headers: { Authorization: "Bearer " + token },
    });
    console.log("res", res);
    return handleResponse<ExamResult[]>(res);
  },

  async fetchResultsForTeacher(): Promise<ExamResult[]> {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");
    // This endpoint may differ in backend, adjust if needed
    const res = await fetch(`${API_BASE}/result/ungraded`, {
      headers: { Authorization: "Bearer " + token },
    });
    // returns ungraded results, you can extend for full results
    return handleResponse<ExamResult[]>(res);
  },

  async fetchExamById(
    examId: string
  ): Promise<Exam & { questions: Question[] }> {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_BASE}/exam/${examId}`, {
      headers: { Authorization: "Bearer " + token },
    });
    return handleResponse<Exam & { questions: Question[] }>(res);
  },

  // Questions related API - typically you add, update questions via controllers like QuestionController
  // Example: fetch questions for an exam
  async fetchQuestionsForExam(examId: string): Promise<Question[]> {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");
    const res = await fetch(`${API_BASE}/exam/${examId}/question`, {
      headers: { Authorization: "Bearer " + token },
    });
    return handleResponse<Question[]>(res);
  },

  async createQuestion(
    examId: string,
    question: Omit<Question, "id">
  ): Promise<Question> {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");
    const res = await fetch(`${API_BASE}/exam/${examId}/question`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(question),
    });
    return handleResponse<Question>(res);
  },

  async updateQuestion(
    examId: string,
    questionId: string,
    question: Omit<Question, "id">
  ): Promise<void> {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");
    const res = await fetch(
      `${API_BASE}/exam/${examId}/question/${questionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(question),
      }
    );
    if (!res.ok) throw new Error("Failed to update question");
  },

  async deleteQuestion(examId: string, questionId: string): Promise<void> {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");
    const res = await fetch(
      `${API_BASE}/exam/${examId}/question/${questionId}`,
      {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      }
    );
    if (!res.ok) throw new Error("Failed to delete question");
  },
  async fetchAnswersForAttempt(examAttemptId: string) {
    const token = getAuthToken();
    if (!token) throw new Error("Unauthorized");
    const response = await fetch(
      `${API_BASE}/student/${examAttemptId}/answers`,
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch answers for attempt: ${examAttemptId}`);
    }
    return response.json();
  },
};
