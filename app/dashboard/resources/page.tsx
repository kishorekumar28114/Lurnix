"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DashboardLayout from "@/components/dashboard-layout"
import { FiSearch, FiExternalLink } from "react-icons/fi"

interface VideoResult {
  title: string
  link: string
  snippet: string
}

export default function ResourcesPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<VideoResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  async function searchVideos() {
    if (!query.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": "e604cec13f595e905ade07348c8a19aa102cb8e1", // Replace this with your real API key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: "site:youtube.com " + query,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch search results")
      }

      const data = await response.json()

      if (data.organic && Array.isArray(data.organic)) {
        setResults(data.organic.slice(0, 5))
      } else {
        setResults([])
      }
    } catch (err) {
      console.error(err)
      setError("An error occurred while searching. Please try again.")
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      searchVideos()
    }
  }

  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const parts = url.split("v=")
    if (parts.length > 1) {
      const idPart = parts[1].split("&")[0]
      return idPart
    }
    return null
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-card text-center">
              <CardTitle className="text-2xl">🔍 Smart Resource Search</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                {/* Search Input */}
                <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search something like Human Anatomy"
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={searchVideos} disabled={isLoading} className="whitespace-nowrap">
                    <FiSearch className="mr-2 h-4 w-4" />
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </div>

                {/* Error Message */}
                {error && <div className="text-red-500 text-center">{error}</div>}

                {/* Results */}
                <div className="results">
                  {results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {results.map((video, index) => {
                        const videoId = getVideoId(video.link)
                        const thumbnail = videoId
                          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                          : "/placeholder.svg?height=180&width=320"

                        return (
                          <Card key={index} className="overflow-hidden">
                            <div className="aspect-video relative">
                              <img
                                src={thumbnail || "/placeholder.svg"}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <Button variant="secondary" size="sm" asChild>
                                  <a
                                    href={video.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center"
                                  >
                                    <FiExternalLink className="mr-2 h-4 w-4" />
                                    Watch on YouTube
                                  </a>
                                </Button>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <a
                                href={video.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:underline block mb-2"
                              >
                                {video.title}
                              </a>
                              <p className="text-sm text-muted-foreground line-clamp-3">{video.snippet}</p>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                    !isLoading &&
                    query && (
                      <div className="text-center text-muted-foreground">
                        No results found. Try a different search term.
                      </div>
                    )
                  )}

                  {!results.length && !query && !isLoading && (
                    <div className="text-center text-muted-foreground py-12">
                      <div className="text-5xl mb-4">🔍</div>
                      <h3 className="text-xl font-medium mb-2">Search for Educational Resources</h3>
                      <p>Enter a topic above to find relevant YouTube videos</p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
