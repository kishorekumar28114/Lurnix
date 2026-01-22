"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FiDownload, FiInfo } from "react-icons/fi"
import DashboardLayout from "@/components/dashboard-layout"

export default function VisualizationPage() {
  const router = useRouter()
  const [question, setQuestion] = useState("")
  const [error, setError] = useState("")
  const [isDrawn, setIsDrawn] = useState(false)
  const [selectedShape, setSelectedShape] = useState("")
  const canvasRef = useRef(null)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }

    // Initialize canvas with grid and axes
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawGrid(ctx)
      drawAxes(ctx)
    }
  }, [router])

  const drawGrid = (ctx) => {
    ctx.strokeStyle = "#eee"
    for (let x = 0; x <= 400; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, 400)
      ctx.stroke()
    }
    for (let y = 0; y <= 400; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(400, y)
      ctx.stroke()
    }
  }

  const drawAxes = (ctx) => {
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(200, 0)
    ctx.lineTo(200, 400)
    ctx.moveTo(0, 200)
    ctx.lineTo(400, 200)
    ctx.stroke()
    ctx.lineWidth = 1

    ctx.font = "14px Arial"
    ctx.fillStyle = "#000"
    ctx.fillText("Y", 205, 10)
    ctx.fillText("X", 390, 195)
  }

  const drawCircle = (ctx) => {
    ctx.beginPath()
    ctx.arc(200, 200, 60, 0, Math.PI * 2)
    ctx.fillStyle = "#FF6B6B"
    ctx.fill()
    ctx.strokeStyle = "#333"
    ctx.stroke()
  }

  const drawSquare = (ctx) => {
    ctx.fillStyle = "#4ECDC4"
    ctx.fillRect(130, 130, 140, 140)
    ctx.strokeStyle = "#333"
    ctx.strokeRect(130, 130, 140, 140)
  }

  const drawRectangle = (ctx) => {
    ctx.fillStyle = "#FFD93D"
    ctx.fillRect(100, 140, 200, 120)
    ctx.strokeStyle = "#333"
    ctx.strokeRect(100, 140, 200, 120)
  }

  const drawPolygon = (ctx, sides) => {
    const radius = 70
    const angle = (Math.PI * 2) / sides
    ctx.beginPath()
    for (let i = 0; i < sides; i++) {
      const x = 200 + radius * Math.cos(i * angle - Math.PI / 2)
      const y = 200 + radius * Math.sin(i * angle - Math.PI / 2)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fillStyle = "#A66DD4"
    ctx.fill()
    ctx.strokeStyle = "#333"
    ctx.stroke()
  }

  const drawStar = (ctx) => {
    const points = 5
    const outerRadius = 60
    const innerRadius = 25
    const angle = Math.PI / points
    ctx.beginPath()
    for (let i = 0; i < 2 * points; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius
      const x = 200 + r * Math.cos(i * angle - Math.PI / 2)
      const y = 200 + r * Math.sin(i * angle - Math.PI / 2)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fillStyle = "#FFB347"
    ctx.fill()
    ctx.strokeStyle = "#333"
    ctx.stroke()
  }

  const drawLinearGraph = (ctx) => {
    ctx.strokeStyle = "#FF6347"
    ctx.beginPath()
    ctx.moveTo(0, 400)
    ctx.lineTo(400, 0)
    ctx.stroke()
  }

  const drawQuadraticGraph = (ctx) => {
    ctx.strokeStyle = "#1E90FF"
    ctx.beginPath()
    for (let x = -200; x <= 200; x++) {
      const y = 200 - (x * x) / 100
      ctx.lineTo(x + 200, y)
    }
    ctx.stroke()
  }

  const drawCubicGraph = (ctx) => {
    ctx.strokeStyle = "#32CD32"
    ctx.beginPath()
    for (let x = -200; x <= 200; x++) {
      const y = 200 - (x * x * x) / 8000
      ctx.lineTo(x + 200, y)
    }
    ctx.stroke()
  }

  const drawSineWave = (ctx) => {
    ctx.strokeStyle = "#FF69B4"
    ctx.beginPath()
    for (let x = 0; x <= 400; x++) {
      const y = 200 - 50 * Math.sin((x * Math.PI) / 100)
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  const drawCosineWave = (ctx) => {
    ctx.strokeStyle = "#8A2BE2"
    ctx.beginPath()
    for (let x = 0; x <= 400; x++) {
      const y = 200 - 50 * Math.cos((x * Math.PI) / 100)
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  const drawEllipse = (ctx) => {
    ctx.beginPath()
    ctx.ellipse(200, 200, 90, 60, 0, 0, Math.PI * 2)
    ctx.fillStyle = "#87CEFA"
    ctx.fill()
    ctx.strokeStyle = "#333"
    ctx.stroke()
  }

  const drawParabola = (ctx) => {
    ctx.strokeStyle = "#0099CC"
    ctx.beginPath()
    for (let x = -200; x <= 200; x++) {
      const y = 200 - (x * x) / 100
      ctx.lineTo(x + 200, y)
    }
    ctx.stroke()
  }

  const drawHyperbola = (ctx) => {
    ctx.strokeStyle = "#FF4500"
    ctx.beginPath()
    for (let x = 1; x <= 200; x++) {
      const y = 200 - 10000 / x
      ctx.lineTo(x + 200, y)
    }
    for (let x = 1; x <= 200; x++) {
      const y = 200 + 10000 / x
      ctx.lineTo(200 - x, y)
    }
    ctx.stroke()
  }

  const isGraphType = (q) => {
    return ["linear", "quadratic", "cubic", "sine", "cosine", "parabola", "hyperbola", "ellipse"].some((type) =>
      q.includes(type),
    )
  }

  const handleSolve = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const questionLower = question.toLowerCase() || selectedShape.toLowerCase()
    setError("")
    setIsDrawn(true)

    if (isGraphType(questionLower)) {
      drawGrid(ctx)
      drawAxes(ctx)
    }

    if (questionLower.includes("circle")) drawCircle(ctx)
    else if (questionLower.includes("square")) drawSquare(ctx)
    else if (questionLower.includes("rectangle")) drawRectangle(ctx)
    else if (questionLower.includes("pentagon")) drawPolygon(ctx, 5)
    else if (questionLower.includes("hexagon")) drawPolygon(ctx, 6)
    else if (questionLower.includes("star")) drawStar(ctx)
    else if (questionLower.includes("linear")) drawLinearGraph(ctx)
    else if (questionLower.includes("quadratic")) drawQuadraticGraph(ctx)
    else if (questionLower.includes("cubic")) drawCubicGraph(ctx)
    else if (questionLower.includes("sine")) drawSineWave(ctx)
    else if (questionLower.includes("cosine")) drawCosineWave(ctx)
    else if (questionLower.includes("ellipse")) drawEllipse(ctx)
    else if (questionLower.includes("parabola")) drawParabola(ctx)
    else if (questionLower.includes("hyperbola")) drawHyperbola(ctx)
    else {
      setError("Sorry, I don't recognize that shape or graph type.")
      setIsDrawn(false)
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    const link = document.createElement("a")
    link.download = "drawing.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const shapeOptions = [
    { value: "circle", label: "Circle" },
    { value: "square", label: "Square" },
    { value: "rectangle", label: "Rectangle" },
    { value: "pentagon", label: "Pentagon" },
    { value: "hexagon", label: "Hexagon" },
    { value: "star", label: "Star" },
    { value: "linear", label: "Linear Function" },
    { value: "quadratic", label: "Quadratic Function" },
    { value: "cubic", label: "Cubic Function" },
    { value: "sine", label: "Sine Wave" },
    { value: "cosine", label: "Cosine Wave" },
    { value: "ellipse", label: "Ellipse" },
    { value: "parabola", label: "Parabola" },
    { value: "hyperbola", label: "Hyperbola" },
  ]

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">2D Visualization Tool</h1>
          <p className="text-muted-foreground mb-6">
            Visualize geometric shapes and mathematical functions on an interactive canvas.
          </p>

          <div className="grid md:grid-cols-[1fr_400px] gap-6">
            <Card className="order-2 md:order-1">
              <CardHeader>
                <CardTitle>Canvas</CardTitle>
                <CardDescription>Your visualization will appear here</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="border border-border rounded-md bg-white"
                ></canvas>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/dashboard/features")}>
                  Back to Features
                </Button>
                <Button onClick={handleDownload} disabled={!isDrawn}>
                  <FiDownload className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>

            <Card className="order-1 md:order-2">
              <CardHeader>
                <CardTitle>Controls</CardTitle>
                <CardDescription>Enter a shape or select from the dropdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shape-input">Enter a shape or graph</Label>
                  <Input
                    id="shape-input"
                    placeholder="e.g., circle, sine wave, quadratic..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shape-select">Or select from options</Label>
                  <Select value={selectedShape} onValueChange={setSelectedShape}>
                    <SelectTrigger id="shape-select">
                      <SelectValue placeholder="Select a shape or function" />
                    </SelectTrigger>
                    <SelectContent>
                      {shapeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={handleSolve}>
                  Draw
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

