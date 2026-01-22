"use client"

import type React from "react"

import { useState, useEffect, type FormEvent } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Types based on the backend models
interface Comment {
  userId: string
  username: string
  content: string
  timestamp: string
}

interface Answer {
  _id?: string
  userId: string
  username: string
  content: string
  media: string[]
  comments: Comment[]
  upvotes: string[]
}

interface Post {
  _id: string
  userId: string
  username: string
  title: string
  description: string
  tags: string[]
  media: string[]
  answers: Answer[]
  createdAt: string
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState({
    userId: "user123", // Placeholder - would come from auth
    username: "JohnDoe", // Placeholder - would come from auth
    title: "",
    description: "",
    tags: "",
  })
  const [postMedia, setPostMedia] = useState<File[]>([])
  const [answerContent, setAnswerContent] = useState("")
  const [answerMedia, setAnswerMedia] = useState<File[]>([])
  const [activePostId, setActivePostId] = useState<string | null>(null)

  // Fetch all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/community/posts")
        const data = await response.json()
        setPosts(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching posts:", error)
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Handle creating a new post
  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("userId", newPost.userId)
    formData.append("username", newPost.username)
    formData.append("title", newPost.title)
    formData.append("description", newPost.description)

    // Add tags as an array
    const tagsArray = newPost.tags.split(",").map((tag) => tag.trim())
    tagsArray.forEach((tag) => {
      formData.append("tags", tag)
    })

    // Add media files
    postMedia.forEach((file) => {
      formData.append("media", file)
    })

    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        body: formData,
      })

      const savedPost = await response.json()
      setPosts([savedPost, ...posts])

      // Reset form
      setNewPost({
        userId: "user123",
        username: "JohnDoe",
        title: "",
        description: "",
        tags: "",
      })
      setPostMedia([])
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  // Handle submitting an answer to a post
  const handleSubmitAnswer = async (postId: string) => {
    const formData = new FormData()
    formData.append("userId", "user123") // Placeholder
    formData.append("username", "JohnDoe") // Placeholder
    formData.append("content", answerContent)

    // Add media files
    answerMedia.forEach((file) => {
      formData.append("media", file)
    })

    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        body: formData,
      })

      const updatedPost = await response.json()

      // Update the posts state with the updated post
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)))

      // Reset form
      setAnswerContent("")
      setAnswerMedia([])
      setActivePostId(null)
    } catch (error) {
      console.error("Error submitting answer:", error)
    }
  }

  // Handle file selection for post media
  const handlePostMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPostMedia(Array.from(e.target.files))
    }
  }

  // Handle file selection for answer media
  const handleAnswerMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAnswerMedia(Array.from(e.target.files))
    }
  }

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Community Forum</h1>

      <Tabs defaultValue="browse" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="browse">Browse Posts</TabsTrigger>
          <TabsTrigger value="create">Create Post</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
          {posts.length === 0 ? (
            <div className="text-center p-8 bg-muted rounded-lg">
              <p className="text-lg">No posts yet. Be the first to create one!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post) => (
                <Card key={post._id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar>
                        <AvatarFallback>{post.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{post.username}</p>
                        <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{post.description}</p>

                    {post.media.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {post.media.map((media, index) => (
                          <div key={index} className="relative h-40 rounded overflow-hidden">
                            <img
                              src={`http://localhost:5000/${media}`}
                              alt={`Media for ${post.title}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4">
                      <h3 className="font-medium mb-2">
                        {post.answers.length} {post.answers.length === 1 ? "Answer" : "Answers"}
                      </h3>

                      {post.answers.map((answer, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {answer.username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{answer.username}</span>
                          </div>

                          <p className="text-sm mb-2">{answer.content}</p>

                          {answer.media.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              {answer.media.map((media, idx) => (
                                <div key={idx} className="relative h-24 rounded overflow-hidden">
                                  <img
                                    src={`http://localhost:5000/${media}`}
                                    alt={`Media for answer`}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              👍 {answer.upvotes.length}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {activePostId === post._id ? (
                      <div className="w-full">
                        <Textarea
                          placeholder="Write your answer..."
                          value={answerContent}
                          onChange={(e) => setAnswerContent(e.target.value)}
                          className="mb-2"
                        />
                        <div className="flex items-center gap-2">
                          <Input type="file" multiple onChange={handleAnswerMediaChange} className="flex-1" />
                          <Button onClick={() => handleSubmitAnswer(post._id)}>Submit</Button>
                          <Button variant="outline" onClick={() => setActivePostId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button onClick={() => setActivePostId(post._id)}>Answer this post</Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Post</CardTitle>
              <CardDescription>Share your question or knowledge with the community</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Enter a descriptive title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={newPost.description}
                    onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                    placeholder="Provide details about your post"
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium mb-1">
                    Tags
                  </label>
                  <Input
                    id="tags"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="Enter tags separated by commas (e.g. javascript, react, help)"
                  />
                </div>

                <div>
                  <label htmlFor="media" className="block text-sm font-medium mb-1">
                    Media (optional)
                  </label>
                  <Input id="media" type="file" multiple onChange={handlePostMediaChange} />
                </div>

                <Button type="submit" className="w-full">
                  Create Post
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
