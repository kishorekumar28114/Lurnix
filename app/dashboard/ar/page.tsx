"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FiDownload, FiInfo } from "react-icons/fi"
import DashboardLayout from "@/components/dashboard-layout"
import Image from "next/image"

export default function ARPage() {
  const router = useRouter()
  const apkUrl = "https://drive.google.com/uc?export=download&id=1T16hrH2BCz0Lv2Txc2cuBI_Ve5JSlcG8"

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  const handleDownload = () => {
    window.location.href = apkUrl // Trigger download
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Experience Augmented Reality! 🚀</h1>
            <p className="text-muted-foreground">
              Enhance your learning with interactive 3D models using AR technology.
            </p>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="bg-gradient-to-br from-amber-50 to-yellow-100 p-8 flex items-center justify-center">
                  <div className="relative w-full aspect-square max-w-xs">
                    <Image
                      src="/ar.jpg"
                      alt="AR Demo"
                      width={600}
                      height={600}
                      className="rounded-md shadow-lg"
                    />
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">How to Use the AR App?</h2>
                    <ol className="space-y-3 text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="bg-primary/10 text-primary font-medium h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                          1
                        </span>
                        <span>
                          Click the <strong>Download AR App</strong> button below.
                        </span>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-primary/10 text-primary font-medium h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                          2
                        </span>
                        <span>Install the APK on your Android device.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="bg-primary/10 text-primary font-medium h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
                          3
                        </span>
                        <span>Open the app and scan math problems to see 3D models!</span>
                      </li>
                    </ol>
                  </div>

                 <br /><br />

                  <Button onClick={handleDownload} className="w-full">
                    <FiDownload className="mr-2 h-4 w-4" />
                    Download AR App
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

