"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FiMic, FiVolume2 } from "react-icons/fi"
import DashboardLayout from "@/components/dashboard-layout"
import axios from 'axios'

export default function VoiceToChatPage() {
  const router = useRouter()
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }

    // Initialize speech synthesis
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Get available voices
      const getVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          setSelectedVoice(voices[0])
        } else {
          setTimeout(getVoices, 500)
        }
      }

      getVoices()

      // Chrome needs this event to get voices
      window.speechSynthesis.onvoiceschanged = getVoices
    }

    // Clean up
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [router])

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setError("Speech recognition is not supported in your browser.")
      return
    }

    setError("")
    setIsListening(true)

    // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript
      console.log(speechToText)
      setTranscript(speechToText)
      setIsListening(false)

      // Mock API call (replace with your actual API endpoint)
      // For demo purposes, we'll simulate a response
      // setTimeout(() => {
      //   const mockResponse = `I understood you said: "${speechToText}". This is a simulated response since we're not connecting to a real backend in this demo.`
      //   setResponse(mockResponse)

      //   // Speak the response
      //   if (selectedVoice) {
      //     const utterance = new SpeechSynthesisUtterance(mockResponse)
      //     utterance.voice = selectedVoice

      //     utterance.onstart = () => setIsSpeaking(true)
      //     utterance.onend = () => setIsSpeaking(false)

      //     window.speechSynthesis.speak(utterance)
      //   }
      // }, 1000)

      // In a real app, you would use axios like this:
      
      axios.post("/api/voice", { text: speechToText })
      .then(res => {

        console.log(res, "------------");
        const aiText = res.data.reply;
        setResponse(aiText);

        // Speak the AI response
        if (selectedVoice) {
          const utterance = new SpeechSynthesisUtterance(aiText);
          utterance.voice = selectedVoice;
          
          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => setIsSpeaking(false);
          
          window.speechSynthesis.speak(utterance);
        }
      })
      .catch(err => {
        console.error('Error with the API request:', err);
        setError('Failed to get a response from the AI service.');
      });
      
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      setError(`Speech recognition error: ${event.error}`)
      setIsListening(false)
    }

    recognition.start()
  }

  const handleSpeakResponse = () => {
    if (!response) return

    if (selectedVoice) {
      const utterance = new SpeechSynthesisUtterance(response)
      utterance.voice = selectedVoice

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Voice to Text Converter</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Speak to Chat with AI</CardTitle>
              <CardDescription>
                Click the microphone button and speak clearly to convert your voice to text.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded-md">{error}</div>
              )}

              <div className="flex justify-center">
                <Button
                  onClick={handleVoiceInput}
                  disabled={isListening}
                  className={`h-20 w-20 rounded-full ${isListening ? "bg-red-500 hover:bg-red-600" : ""}`}
                >
                  <FiMic className="h-8 w-8" />
                </Button>
              </div>

              {isListening && (
                <div className="text-center text-sm text-muted-foreground animate-pulse">Listening...</div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Speech</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Your speech will appear here..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="min-h-[120px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">AI Response</CardTitle>
                {response && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSpeakResponse}
                    disabled={isSpeaking}
                    className="h-8 w-8"
                  >
                    <FiVolume2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="AI response will appear here..."
                  value={response}
                  readOnly
                  className="min-h-[120px]"
                />
              </CardContent>
              {isSpeaking && (
                <CardFooter>
                  <div className="text-sm text-muted-foreground animate-pulse">Speaking...</div>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

