"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  FiHome,
  FiList,
  FiMessageSquare,
  FiCpu,
  FiBookmark,
  FiBookOpen,
  FiMic,
  FiBox,
  FiMenu,
  FiLogOut,
  FiMessageCircle,
} from "react-icons/fi"
import { useMobile } from "@/hooks/use-mobile"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMobile()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  const navItems = [
    { name: "Dashboard", icon: <FiHome className="h-5 w-5" />, path: "/dashboard" },
    { name: "Quiz", icon: <FiList className="h-5 w-5" />, path: "/dashboard/quiz" },
    { name: "Chatbot", icon: <FiMessageSquare className="h-5 w-5" />, path: "/dashboard/chatbot" },
    { name: "AR Learning", icon: <FiCpu className="h-5 w-5" />, path: "/dashboard/ar" },
    { name: "Resources", icon: <FiBookmark className="h-5 w-5" />, path: "/dashboard/resources" },
    { name: "Community", icon: <FiBookOpen className="h-5 w-5" />, path: "/dashboard/community" },
    { name: "Voice to Chat", icon: <FiMic className="h-5 w-5" />, path: "/dashboard/voice-to-chat" },
    { name: "Features", icon: <FiBox className="h-5 w-5" />, path: "/dashboard/features" },
    { name: "Feedback", icon: <FiMessageCircle className="h-5 w-5" />, path: "/dashboard/feedback" },
  ]

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.path
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        )
      })}
    </>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Navigation */}
      {isMobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <FiMenu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">User</p>
                    <p className="text-sm text-muted-foreground">user@example.com</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-1">
                <NavLinks />
              </div>
              <div className="p-4 border-t">
                <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleLogout}>
                  <FiLogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex flex-col flex-grow border-r bg-card">
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">User</p>
                  <p className="text-sm text-muted-foreground">user@example.com</p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-1">
              <NavLinks />
            </div>
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleLogout}>
                <FiLogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex flex-col flex-1 ${!isMobile ? "md:pl-64" : ""}`}>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

