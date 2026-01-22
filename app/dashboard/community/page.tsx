"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FiArrowUp,
  FiArrowDown,
  FiMessageSquare,
  FiShare2,
  FiBookmark,
  FiTrendingUp,
  FiStar,
  FiPlus,
} from "react-icons/fi"
import DashboardLayout from "@/components/dashboard-layout"
import axios from "axios"

export default function CommunityPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("trending")
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "Algebra" })
  const [posting, setPosting] = useState(false)
  const [postSuccess, setPostSuccess] = useState(false)
  const [postError, setPostError] = useState("")
  // Comments modal state
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsError, setCommentsError] = useState("")
  const [newComment, setNewComment] = useState("")
  const [commentPosting, setCommentPosting] = useState(false)
  const [selectedPostFormattedDate, setSelectedPostFormattedDate] = useState("")

  useEffect(() => {
    if (showCommentsModal && selectedPost && selectedPost.createdAt) {
      setSelectedPostFormattedDate(new Date(selectedPost.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }))
    } else {
      setSelectedPostFormattedDate("")
    }
  }, [showCommentsModal, selectedPost])

  const handleOpenComments = async (post: any) => {
    setSelectedPost(post)
    setShowCommentsModal(true)
    setComments([])
    setCommentsLoading(true)
    setCommentsError("")
    try {
      // Fetch single post to get comments
      const res = await axios.get(`/api/community/posts/${post.id}`)
      setComments(res.data.comments || [])
    } catch (err) {
      setCommentsError("Failed to load comments")
    } finally {
      setCommentsLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment) return
    setCommentPosting(true)
    setCommentsError("")
    try {
      const res = await axios.post(`/api/community/posts/${selectedPost.id}/comments`, {
        author: { name: "DemoUser", avatar: "DU" },
        content: newComment,
      })
      setComments([...comments, res.data])
      setNewComment("")
    } catch (err) {
      setCommentsError("Failed to post comment")
    } finally {
      setCommentPosting(false)
    }
  }

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    setLoading(true)
    axios
      .get("/api/community/posts")
      .then((res) => {
        setPosts(res.data)
        setLoading(false)
      })
      .catch((err) => {
        setError("Failed to load posts")
        setLoading(false)
      })
  }, [])

  // Categories for the sidebar
  const categories = [
    { name: "Algebra", count: 128 },
    { name: "Geometry", count: 95 },
    { name: "Calculus", count: 87 },
    { name: "Statistics", count: 64 },
    { name: "Trigonometry", count: 52 },
    { name: "AR Learning", count: 43 },
    { name: "Success Stories", count: 38 },
    { name: "Challenges", count: 31 },
    { name: "Teaching", count: 29 },
  ]

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Community</h1>
                <Button className="flex items-center gap-2" onClick={() => setShowNewPostModal(true)}>
                  <FiPlus className="h-4 w-4" />
                  New Post
                </Button>
              </div>

              <div className="mb-6">
                <Input placeholder="Search discussions..." className="w-full" />
              </div>

              <Tabs defaultValue="trending" className="w-full mb-6" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="trending" className="flex items-center gap-2">
                    <FiTrendingUp className="h-4 w-4" />
                    <span>Trending</span>
                  </TabsTrigger>
                  <TabsTrigger value="top" className="flex items-center gap-2">
                    <FiStar className="h-4 w-4" />
                    <span>Top</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-4">
                {/* New Post Modal */}
                {showNewPostModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                      <h2 className="text-xl font-bold mb-4">Create New Post</h2>
                      <div className="mb-3">
                        <Input
                          placeholder="Title"
                          value={newPost.title}
                          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                          className="mb-2"
                        />
                        <Input
                          placeholder="Content"
                          value={newPost.content}
                          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                          className="mb-2"
                        />
                        <select
                          value={newPost.category}
                          onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                          className="w-full border rounded p-2"
                        >
                          {categories.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      {postError && <div className="text-red-500 mb-2">{postError}</div>}
                      {postSuccess && <div className="text-green-600 mb-2">Post created!</div>}
                      <div className="flex gap-2 justify-end">
                        <Button variant="secondary" onClick={() => setShowNewPostModal(false)} disabled={posting}>
                          Cancel
                        </Button>
                        <Button
                          onClick={async () => {
                            setPosting(true)
                            setPostError("")
                            setPostSuccess(false)
                            try {
                              const res = await axios.post("/api/community/posts", {
                                ...newPost,
                                author: { name: "DemoUser", avatar: "DU" },
                              })
                              setPosts([res.data, ...posts])
                              setPostSuccess(true)
                              setNewPost({ title: "", content: "", category: categories[0].name })
                              setTimeout(() => setShowNewPostModal(false), 1000)
                            } catch (err: any) {
                              setPostError("Failed to create post")
                            } finally {
                              setPosting(false)
                            }
                          }}
                          disabled={posting || !newPost.title || !newPost.content}
                        >
                          {posting ? "Posting..." : "Post"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comments Modal */}
                {showCommentsModal && selectedPost && (
                  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
                      <h2 className="text-xl font-bold mb-2">{selectedPost.title}</h2>
                      <p className="text-xs text-muted-foreground">{selectedPostFormattedDate}</p>

                      <Separator className="my-4" />

                      <h3 className="font-medium mb-2">Comments</h3>

                      {commentsLoading ? (
                        <div>Loading comments...</div>
                      ) : commentsError ? (
                        <div className="text-red-500">{commentsError}</div>
                      ) : comments.length === 0 ? (
                        <div className="text-muted-foreground">No comments yet. Be the first to comment!</div>
                      ) : (
                        <div className="space-y-3 mb-4">
                          {comments.map((comment, index) => (
                            <div key={index} className="p-3 bg-muted rounded-md">
                              <div className="flex items-center gap-2 mb-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{comment.author.avatar}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm">{comment.author.name}</span>
                                {comment.timeAgo && (
                                  <>
                                    <span className="text-muted-foreground text-xs">•</span>
                                    <span className="text-muted-foreground text-xs">{comment.timeAgo}</span>
                                  </>
                                )}
                              </div>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4">
                        <Input
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="mb-2"
                        />
                        <div className="flex justify-between">
                          <Button variant="outline" onClick={() => setShowCommentsModal(false)}>
                            Close
                          </Button>
                          <Button onClick={handleAddComment} disabled={!newComment || commentPosting}>
                            {commentPosting ? "Posting..." : "Post Comment"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {loading ? (
                  <div>Loading posts...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : posts.length === 0 ? (
                  <div>No posts found.</div>
                ) : (
                  posts
                    .filter((post) => {
                      if (activeTab === "trending") return true
                      if (activeTab === "top") return post.upvotes > 100
                      return true
                    })
                    .map((post) => (
                      <Card key={post.id} className="overflow-hidden">
                        <div className="flex">
                          {/* Voting sidebar */}
                          <div className="bg-muted p-4 flex flex-col items-center justify-start gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FiArrowUp className="h-5 w-5" />
                            </Button>
                            <span className="font-medium">{post.upvotes}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FiArrowDown className="h-5 w-5" />
                            </Button>
                          </div>

                          {/* Post content */}
                          <div className="flex-1">
                            <CardHeader className="pb-2">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">{post.category}</Badge>
                                {post.isHot && (
                                  <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                                    Hot
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-xl">{post.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-0">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{post.author.avatar}</AvatarFallback>
                                </Avatar>
                                <span>{post.author.name}</span>
                                <span>•</span>
                                <span>{post.timeAgo}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-1 h-8"
                                  onClick={() => handleOpenComments(post)}
                                >
                                  <FiMessageSquare className="h-4 w-4" />
                                  <span>View Comments</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <FiBookmark className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <FiShare2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardFooter>
                          </div>
                        </div>
                      </Card>
                    ))
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-full md:w-80 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.name} className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{cat.name}</span>
                      <Badge variant="secondary">{cat.count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Separator />

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Contributors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Coming soon...</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
