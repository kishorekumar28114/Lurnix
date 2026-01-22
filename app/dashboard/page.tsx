"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { FiBookOpen, FiMessageSquare, FiCpu, FiBox, FiBookmark, FiMic, FiList, FiMessageCircle } from "react-icons/fi"
import DashboardLayout from "@/components/dashboard-layout"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Quick login state check
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [router])

  const features = [
    {
      title: "Quiz",
      icon: <FiList className="h-8 w-8" />,
      description: "Test your knowledge with interactive quizzes",
      path: "/dashboard/quiz",
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "Chatbot",
      icon: <FiMessageSquare className="h-8 w-8" />,
      description: "Get help from our AI-powered chatbot",
      path: "/dashboard/chatbot",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "AR Learning",
      icon: <FiCpu className="h-8 w-8" />,
      description: "Experience augmented reality learning",
      path: "/dashboard/ar",
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Resources",
      icon: <FiBookmark className="h-8 w-8" />,
      description: "Access learning materials and resources",
      path: "/dashboard/resources",
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Community",
      icon: <FiBookOpen className="h-8 w-8" />,
      description: "Join our learning community forums",
      path: "/dashboard/community",
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Voice to Chat",
      icon: <FiMic className="h-8 w-8" />,
      description: "Convert your voice to text and chat with AI",
      path: "/dashboard/voice-to-chat",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      title: "Features",
      icon: <FiBox className="h-8 w-8" />,
      description: "Discover all available features and tools",
      path: "/dashboard/features",
      color: "bg-orange-100 text-orange-700",
    },
    {
      title: "Feedback",
      icon: <FiMessageCircle className="h-8 w-8" />,
      description: "Share your thoughts and suggestions",
      path: "/dashboard/feedback",
      color: "bg-teal-100 text-teal-700",
    },
  ]

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Welcome to your learning dashboard. Select a feature to get started.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(feature.path)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${feature.color}`}>{feature.icon}</div>
                  <h2 className="text-xl font-semibold">{feature.title}</h2>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

