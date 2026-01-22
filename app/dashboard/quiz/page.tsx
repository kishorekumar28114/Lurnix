"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FiCheck, FiX } from "react-icons/fi"
import DashboardLayout from "@/components/dashboard-layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import confetti from "@/lib/confetti"

// Quiz types
const quizTypes = [
  { id: "math", name: "Mathematics" },
  { id: "science", name: "Science" },
  { id: "history", name: "History" },
  { id: "english", name: "English" },
]

// Sample questions for each type
const questions = {
  math: [
    {
      id: 1,
      question: "What is 9 × 7?",
      options: ["56", "63", "72", "81"],
      answer: "63",
    },
    {
      id: 2,
      question: "Solve for x: 2x + 5 = 15",
      options: ["5", "7.5", "10", "5.5"],
      answer: "5",
    },
    {
      id: 3,
      question: "What is the square root of 144?",
      options: ["12", "14", "10", "16"],
      answer: "12",
    },
    {
      id: 4,
      question: "If a triangle has angles of 30° and 60°, what is the third angle?",
      options: ["60°", "90°", "120°", "30°"],
      answer: "90°",
    },
    {
      id: 5,
      question: "What is the value of π (pi) to two decimal places?",
      options: ["3.14", "3.41", "3.12", "3.16"],
      answer: "3.14",
    },
    {
      id: 6,
      question: "What is the area of a circle with radius 5 units?",
      options: ["25π square units", "10π square units", "5π square units", "15π square units"],
      answer: "25π square units",
    },
    {
      id: 7,
      question: "What is the sum of the interior angles of a pentagon?",
      options: ["360°", "540°", "720°", "900°"],
      answer: "540°",
    },
    {
      id: 8,
      question: "Simplify: (3² + 4²)½",
      options: ["5", "7", "25", "3"],
      answer: "5",
    },
    {
      id: 9,
      question: "What is 25% of 80?",
      options: ["20", "25", "40", "15"],
      answer: "20",
    },
    {
      id: 10,
      question: "If f(x) = 2x + 3, what is f(4)?",
      options: ["7", "8", "11", "14"],
      answer: "11",
    },
  ],
  science: [
    {
      id: 1,
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      answer: "Au",
    },
    {
      id: 2,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      answer: "Mars",
    },
    // Add 8 more science questions
    {
      id: 3,
      question: "What is the largest organ in the human body?",
      options: ["Heart", "Liver", "Skin", "Brain"],
      answer: "Skin",
    },
    {
      id: 4,
      question: "What is the hardest natural substance on Earth?",
      options: ["Gold", "Iron", "Diamond", "Platinum"],
      answer: "Diamond",
    },
    {
      id: 5,
      question: "Which of these is NOT a state of matter?",
      options: ["Solid", "Liquid", "Gas", "Energy"],
      answer: "Energy",
    },
    {
      id: 6,
      question: "What is the process by which plants make their own food called?",
      options: ["Respiration", "Photosynthesis", "Digestion", "Absorption"],
      answer: "Photosynthesis",
    },
    {
      id: 7,
      question: "What is the closest star to Earth?",
      options: ["Proxima Centauri", "Alpha Centauri", "The Sun", "Sirius"],
      answer: "The Sun",
    },
    {
      id: 8,
      question: "What is the unit of electric current?",
      options: ["Volt", "Watt", "Ampere", "Ohm"],
      answer: "Ampere",
    },
    {
      id: 9,
      question: "Which element has the chemical symbol 'O'?",
      options: ["Osmium", "Oxygen", "Oganesson", "Olivine"],
      answer: "Oxygen",
    },
    {
      id: 10,
      question: "What is the speed of light in a vacuum?",
      options: ["300,000 km/s", "150,000 km/s", "200,000 km/s", "250,000 km/s"],
      answer: "300,000 km/s",
    },
  ],
  history: [
    {
      id: 1,
      question: "In which year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      answer: "1945",
    },
    {
      id: 2,
      question: "Who was the first President of the United States?",
      options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
      answer: "George Washington",
    },
    // Add 8 more history questions
    {
      id: 3,
      question: "Which ancient civilization built the pyramids at Giza?",
      options: ["Romans", "Greeks", "Egyptians", "Persians"],
      answer: "Egyptians",
    },
    {
      id: 4,
      question: "The Renaissance period began in which country?",
      options: ["France", "England", "Italy", "Spain"],
      answer: "Italy",
    },
    {
      id: 5,
      question: "Who wrote the 'I Have a Dream' speech?",
      options: ["Malcolm X", "Martin Luther King Jr.", "John F. Kennedy", "Rosa Parks"],
      answer: "Martin Luther King Jr.",
    },
    {
      id: 6,
      question: "Which year did the Berlin Wall fall?",
      options: ["1987", "1989", "1991", "1993"],
      answer: "1989",
    },
    {
      id: 7,
      question: "Who was the first woman to fly solo across the Atlantic Ocean?",
      options: ["Amelia Earhart", "Bessie Coleman", "Harriet Quimby", "Jacqueline Cochran"],
      answer: "Amelia Earhart",
    },
    {
      id: 8,
      question: "The Industrial Revolution began in which country?",
      options: ["United States", "France", "Germany", "Great Britain"],
      answer: "Great Britain",
    },
    {
      id: 9,
      question: "Which empire was ruled by Genghis Khan?",
      options: ["Roman Empire", "Ottoman Empire", "Mongol Empire", "Byzantine Empire"],
      answer: "Mongol Empire",
    },
    {
      id: 10,
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      answer: "Leonardo da Vinci",
    },
  ],
  english: [
    {
      id: 1,
      question: "Which of these is a synonym for 'happy'?",
      options: ["Sad", "Joyful", "Angry", "Tired"],
      answer: "Joyful",
    },
    {
      id: 2,
      question: "What is the past tense of 'run'?",
      options: ["Running", "Ran", "Runned", "Runs"],
      answer: "Ran",
    },
    // Add 8 more english questions
    {
      id: 3,
      question: 'Which of these is an example of a pronoun?",hich of these is an example of a pronoun?',
      options: ["Run", "Beautiful", "She", "Quickly"],
      answer: "She",
    },
    {
      id: 4,
      question: "What is the plural form of 'child'?",
      options: ["Childs", "Children", "Childes", "Childies"],
      answer: "Children",
    },
    {
      id: 5,
      question: "Which of these is an antonym for 'brave'?",
      options: ["Courageous", "Fearless", "Cowardly", "Bold"],
      answer: "Cowardly",
    },
    {
      id: 6,
      question: "What is the main verb in the sentence: 'She walks to school every day'?",
      options: ["She", "Walks", "School", "Every"],
      answer: "Walks",
    },
    {
      id: 7,
      question: "Which punctuation mark ends an interrogative sentence?",
      options: ["Period", "Comma", "Exclamation mark", "Question mark"],
      answer: "Question mark",
    },
    {
      id: 8,
      question: "What literary device is used when giving human qualities to non-human things?",
      options: ["Simile", "Metaphor", "Personification", "Alliteration"],
      answer: "Personification",
    },
    {
      id: 9,
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"],
      answer: "William Shakespeare",
    },
    {
      id: 10,
      question: "What is the correct spelling?",
      options: ["Accomodate", "Accommodate", "Acommodate", "Accomadate"],
      answer: "Accommodate",
    },
  ],
}

