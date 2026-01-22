"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FiList, FiMessageSquare, FiCpu, FiBookmark, FiBookOpen, FiMic, FiGrid, FiCode } from "react-icons/fi"
import DashboardLayout from "@/components/dashboard-layout"

export default function FeaturesPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  const features = [
    // {
    //   id: "quiz",
    //   icon: <FiList className="h-8 w-8" />,
    //   title: "Interactive Quizzes",
    //   description: "Test your knowledge with our interactive quizzes covering various subjects.",
    //   details: [
    //     "Multiple quiz categories including Math, Science, History, and English",
    //     "Instant feedback on your answers",
    //     "Track your progress and scores",
    //     "Celebration animations for perfect scores",
    //     "Review your answers after completing the quiz",
    //   ],
    //   path: "/dashboard/quiz",
    // },
    // {
    //   id: "chatbot",
    //   icon: <FiMessageSquare className="h-8 w-8" />,
    //   title: "AI Chatbot",
    //   description: "Get help from our AI-powered chatbot for your learning needs.",
    //   details: [
    //     "24/7 assistance for your questions",
    //     "Specialized in mathematics tutoring",
    //     "Step-by-step problem solving",
    //     "Natural language understanding",
    //     "Personalized learning recommendations",
    //   ],
    //   path: "/dashboard/chatbot",
    // },
    // {
    //   id: "ar",
    //   icon: <FiCpu className="h-8 w-8" />,
    //   title: "Augmented Reality",
    //   description: "Experience learning in a new dimension with our AR application.",
    //   details: [
    //     "Visualize 3D mathematical models",
    //     "Scan printed problems for interactive solutions",
    //     "Explore geometric shapes in 3D space",
    //     "Interactive equations that come to life",
    //     "Compatible with Android 8.0+ devices",
    //   ],
    //   path: "/dashboard/ar",
    // },
    // {
    //   id: "resources",
    //   icon: <FiBookmark className="h-8 w-8" />,
    //   title: "Learning Resources",
    //   description: "Access a wide range of educational materials to enhance your learning.",
    //   details: [
    //     "Downloadable e-books on various subjects",
    //     "Educational videos with expert explanations",
    //     "Printable worksheets for practice",
    //     "Organized by subject and difficulty level",
    //     "Regularly updated with new content",
    //   ],
    //   path: "/dashboard/resources",
    // },
    // {
    //   id: "community",
    //   icon: <FiBookOpen className="h-8 w-8" />,
    //   title: "Community Forums",
    //   description: "Connect with fellow learners and educators in our community forums.",
    //   details: [
    //     "Ask questions and get answers from the community",
    //     "Share your knowledge and help others",
    //     "Participate in weekly challenges and discussions",
    //     "Join subject-specific groups",
    //     "Stay updated with the latest educational trends",
    //   ],
    //   path: "/dashboard/community",
    // },
    // {
    //   id: "voice",
    //   icon: <FiMic className="h-8 w-8" />,
    //   title: "Voice to Chat",
    //   description: "Convert your voice to text and interact with our AI assistant.",
    //   details: [
    //     "Speech-to-text conversion for hands-free interaction",
    //     "AI-generated responses to your queries",
    //     "Text-to-speech functionality for listening to responses",
    //     "Support for multiple languages (coming soon)",
    //     "Voice command recognition for app navigation",
    //   ],
    //   path: "/dashboard/voice-to-chat",
    // },
    {
      id: "visualization",
      icon: <FiGrid className="h-8 w-8" />,
      title: "2D Visualization",
      description: "Visualize geometric shapes and mathematical graphs in 2D space.",
      details: [
        "Interactive canvas for drawing shapes and graphs",
        "Support for various geometric shapes (circle, square, rectangle, etc.)",
        "Mathematical function plotting (linear, quadratic, sine, etc.)",
        "Coordinate system with grid and axes",
        "Download option for created visualizations",
      ],
      path: "/dashboard/visualization",
    },
    {
      id: "codeblocks",
      icon: <FiCode className="h-8 w-8" />,
      title: "Code Blocks",
      description: "Learn programming concepts with interactive code blocks.",
      details: [
        "Visual block-based programming interface",
        "Real-time JavaScript code generation",
        "Execute code directly in the browser",
        "Perfect for beginners learning programming logic",
        "Supports various programming constructs",
      ],
      path: "/dashboard/codeblocks",
    },
  ]

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Platforms for Visualization</h1>
          <p className="text-muted-foreground mb-6">Explore all the features available on our learning platform.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((feature) => (
              <Card key={feature.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="bg-primary/10 p-3 rounded-full w-fit mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" onClick={() => router.push(feature.path)}>
                    Launch
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* <Tabs defaultValue="visualization" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="visualization" className="flex items-center gap-2">
                <FiGrid className="h-4 w-4" />
                <span>2D Visualization</span>
              </TabsTrigger>
              <TabsTrigger value="codeblocks" className="flex items-center gap-2">
                <FiCode className="h-4 w-4" />
                <span>Code Blocks</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visualization" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>2D Visualization Tool</CardTitle>
                  <CardDescription>
                    Draw geometric shapes and plot mathematical functions on an interactive canvas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <img
                    src="/placeholder.svg?height=300&width=500"
                    alt="2D Visualization Preview"
                    className="rounded-md border"
                  />
                </CardContent>
                <CardContent className="pt-0">
                  <Button className="w-full" onClick={() => router.push("/dashboard/visualization")}>
                    Open 2D Visualization Tool
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="codeblocks" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Code Blocks Editor</CardTitle>
                  <CardDescription>
                    Learn programming concepts with our visual block-based coding environment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <img
                    src="/placeholder.svg?height=300&width=500"
                    alt="Code Blocks Preview"
                    className="rounded-md border"
                  />
                </CardContent>
                <CardContent className="pt-0">
                  <Button className="w-full" onClick={() => router.push("/dashboard/codeblocks")}>
                    Open Code Blocks Editor
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs> */}
        </div>
      </div>
    </DashboardLayout>
  )
}

