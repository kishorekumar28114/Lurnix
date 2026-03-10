export type Question = {
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  hint: string;
  explanation: string;
  topic: string;
};

export type QuizResult = {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  score: number;
  accuracy: number;
};

export type UserAnswer = {
  questionIndex: number;
  selectedOption: string | null;
  isCorrect: boolean;
};

export type AnalysisReport = {
  strengths: string[];
  weakAreas: string[];
  topicsToFocusOn: string[];
  suggestedStudyStrategy: string;
};
