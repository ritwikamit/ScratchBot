'use client'
import { useEffect, useRef, useState } from 'react'

interface DustStar {
  x: number; y: number; z: number; size: number; brightness: number
}

interface RealPlanet {
  x: number; y: number; z: number
  radius: number; color: string; glowColor: string
  ring: number        // 0 = no ring, >0 = ring outer radius
  ringTilt: number    // tilt in radians
  name: string
  orbitAngle: number
  orbitSpeed: number
  driftX: number
  driftY: number
}

interface BlackHole {
  x: number; y: number; z: number
  radius: number
  accretion: number   // disk outer radius
  angle: number
  spin: number
}

interface Galaxy {
  x: number; y: number; z: number
  radius: number; arms: number; color: string
  rotation: number; spinSpeed: number
}

const DUST_COUNT = 1800
const SPEED = 0.003

export function SpiralAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dustRef = useRef<DustStar[]>([])
  const planetsRef = useRef<RealPlanet[]>([])
  const holesRef = useRef<BlackHole[]>([])
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

    // Dust stars
    const dust: DustStar[] = []
    for (let i = 0; i < DUST_COUNT; i++) {
      dust.push({
        x: (Math.random() - 0.5) * 3, y: (Math.random() - 0.5) * 3,
        z: Math.random(), size: 0.2 + Math.random() * 0.8, brightness: 0.3 + Math.random() * 0.7,
      })
    }
    dustRef.current = dust

    // Realistic planets — Saturn, Jupiter, Uranus, Neptune + extras
    const planets: RealPlanet[] = [
      { name: 'Jupiter', color: '#d4a06a', glowColor: '#e4b07a', radius: 12, ring: 0, ringTilt: 0, x: -2.5, y: 1.2, z: 0.08, orbitAngle: 0, orbitSpeed: 0.0004, driftX: 0, driftY: 0 },
      { name: 'Saturn', color: '#c8b878', glowColor: '#d8c888', radius: 10, ring: 18, ringTilt: 0.4, x: 3.0, y: -1.5, z: 0.12, orbitAngle: 0, orbitSpeed: -0.0003, driftX: 0, driftY: 0 },
      { name: 'Uranus', color: '#7ab8c8', glowColor: '#8ac8d8', radius: 7, ring: 11, ringTilt: 0.3, x: -1.8, y: -2.5, z: 0.06, orbitAngle: 0, orbitSpeed: 0.0005, driftX: 0, driftY: 0 },
      { name: 'Neptune', color: '#4a6a9a', glowColor: '#5a7aaa', radius: 6.5, ring: 0, ringTilt: 0, x: 2.2, y: 2.8, z: 0.09, orbitAngle: 0, orbitSpeed: -0.0002, driftX: 0, driftY: 0 },
      { name: 'Venus', color: '#c8a06a', glowColor: '#d8b07a', radius: 5, ring: 0, ringTilt: 0, x: -3.5, y: -0.5, z: 0.15, orbitAngle: 0, orbitSpeed: 0.0006, driftX: 0, driftY: 0 },
      { name: 'Mars', color: '#c06050', glowColor: '#d07060', radius: 4, ring: 0, ringTilt: 0, x: 1.0, y: -3.2, z: 0.14, orbitAngle: 0, orbitSpeed: 0.0007, driftX: 0, driftY: 0 },
    ]
    planetsRef.current = planets

    // Black holes
    const holes: BlackHole[] = [
      { x: -4, y: -3, z: 0.03, radius: 8, accretion: 25, angle: 0, spin: 0.008 },
      { x: 5, y: 4, z: 0.04, radius: 5, accretion: 18, angle: 0, spin: -0.01 },
    ]
    holesRef.current = holes

    // Galaxies
    const galaxies: Galaxy[] = [
      { x: -6, y: -5, z: 0.015, radius: 35, arms: 3, color: '#7a6a9a', rotation: 0, spinSpeed: 0.004 },
      { x: 7, y: -4, z: 0.02, radius: 25, arms: 2, color: '#6a8a7a', rotation: 1.2, spinSpeed: -0.003 },
      { x: -5, y: 6, z: 0.01, radius: 30, arms: 4, color: '#8a6a7a', rotation: 2.5, spinSpeed: 0.005 },
    ]
    galaxiesRef.current = galaxies

    let elapsed = 0

    const render = (timestamp: number) => {
      const dt = timeRef.current ? timestamp - timeRef.current : 16
      timeRef.current = timestamp
      elapsed += dt * SPEED

      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, w, h)
      const cx = w / 2
      const cy = h / 2

      // === Galaxies ===
      for (const gal of galaxies) {
        gal.rotation += gal.spinSpeed * (dt * 0.03)
        const scale = 0.3 / gal.z
        const gx = gal.x * scale * w * 0.12 + cx
        const gy = gal.y * scale * h * 0.12 + cy
        const gr = gal.radius * scale * 0.025
        if (gr < 4) continue

        ctx.save()
        ctx.translate(gx, gy)
        ctx.rotate(gal.rotation)

        for (let a = 0; a < gal.arms; a++) {
          const armA = (a / gal.arms) * Math.PI * 2
          ctx.beginPath()
          for (let t = 0; t < 1; t += 0.015) {
            const r = t * gr * 0.7
            const theta = armA + t * Math.PI * 3 + elapsed * 0.015
            const px = r * Math.cos(theta)
            const py = r * Math.sin(theta)
            if (t === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.strokeStyle = gal.color
          ctx.lineWidth = 1.2
          ctx.globalAlpha = 0.2 + 0.08 * Math.sin(elapsed * 0.4 + a)
          ctx.stroke()
        }

        const ggrad = ctx.createRadialGradient(0, 0, 0, 0, 0, gr * 0.25)
        ggrad.addColorStop(0, gal.color)
        ggrad.addColorStop(1, 'transparent')
        ctx.fillStyle = ggrad
        ctx.globalAlpha = 0.12
        ctx.fillRect(-gr * 0.25, -gr * 0.25, gr * 0.5, gr * 0.5)
        ctx.restore()
      }

      // === Black holes ===
      for (const bh of holes) {
        bh.angle += bh.spin * (dt * 0.05)
        const scale = 1.2 / bh.z
        const bx = bh.x * scale * w * 0.18 + cx
        const by = bh.y * scale * h * 0.18 + cy
        const br = bh.radius * scale * 0.12
        const ar = bh.accretion * scale * 0.12

        if (br < 2) continue

        // Accretion disk
        for (let i = 0; i < 30; i++) {
          const a = bh.angle + (i / 30) * Math.PI * 2
          const dist = ar * (0.6 + 0.4 * Math.sin(elapsed * 2 + i * 0.5))
          const dx = Math.cos(a) * dist
          const dy = Math.sin(a) * dist * 0.3
          ctx.beginPath()
          ctx.arc(bx + dx, by + dy, 1.5 + Math.random() * 1, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200, 180, 255, ${0.1 + 0.1 * Math.sin(elapsed + i)})`
          ctx.fill()
        }

        // Gravitational lens ring
        ctx.beginPath()
        ctx.arc(bx, by, ar, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(180, 140, 255, 0.08)'
        ctx.lineWidth = 2
        ctx.stroke()

        // Event horizon
        const bgrad = ctx.createRadialGradient(bx, by, 0, bx, by, br)
        bgrad.addColorStop(0, '#000000')
        bgrad.addColorStop(0.7, '#1a0a2a')
        bgrad.addColorStop(1, 'transparent')
        ctx.fillStyle = bgrad
        ctx.beginPath()
        ctx.arc(bx, by, br * 2, 0, Math.PI * 2)
        ctx.fill()

        // Glow ring
        ctx.beginPath()
        ctx.arc(bx, by, br * 0.6, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(180, 140, 255, ${0.12 + 0.06 * Math.sin(elapsed * 3)})`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      // === Planets ===
      for (const planet of planets) {
        planet.orbitAngle += planet.orbitSpeed * dt * 0.05
        const scale = 1.2 / planet.z
        const ox = Math.sin(planet.orbitAngle) * w * 0.015
        const oy = Math.cos(planet.orbitAngle * 0.7) * h * 0.015
        const sx = planet.x * scale * w * 0.2 + cx + ox
        const sy = planet.y * scale * h * 0.2 + cy + oy
        const r = planet.radius * scale * 0.12

        if (r < 1.5 || sx < -300 || sx > w + 300 || sy < -300 || sy > h + 300) continue

        // Glow
        const pgrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 4)
        pgrad.addColorStop(0, planet.glowColor)
        pgrad.addColorStop(1, 'transparent')
        ctx.fillStyle = pgrad
        ctx.globalAlpha = 0.06
        ctx.fillRect(sx - r * 4, sy - r * 4, r * 8, r * 8)

        // Ring
        if (planet.ring > 0) {
          const ringR = planet.ring * scale * 0.18
          ctx.save()
          ctx.translate(sx, sy)
          ctx.rotate(planet.ringTilt)
          ctx.beginPath()
          ctx.ellipse(0, 0, ringR, ringR * 0.15, 0, 0, Math.PI * 2)
          ctx.strokeStyle = planet.glowColor
          ctx.lineWidth = 1.5
          ctx.globalAlpha = 0.35
          ctx.stroke()
          // second faint ring
          ctx.beginPath()
          ctx.ellipse(0, 0, ringR * 1.2, ringR * 0.1, 0, 0, Math.PI * 2)
          ctx.strokeStyle = planet.glowColor
          ctx.lineWidth = 0.8
          ctx.globalAlpha = 0.15
          ctx.stroke()
          ctx.restore()
        }

        // Body
        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fillStyle = planet.color
        ctx.globalAlpha = 0.65
        ctx.fill()

        // Surface detail — bands for gas giants
        if (planet.name === 'Jupiter' || planet.name === 'Saturn') {
          ctx.save()
          ctx.beginPath()
          ctx.arc(sx, sy, r, 0, Math.PI * 2)
          ctx.clip()
          for (let b = -r * 0.7; b < r * 0.7; b += r * 0.25) {
            ctx.fillStyle = `rgba(255,255,255,${0.04 + 0.03 * Math.sin(b * 0.5)})`
            ctx.fillRect(sx - r, sy + b, r * 2, r * 0.1)
          }
          ctx.restore()
        }

        // Atmosphere rim
        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.strokeStyle = planet.glowColor
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.4
        ctx.stroke()
      }

      // === Dust stars (seamless wrap) ===
      for (const star of dust) {
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
        const sx = star.x * scale * w * 0.22 + cx
        const sy = star.y * scale * h * 0.22 + cy
        const size = star.size * scale * 0.35
        if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) continue
        const alpha = star.brightness * (1 - star.z * 0.7)
        ctx.beginPath()
        ctx.arc(sx, sy, Math.max(size, 0.3), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha, 1)})`
        ctx.fill()
        if (size > 1) {
          ctx.beginPath()
          ctx.arc(sx, sy, size * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200, 210, 255, ${alpha * 0.04})`
          ctx.fill()
        }
      }

      animRef.current = requestAnimationFrame(render)
    }

    timeRef.current = 0
    animRef.current = requestAnimationFrame(render)

    return () => cancelAnimationFrame(animRef.current)
  }, [dimensions])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
