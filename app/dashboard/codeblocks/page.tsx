"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FiPlay, FiCode, FiSave, FiRefreshCw } from "react-icons/fi"
import DashboardLayout from "@/components/dashboard-layout"
import Script from "next/script"

export default function CodeBlocksPage() {
  const router = useRouter()
  const [blocklyLoaded, setBlocklyLoaded] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("// Your generated JavaScript code will appear here...")
  const [output, setOutput] = useState("")
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const workspaceRef = useRef(null)
  const blocklyDivRef = useRef(null)

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    if (blocklyLoaded && blocklyDivRef.current) {
      // Initialize Blockly
      const initBlockly = () => {
        try {
          // @ts-ignore - Blockly is loaded via script tag
          const workspace = window.Blockly.inject(blocklyDivRef.current, {
            toolbox: document.querySelector("#toolbox xml"),
          })
          workspaceRef.current = workspace
        } catch (error) {
          console.error("Error initializing Blockly:", error)
        }
      }

      // Small delay to ensure DOM is ready
      setTimeout(initBlockly, 100)
    }
  }, [blocklyLoaded])

  const handleRunCode = () => {
    if (!workspaceRef.current) return

    try {
      // @ts-ignore - Blockly is loaded via script tag
      const code = window.Blockly.JavaScript.workspaceToCode(workspaceRef.current)
      setGeneratedCode(code)
      setConsoleOutput([])

      // Override console.log to capture output
      const originalConsoleLog = console.log
      console.log = (...args) => {
        setConsoleOutput((prev) => [...prev, args.join(" ")])
        originalConsoleLog(...args)
      }

      // Execute the code
      // eslint-disable-next-line no-eval
      eval(code)

      // Restore console.log
      setTimeout(() => {
        console.log = originalConsoleLog
      }, 100)
    } catch (error) {
      if (error instanceof Error) {
        setConsoleOutput((prev) => [...prev, `Error: ${error.message}`])
      } else {
        setConsoleOutput((prev) => [...prev, `Error: ${String(error)}`])
      }
      console.error("Error executing code:", error)
    }
  }

  const handleSaveCode = () => {
    if (!workspaceRef.current) return

    try {
      // @ts-ignore - Blockly is loaded via script tag
      const code = window.Blockly.JavaScript.workspaceToCode(workspaceRef.current)
      const blob = new Blob([code], { type: "text/javascript" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = "blockly-code.js"
      link.href = url
      link.click()
    } catch (error) {
      console.error("Error saving code:", error)
    }
  }

  const handleResetWorkspace = () => {
    if (!workspaceRef.current) return

    if (confirm("Are you sure you want to clear the workspace? All blocks will be removed.")) {
      // @ts-ignore - Blockly is loaded via script tag
      workspaceRef.current.clear()
      setGeneratedCode("// Your generated JavaScript code will appear here...")
      setConsoleOutput([])
    }
  }

  return (
    <DashboardLayout>
      <Script
        src="https://unpkg.com/blockly/blockly.min.js"
        onLoad={() => setBlocklyLoaded(true)}
        strategy="afterInteractive"
      />

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Code Blocks Editor</h1>
          <p className="text-muted-foreground mb-6">
            Learn programming concepts with our visual block-based coding environment.
          </p>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Blockly Workspace</CardTitle>
                  <CardDescription>Drag and drop blocks to create your program</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRunCode} className="flex items-center gap-2">
                    <FiPlay className="h-4 w-4" />
                    Run
                  </Button>
                  <Button variant="outline" onClick={handleSaveCode} className="flex items-center gap-2">
                    <FiSave className="h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={handleResetWorkspace} className="flex items-center gap-2">
                    <FiRefreshCw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[60vh] border-y" ref={blocklyDivRef}></div>

              {/* Toolbox XML (rendered outside React's DOM) */}
              <div
                id="toolbox"
                dangerouslySetInnerHTML={{
                  __html: `
                    <xml>
                      <block type="controls_if"></block>
                      <block type="controls_repeat_ext"></block>
                      <block type="logic_compare"></block>
                      <block type="math_number"></block>
                      <block type="math_arithmetic"></block>
                      <block type="text"></block>
                      <block type="text_print"></block>
                      <block type="variables_get"></block>
                      <block type="variables_set"></block>
                      <block type="procedures_defnoreturn"></block>
                      <block type="procedures_callnoreturn"></block>
                    </xml>
                  `,
                }}
              />

              <Tabs defaultValue="code" className="p-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <FiCode className="h-4 w-4" />
                    <span>Generated Code</span>
                  </TabsTrigger>
                  <TabsTrigger value="output" className="flex items-center gap-2">
                    <FiPlay className="h-4 w-4" />
                    <span>Output</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="code" className="mt-4">
                  <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-auto max-h-[30vh]">
                    <pre>{generatedCode}</pre>
                  </div>
                </TabsContent>
                <TabsContent value="output" className="mt-4">
                  <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm overflow-auto max-h-[30vh]">
                    {consoleOutput.length > 0 ? (
                      <pre>{consoleOutput.join("\n")}</pre>
                    ) : (
                      <pre>// Program output will appear here when you run your code</pre>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/dashboard/features")}>
                Back to Features
              </Button>
              <p className="text-sm text-muted-foreground">
                Powered by{" "}
                <a
                  href="https://developers.google.com/blockly"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Blockly
                </a>
              </p>
            </CardFooter>
          </Card>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Getting Started with Code Blocks</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Step 1: Drag Blocks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Drag blocks from the toolbox on the left side of the workspace and connect them together.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Step 2: Run Your Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Click the Run button to execute your program and see the output in the Output tab.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Step 3: Save Your Work</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Use the Save button to download your JavaScript code for future reference.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

