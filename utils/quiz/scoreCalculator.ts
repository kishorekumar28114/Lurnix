import { UserAnswer, QuizResult } from "../lib/types";

/**
 * Calculates the score from an array of user answers.
 */
export function calculateScore(answers: UserAnswer[], totalQuestions: number): QuizResult {
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let skippedAnswers = 0;

    for (const answer of answers) {
        if (answer.selectedOption === null || answer.selectedOption === undefined) {
            skippedAnswers++;
        } else if (answer.isCorrect) {
            correctAnswers++;
        } else {
            wrongAnswers++;
        }
    }

    // Handle answers list not being matching the full question count
    const actualSkipped = skippedAnswers + Math.max(0, totalQuestions - answers.length);

    const score = correctAnswers; // Example 1 point per correct answer
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return {
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        skippedAnswers: actualSkipped,
        score,
        accuracy,
    };
}