export default function QuizPage() {
  const router = useRouter()
  const [quizType, setQuizType] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [answers, setAnswers] = useState<string[]>([])
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  const handleStartQuiz = () => {
    if (!quizType) return

    setQuizStarted(true)
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setAnswers([])
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = () => {
    // Save the answer
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedAnswer
    setAnswers(newAnswers)

    // Check if answer is correct
    const currentQuizQuestions = questions[quizType as keyof typeof questions]
    if (selectedAnswer === currentQuizQuestions[currentQuestion].answer) {
      setScore(score + 1)
    }

    // Move to next question or show results
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
    } else {
      setShowResult(true)

      // Check if all answers are correct for celebration
      if (score + (selectedAnswer === currentQuizQuestions[currentQuestion].answer ? 1 : 0) === 10) {
        setShowCelebration(true)
        confetti()

        // Reset celebration after 2 seconds
        setTimeout(() => {
          setShowCelebration(false)
        }, 2000)
      }
    }
  }

  const handleRestartQuiz = () => {
    setQuizStarted(false)
    setQuizType("")
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setAnswers([])
    setSelectedAnswer("")
  }

  // Get current quiz questions
  const currentQuizQuestions = quizType ? questions[quizType as keyof typeof questions] : []

  return (
    <DashboardLayout>
      <div
        className={`p-6 min-h-screen ${showCelebration ? "bg-gradient-to-r from-yellow-200 via-pink-200 to-yellow-200 transition-colors duration-500" : ""}`}
      >
        <h1 className="text-3xl font-bold mb-6">Quiz</h1>

        {!quizStarted ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Start a New Quiz</CardTitle>
              <CardDescription>Select a quiz type to begin. Each quiz contains 10 questions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quiz-type">Quiz Type</Label>
                  <Select value={quizType} onValueChange={setQuizType}>
                    <SelectTrigger id="quiz-type">
                      <SelectValue placeholder="Select a quiz type" />
                    </SelectTrigger>
                    <SelectContent>
                      {quizTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartQuiz} disabled={!quizType} className="w-full">
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        ) : showResult ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Quiz Results</CardTitle>
              <CardDescription>You scored {score} out of 10 questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={score * 10} className="h-3" />

                {score === 10 && (
                  <Alert className="bg-green-100 border-green-200">
                    <FiCheck className="h-5 w-5 text-green-600" />
                    <AlertTitle className="text-green-800">Perfect Score!</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Congratulations! You got all questions correct.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  {currentQuizQuestions.map((q, index) => {
                    const isCorrect = answers[index] === q.answer
                    return (
                      <div
                        key={q.id}
                        className={`p-3 rounded-md ${isCorrect ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}
                      >
                        <div className="flex items-start gap-2">
                          {isCorrect ? (
                            <FiCheck className="h-5 w-5 text-green-600 mt-0.5" />
                          ) : (
                            <FiX className="h-5 w-5 text-red-600 mt-0.5" />
                          )}
                          <div>
                            <p className="font-medium">{q.question}</p>
                            <p className="text-sm">
                              Your answer:{" "}
                              <span className={isCorrect ? "text-green-600" : "text-red-600"}>{answers[index]}</span>
                            </p>
                            {!isCorrect && <p className="text-sm text-green-600">Correct answer: {q.answer}</p>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleRestartQuiz} className="w-full">
                Start a New Quiz
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Question {currentQuestion + 1} of 10</CardTitle>
                <div className="text-sm text-muted-foreground">Score: {score}</div>
              </div>
              <Progress value={currentQuestion * 10} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h2 className="text-xl font-medium">{currentQuizQuestions[currentQuestion].question}</h2>

                <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                  <div className="space-y-2">
                    {currentQuizQuestions[currentQuestion].options.map((option) => (
                      <div key={option} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleNextQuestion} disabled={!selectedAnswer} className="w-full">
                {currentQuestion < 9 ? "Next Question" : "Finish Quiz"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

