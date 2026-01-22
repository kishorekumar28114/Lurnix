// Simple confetti animation for celebration
export default function confetti() {
  // Create canvas element
  const canvas = document.createElement("canvas")
  canvas.style.position = "fixed"
  canvas.style.top = "0"
  canvas.style.left = "0"
  canvas.style.pointerEvents = "none"
  canvas.style.width = "100vw"
  canvas.style.height = "100vh"
  canvas.style.zIndex = "9999"
  document.body.appendChild(canvas)

  // Set canvas size
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // Confetti particles
  const particles: Particle[] = []
  const particleCount = 150
  const gravity = 0.5
  const colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FFEB3B",
    "#FFC107",
    "#FF9800",
    "#FF5722",
  ]

  // Particle class
  class Particle {
    x: number
    y: number
    color: string
    velocity: { x: number; y: number }
    size: number
    rotation: number
    rotationSpeed: number

    constructor() {
      this.x = canvas.width * Math.random()
      this.y = canvas.height * Math.random() - canvas.height
      this.color = colors[Math.floor(Math.random() * colors.length)]
      this.size = Math.random() * 10 + 5
      this.velocity = {
        x: Math.random() * 6 - 3,
        y: Math.random() * 3 + 3,
      }
      this.rotation = Math.random() * 2 * Math.PI
      this.rotationSpeed = Math.random() * 0.2 - 0.1
    }

    update() {
      this.x += this.velocity.x
      this.y += this.velocity.y
      this.velocity.y += gravity
      this.rotation += this.rotationSpeed
    }

    draw() {
      if (!ctx) return
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(this.rotation)
      ctx.fillStyle = this.color
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
      ctx.restore()
    }
  }

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle())
  }

  // Animation loop
  let animationFrameId: number
  function animate() {
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach((particle, index) => {
      particle.update()
      particle.draw()

      // Remove particles that are off screen
      if (particle.y > canvas.height) {
        particles.splice(index, 1)
      }
    })

    // Stop animation when all particles are gone
    if (particles.length === 0) {
      document.body.removeChild(canvas)
      cancelAnimationFrame(animationFrameId)
      return
    }

    animationFrameId = requestAnimationFrame(animate)
  }

  animate()

  // Clean up after 5 seconds
  setTimeout(() => {
    if (document.body.contains(canvas)) {
      document.body.removeChild(canvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, 5000)
}

