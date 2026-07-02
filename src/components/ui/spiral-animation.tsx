'use client'
import { useEffect, useRef, useState } from 'react'

interface DustStar {
  x: number
  y: number
  z: number
  size: number
  brightness: number
}

interface Asteroid {
  x: number
  y: number
  z: number
  size: number
  angle: number
  spin: number
  points: { x: number; y: number }[]
  color: string
}

interface Planet {
  x: number
  y: number
  z: number
  radius: number
  color: string
  glow: string
  ringSize: number
  orbitAngle: number
  orbitSpeed: number
  moonRadius: number
  moonOrbit: number
  moonAngle: number
}

interface Galaxy {
  x: number
  y: number
  z: number
  radius: number
  arms: number
  color: string
  rotation: number
}

const DUST_COUNT = 2000
const ASTEROID_COUNT = 6
const PLANET_COUNT = 3
const GALAXY_COUNT = 2
const SPEED = 0.003

function randomPastel(saturation = 60, lightness = 60): string {
  const h = Math.floor(Math.random() * 360)
  return `hsl(${h}, ${saturation}%, ${lightness}%)`
}

function generateAsteroidShape(segments = 8): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = []
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2
    const r = 0.6 + Math.random() * 0.4
    pts.push({ x: Math.cos(a) * r, y: Math.sin(a) * r })
  }
  return pts
}

