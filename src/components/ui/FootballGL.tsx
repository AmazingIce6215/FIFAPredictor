'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function FootballGL({ size = 250 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const scene = new THREE.Scene()
    const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    cam.position.z = 3.2

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(size, size)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    ref.current.appendChild(renderer.domElement)

    const tc = document.createElement('canvas')
    tc.width = tc.height = 512
    const ctx = tc.getContext('2d')!
    ctx.fillStyle = '#DCDCDC'
    ctx.fillRect(0, 0, 512, 512)
    ctx.fillStyle = '#0A0A0A'
    const pentagons = [
      [256, 256], [256, 98], [143, 176], [369, 176], [106, 328],
      [406, 328], [181, 426], [331, 426], [48, 198], [464, 198],
      [70, 386], [442, 386], [256, 474],
    ]
    pentagons.forEach(([cx, cy]) => {
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const a = (i * 2 * Math.PI / 5) - Math.PI / 2
        const x = cx + 44 * Math.cos(a)
        const y = cy + 44 * Math.sin(a)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
    })
    const tex = new THREE.CanvasTexture(tc)

    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45, metalness: 0.05 }),
    )
    scene.add(ball)

    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.38, 0.013, 8, 128),
      new THREE.MeshBasicMaterial({ color: 0x00FF87, transparent: true, opacity: 0.52 }),
    )
    ring1.rotation.x = 1.0
    scene.add(ring1)

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.007, 8, 128),
      new THREE.MeshBasicMaterial({ color: 0xFFD700, transparent: true, opacity: 0.22 }),
    )
    ring2.rotation.x = Math.PI * 0.5
    ring2.rotation.y = 0.6
    scene.add(ring2)

    scene.add(new THREE.AmbientLight(0xffffff, 0.32))
    const dl1 = new THREE.DirectionalLight(0xffffff, 1.15)
    dl1.position.set(2, 3, 4)
    scene.add(dl1)
    const dl2 = new THREE.DirectionalLight(0x00FF87, 0.28)
    dl2.position.set(-3, -1, 2)
    scene.add(dl2)
    const pl = new THREE.PointLight(0x4D9EFF, 0.4, 10)
    pl.position.set(-2, 2, 1)
    scene.add(pl)

    let frameId: number
    const tick = () => {
      frameId = requestAnimationFrame(tick)
      ball.rotation.y += 0.005
      ball.rotation.x += 0.002
      ring1.rotation.z -= 0.004
      ring2.rotation.z += 0.002
      ring2.rotation.x += 0.001
      renderer.render(scene, cam)
    }
    tick()

    return () => {
      cancelAnimationFrame(frameId)
      renderer.dispose()
      if (ref.current?.contains(renderer.domElement)) {
        ref.current.removeChild(renderer.domElement)
      }
    }
  }, [size])

  return <div ref={ref} style={{ width: size, height: size }} />
}
