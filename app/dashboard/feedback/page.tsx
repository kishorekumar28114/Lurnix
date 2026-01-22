"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FiSend, FiThumbsUp } from "react-icons/fi"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"

export default function FeedbackPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [feedbackType, setFeedbackType] = useState("suggestion")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [rating, setRating] = useState("5")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We appreciate your input.",
      })

      // Reset form after submission
      setFeedbackType("suggestion")
      setSubject("")
      setMessage("")
      setRating("5")
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Share Your Feedback</h1>
          <p className="text-muted-foreground mb-6">
            We value your opinion and would love to hear your thoughts on how we can improve.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Feedback Form</CardTitle>
              <CardDescription>
                Please fill out the form below to submit your feedback, suggestions, or report issues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Feedback Type</Label>
                  <RadioGroup value={feedbackType} onValueChange={setFeedbackType} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="suggestion" id="suggestion" />
                      <Label htmlFor="suggestion" className="cursor-pointer">
                        Suggestion
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="issue" id="issue" />
                      <Label htmlFor="issue" className="cursor-pointer">
                        Report an Issue
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="praise" id="praise" />
                      <Label htmlFor="praise" className="cursor-pointer">
                        Praise
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="cursor-pointer">
                        Other
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your feedback"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Feedback</Label>
                  <Textarea
                    id="message"
                    placeholder="Please provide details about your feedback..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rate Your Experience</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Button
                        key={value}
                        type="button"
                        variant={rating === value.toString() ? "default" : "outline"}
                        className="h-10 w-10 p-0"
                        onClick={() => setRating(value.toString())}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !subject || !message}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <FiSend className="h-4 w-4" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {submitted && (
            <Card className="mt-6 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="bg-green-100 text-green-700 p-3 rounded-full">
                    <FiThumbsUp className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-medium text-green-800">Thank You for Your Feedback!</h3>
                  <p className="text-green-700">
                    We appreciate you taking the time to share your thoughts with us. Your feedback helps us improve our
                    platform.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-base">How is my feedback used?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Your feedback is reviewed by our team and used to improve our platform. We prioritize changes based
                    on user feedback.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-base">Will I receive a response to my feedback?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    For specific issues or questions that require follow-up, our team will contact you via email within
                    2-3 business days.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-base">Can I submit anonymous feedback?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can submit feedback anonymously, but we won't be able to follow up with you directly if
                    needed.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div> */}
        </div>
      </div>
    </DashboardLayout>
  )
}