export function SpiralAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dustRef = useRef<DustStar[]>([])
  const asteroidsRef = useRef<Asteroid[]>([])
  const planetsRef = useRef<Planet[]>([])
  const galaxiesRef = useRef<Galaxy[]>([])
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

    // Generate dust stars (seamless — when z cycles back to 1, we keep x,y)
    const dust: DustStar[] = []
    for (let i = 0; i < DUST_COUNT; i++) {
      dust.push({
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 3,
        z: Math.random(),
        size: 0.2 + Math.random() * 0.8,
        brightness: 0.3 + Math.random() * 0.7,
      })
    }
    dustRef.current = dust

    // Asteroids
    const asteroids: Asteroid[] = []
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      asteroids.push({
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4,
        z: 0.15 + Math.random() * 0.35,
        size: 3 + Math.random() * 6,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
        points: generateAsteroidShape(6 + Math.floor(Math.random() * 4)),
        color: `hsl(${20 + Math.random() * 30}, ${20 + Math.random() * 30}%, ${40 + Math.random() * 30}%)`,
      })
    }
    asteroidsRef.current = asteroids

    // Planets
    const planets: Planet[] = []
    const planetColors = [
      { main: '#4a7c9b', glow: '#6a9cbb' },
      { main: '#c47a5a', glow: '#e49a7a' },
      { main: '#7a8a6a', glow: '#9aaa8a' },
      { main: '#8a6a9a', glow: '#aa8aba' },
      { main: '#9a7a6a', glow: '#ba9a8a' },
    ]
    for (let i = 0; i < PLANET_COUNT; i++) {
      const c = planetColors[i % planetColors.length]
      planets.push({
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 6,
        z: 0.05 + Math.random() * 0.2,
        radius: 6 + Math.random() * 10,
        color: c.main,
        glow: c.glow,
        ringSize: Math.random() > 0.5 ? (6 + Math.random() * 8) : 0,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitSpeed: (Math.random() - 0.5) * 0.003,
        moonRadius: Math.random() > 0.6 ? (1.5 + Math.random() * 2) : 0,
        moonOrbit: 3 + Math.random() * 4,
        moonAngle: Math.random() * Math.PI * 2,
      })
    }
    planetsRef.current = planets

    // Distant galaxies
    const galaxies: Galaxy[] = []
    const galColors = ['#6a5a8a', '#5a7a6a', '#7a5a6a']
    for (let i = 0; i < GALAXY_COUNT; i++) {
      galaxies.push({
        x: (Math.random() - 0.5) * 5,
        y: (Math.random() - 0.5) * 5,
        z: 0.01 + Math.random() * 0.04,
        radius: 20 + Math.random() * 30,
        arms: 2 + Math.floor(Math.random() * 2),
        color: galColors[i],
        rotation: Math.random() * Math.PI * 2,
      })
    }
    galaxiesRef.current = galaxies

    // Track elapsed for continuous motion
    let elapsed = 0

    const render = (timestamp: number) => {
      const dt = timeRef.current ? timestamp - timeRef.current : 16
      timeRef.current = timestamp
      elapsed += dt * SPEED

      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, w, h)

      const cx = w / 2
      const cy = h / 2

      // --- Draw galaxies (farthest back, no motion) ---
      for (const gal of galaxies) {
        const scale = 0.3 / gal.z
        const gx = gal.x * scale * w * 0.15 + cx
        const gy = gal.y * scale * h * 0.15 + cy
        const gr = gal.radius * scale * 0.03
        if (gr < 5) continue

        ctx.save()
        ctx.translate(gx, gy)
        ctx.rotate(gal.rotation + elapsed * 0.01)

        // spiral galaxy arms
        for (let a = 0; a < gal.arms; a++) {
          const armAngle = (a / gal.arms) * Math.PI * 2
          ctx.beginPath()
          for (let t = 0; t < 1; t += 0.02) {
            const r = t * gr * 0.8
            const theta = armAngle + t * Math.PI * 3 + elapsed * 0.02
            const px = r * Math.cos(theta)
            const py = r * Math.sin(theta)
            if (t === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.strokeStyle = gal.color
          ctx.lineWidth = 1.5 * (1 - 0.5)
          ctx.globalAlpha = 0.15 + 0.1 * Math.sin(elapsed * 0.5 + a)
          ctx.stroke()
        }

        // galaxy core glow
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, gr * 0.2)
        grad.addColorStop(0, gal.color)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.globalAlpha = 0.15
        ctx.fillRect(-gr * 0.2, -gr * 0.2, gr * 0.4, gr * 0.4)

        ctx.restore()
      }

      // --- Draw dust stars (seamless wrap) ---
      for (const star of dust) {
        // continuous forward motion — z goes from 1 down to 0, then wraps to 1
        star.z -= SPEED * (dt * 0.05 + 0.4)
        if (star.z <= 0) {
          star.z = 1
          star.x = (Math.random() - 0.5) * 3
          star.y = (Math.random() - 0.5) * 3
          star.size = 0.2 + Math.random() * 0.8
          star.brightness = 0.3 + Math.random() * 0.7
        }

        const fov = 1.2
        const scale = fov / star.z
        const sx = star.x * scale * w * 0.25 + cx
        const sy = star.y * scale * h * 0.25 + cy
        const size = star.size * scale * 0.4

        if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) continue

        const alpha = star.brightness * (1 - star.z * 0.7)
        ctx.beginPath()
        ctx.arc(sx, sy, Math.max(size, 0.3), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha, 1)})`
        ctx.fill()

        // tiny glow on larger stars
        if (size > 1.2) {
          ctx.beginPath()
          ctx.arc(sx, sy, size * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200, 210, 255, ${alpha * 0.06})`
          ctx.fill()
        }
      }

      // --- Draw asteroids ---
      for (const ast of asteroids) {
        // move forward slowly
        ast.z -= SPEED * (dt * 0.03 + 0.15)
        if (ast.z <= 0) {
          ast.z = 0.3 + Math.random() * 0.3
          ast.x = (Math.random() - 0.5) * 4
          ast.y = (Math.random() - 0.5) * 4
        }

        const scale = 1.2 / ast.z
        const sx = ast.x * scale * w * 0.25 + cx
        const sy = ast.y * scale * h * 0.25 + cy
        const size = ast.size * scale * 0.15

        if (sx < -100 || sx > w + 100 || sy < -100 || sy > h + 100) continue

        ast.angle += ast.spin * dt * 0.05

        ctx.save()
        ctx.translate(sx, sy)
        ctx.rotate(ast.angle)
        ctx.scale(size, size)

        ctx.beginPath()
        for (let i = 0; i < ast.points.length; i++) {
          const p = ast.points[i]
          if (i === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        }
        ctx.closePath()
        ctx.fillStyle = ast.color
        ctx.globalAlpha = 0.7
        ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.15)'
        ctx.lineWidth = 0.5 / size
        ctx.stroke()

        ctx.restore()
      }

      // --- Draw planets ---
      for (const planet of planets) {
        // planets drift slowly
        planet.orbitAngle += planet.orbitSpeed * dt * 0.05

        const scale = 1.2 / planet.z
        const offsetX = Math.sin(planet.orbitAngle) * w * 0.02
        const offsetY = Math.cos(planet.orbitAngle * 0.7) * h * 0.02
        const sx = planet.x * scale * w * 0.25 + cx + offsetX
        const sy = planet.y * scale * h * 0.25 + cy + offsetY
        const radius = planet.radius * scale * 0.15

        if (radius < 2 || sx < -200 || sx > w + 200 || sy < -200 || sy > h + 200) continue

        // ring
        if (planet.ringSize > 0) {
          const ringR = planet.ringSize * scale * 0.3
          ctx.save()
          ctx.translate(sx, sy)
          ctx.rotate(0.3)
          ctx.beginPath()
          ctx.ellipse(0, 0, ringR, ringR * 0.2, 0, 0, Math.PI * 2)
          ctx.strokeStyle = planet.glow
          ctx.lineWidth = 1.5
          ctx.globalAlpha = 0.3
          ctx.stroke()
          ctx.restore()
        }

        // planet glow
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius * 3)
        grad.addColorStop(0, planet.glow)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.globalAlpha = 0.08
        ctx.fillRect(sx - radius * 3, sy - radius * 3, radius * 6, radius * 6)

        // planet body
        ctx.beginPath()
        ctx.arc(sx, sy, radius, 0, Math.PI * 2)
        ctx.fillStyle = planet.color
        ctx.globalAlpha = 0.6
        ctx.fill()
        ctx.strokeStyle = planet.glow
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.5
        ctx.stroke()

        // moon
        if (planet.moonRadius > 0) {
          planet.moonAngle += 0.005 * dt * 0.05
          const mx = sx + Math.cos(planet.moonAngle) * planet.moonOrbit * scale * 0.2
          const my = sy + Math.sin(planet.moonAngle) * planet.moonOrbit * scale * 0.2
          const mr = planet.moonRadius * scale * 0.15
          ctx.beginPath()
          ctx.arc(mx, my, mr, 0, Math.PI * 2)
          ctx.fillStyle = '#9a9a8a'
          ctx.globalAlpha = 0.5
          ctx.fill()
        }
      }

      animRef.current = requestAnimationFrame(render)
    }

    timeRef.current = 0
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
