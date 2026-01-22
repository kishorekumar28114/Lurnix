"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/components/dashboard-layout"

export default function ChatbotPage() {
  const router = useRouter()
  const chatBoxRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!inputRef.current) return

    const userMessage = inputRef.current.value.trim()
    if (!userMessage) return

    setIsLoading(true)
    setMessages((prev) => [...prev, { role: "user", text: userMessage }])
    inputRef.current.value = ""

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await res.json()

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "bot", text: data.reply }])
      } else {
        setMessages((prev) => [...prev, { role: "bot", text: "No reply received." }])
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [...prev, { role: "bot", text: "Something went wrong." }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      sendMessage()
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-card">
              <CardTitle className="text-xl">Chatbot</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Chat Messages */}
                <div
                  ref={chatBoxRef}
                  id="chat-box"
                  className="h-[50vh] overflow-y-auto border rounded-md p-4 bg-background"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {messages.map((msg, index) => (
                    <p key={index}>
                      <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.text}
                    </p>
                  ))}
                </div>

                {/* Input Area */}
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    id="userInput"
                    placeholder="Type a message..."
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
