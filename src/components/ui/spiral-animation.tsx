'use client'
import { useEffect, useRef, useState } from 'react'

interface Star3D {
  x: number
  y: number
  z: number
  size: number
  brightness: number
}

export function SpiralAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star3D[]>([])
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !dimensions.width) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = dimensions.width
    const h = dimensions.height
    const dpr = window.devicePixelRatio || 1
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.scale(dpr, dpr)

    const starCount = Math.min(Math.floor((w * h * 0.0005)), 3000)
    const stars: Star3D[] = []
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: Math.random(),
        size: 0.3 + Math.random() * 1.2,
        brightness: 0.4 + Math.random() * 0.6,
      })
    }
    starsRef.current = stars

    const speed = 0.005

    const render = (timestamp: number) => {
      const dt = timestamp - timeRef.current
      timeRef.current = timestamp

      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, w, h)

      const cx = w / 2
      const cy = h / 2

      for (const star of stars) {
        star.z -= speed * (dt * 0.06 + 0.5)
        if (star.z <= 0) {
          star.z = 1
          star.x = (Math.random() - 0.5) * 2
          star.y = (Math.random() - 0.5) * 2
        }

        const fov = 1
        const scale = fov / star.z
        const sx = star.x * scale * w * 0.3 + cx
        const sy = star.y * scale * h * 0.3 + cy
        const size = star.size * scale * 0.5

        if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) continue

        const alpha = star.brightness * (1 - star.z)
        ctx.beginPath()
        ctx.arc(sx, sy, Math.max(size, 0.3), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha, 1)})`
        ctx.fill()

        if (size > 1.5) {
          ctx.beginPath()
          ctx.arc(sx, sy, size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200, 210, 255, ${alpha * 0.08})`
          ctx.fill()
        }
      }

      animRef.current = requestAnimationFrame(render)
    }

    animRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animRef.current)
    }
  }, [dimensions])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
