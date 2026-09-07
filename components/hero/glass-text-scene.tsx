"use client"

/**
 * WI ZEROTHON glass hero — Lobster jelly (deploy materials + wand).
 * Two-line in one mesh so look/effect match single-line deploy.
 * Toggle: USE_HERO_TITLE_GLASS_A in components/hero-haoqi.tsx
 */

import {
  Center,
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  useTexture,
} from "@react-three/drei"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  parse,
  type Font as OpenTypeFont,
  type Path as OpenTypePath,
} from "opentype.js"
import { useEffect, useMemo, useRef, useState, Suspense, type MutableRefObject, type ReactNode } from "react"
import * as THREE from "three"

type Props = {
  pointerRef: MutableRefObject<{ x: number; y: number }>
  reducedMotion?: boolean
  onReady?: () => void
  /** 1 = full · 0 = hidden (scroll toward Introduce) */
  stickerOpacity?: number
}

/**
 * Jelly lavender — mid brightness (between deploy & max-white);
 * tint/FBO keep purple so glass stays lavender, not blown-out white.
 */
const GLASS_TINT = "#f2ecff"
const ATTENUATION = "#faf6ff"
const FBO_CLEAR = new THREE.Color(0x3a2e70)

/** Resting key light — mouse light adds on top. */
const BASE_KEY_INTENSITY = 7.85
const MOUSE_LIGHT_INTENSITY = 10.85
const MOUSE_LIGHT_DISTANCE = 10
const MOUSE_LIGHT_DECAY = 1.45
const ENV_INTENSITY = 1.85
const MAT_ENV_MAP_INTENSITY = 3.7
const AMBIENT_INTENSITY = 0.85

/* -------------------------------------------------------------------------- */
/* Background ??gradient focal point tracks virtual light (no drawn glow)     */
/* -------------------------------------------------------------------------- */

const BG_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const BG_FRAG = /* glsl */ `
varying vec2 vUv;
uniform float uTime;
uniform vec2 uLightPos; // slow-damped gradient focal point (centered UV)

void main() {
  // Violet-navy ??between prior #05081a and deep purple, suits jelly lavender glass
  vec3 navy = vec3(0.035, 0.027, 0.110);
  vec3 deep = vec3(0.020, 0.016, 0.071);
  vec3 indigo = vec3(0.18, 0.12, 0.42);
  vec3 cool = vec3(0.48, 0.42, 0.78);

  vec2 p = vUv - 0.5;
  vec2 focal = uLightPos;

  // Base vignette ??dark navy
  vec3 col = mix(navy, deep, smoothstep(0.05, 1.05, length(p)));

  // Soft idle pools (very low ??atmosphere only)
  vec2 poolA = vec2(-0.2 + 0.02 * sin(uTime * 0.12), -0.06);
  vec2 poolB = vec2(0.18, 0.1 + 0.02 * cos(uTime * 0.1));
  col += indigo * exp(-distance(p, poolA) * 2.8) * 0.1;
  col += indigo * exp(-distance(p, poolB) * 2.4) * 0.07;

  // Focal bias: whole-field tone drifts with light ??not a circular blob
  float d = distance(p, focal);
  float bias = exp(-d * d * 1.55);
  col = mix(col, col + indigo * 0.22 + cool * 0.1, bias);

  // Diagonal wash whose axis is anchored at focal
  vec2 axis = normalize(vec2(0.55, 0.84));
  float band = 1.0 - smoothstep(0.0, 0.95, abs(dot(p - focal, axis)));
  col += indigo * band * 0.11;
  col += cool * band * bias * 0.06;

  // Second soft lobe opposite ??keeps field dimensional without a spot
  vec2 antiPos = -focal * 0.55;
  float anti = exp(-distance(p, antiPos) * distance(p, antiPos) * 2.2);
  col = mix(col, deep * 1.15, anti * 0.2);

  col *= 1.0 - smoothstep(0.55, 1.25, length(p)) * 0.28;

  // Soft wash only — Earth photo must show through the canvas
  float a = 0.14 + bias * 0.08;
  gl_FragColor = vec4(col, a);
}
`

function BackgroundField({
  pointerRef,
}: {
  pointerRef: MutableRefObject<{ x: number; y: number }>
}) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uLightPos: { value: new THREE.Vector2(0, 0) },
        },
        vertexShader: BG_VERT,
        fragmentShader: BG_FRAG,
        depthWrite: false,
        transparent: true,
      }),
    [],
  )
  const { viewport } = useThree()
  const lightPos = useRef(new THREE.Vector2(0, 0))

  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.elapsedTime
    const tx = pointerRef.current.x
    const ty = -pointerRef.current.y
    lightPos.current.x += (tx - lightPos.current.x) * 0.018
    lightPos.current.y += (ty - lightPos.current.y) * 0.018
    mat.uniforms.uLightPos.value.copy(lightPos.current)
  })

  return (
    <mesh
      position={[0, 0, -2]}
      scale={[viewport.width * 1.4, viewport.height * 1.4, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

/** Invisible key light — mouse unprojected onto a plane in front of the text. */
function VirtualMouseLight({
  pointerRef,
}: {
  pointerRef: MutableRefObject<{ x: number; y: number }>
}) {
  const lightRef = useRef<THREE.PointLight>(null)
  const { camera, size } = useThree()
  const target = useRef(new THREE.Vector3(0, 0, 1.4))
  const smooth = useRef(new THREE.Vector3(0, 0, 1.4))
  const ndc = useRef(new THREE.Vector3())
  const rayDir = useRef(new THREE.Vector3())

  useFrame(() => {
    const pointerX = pointerRef.current.x
    // Pointer is normalized to the first-screen (100svh) box; remap Y onto tall page-1 canvas
    const frac = Math.min(1, window.innerHeight / Math.max(size.height, 1))
    const pointerY = -0.5 + (pointerRef.current.y + 0.5) * frac
    ndc.current.set(pointerX * 2, -pointerY * 2, 0.5)
    ndc.current.unproject(camera)
    rayDir.current.copy(ndc.current).sub(camera.position).normalize()
    const planeZ = 1.35
    const denom = rayDir.current.z
    if (Math.abs(denom) > 1e-5) {
      const t = (planeZ - camera.position.z) / denom
      target.current
        .copy(camera.position)
        .addScaledVector(rayDir.current, t)
    }
    smooth.current.lerp(target.current, 0.55)
    if (lightRef.current) {
      lightRef.current.position.copy(smooth.current)
    }
  })

  return (
    <pointLight
      ref={lightRef}
      intensity={MOUSE_LIGHT_INTENSITY}
      color="#ffffff"
      distance={MOUSE_LIGHT_DISTANCE}
      decay={MOUSE_LIGHT_DECAY}
      castShadow={false}
    />
  )
}

/* -------------------------------------------------------------------------- */
/* Cursive geometry ??thinner inflate, tighter kerning (same Lobster)         */
/* -------------------------------------------------------------------------- */

function opentypePathToShapes(path: OpenTypePath): THREE.Shape[] {
  const shapePath = new THREE.ShapePath()
  for (const cmd of path.commands) {
    switch (cmd.type) {
      case "M":
        shapePath.moveTo(cmd.x, -cmd.y)
        break
      case "L":
        shapePath.lineTo(cmd.x, -cmd.y)
        break
      case "C":
        shapePath.bezierCurveTo(
          cmd.x1!,
          -cmd.y1!,
          cmd.x2!,
          -cmd.y2!,
          cmd.x,
          -cmd.y,
        )
        break
      case "Q":
        shapePath.quadraticCurveTo(cmd.x1!, -cmd.y1!, cmd.x, -cmd.y)
        break
      case "Z":
        shapePath.currentPath?.closePath()
        break
      default:
        break
    }
  }
  return shapePath.toShapes(true)
}

/**
 * Lobster inflate — soft jelly bevels (deploy surface quality).
 * Single ExtrudeGeometry: WI centered on top, ZEROTHON below.
 */
function buildTwoLineBalloonGeometry(font: OpenTypeFont): THREE.BufferGeometry {
  const fontSize = 120
  const STROKE_EST = 20
  const inflate = STROKE_EST * 0.35
  const shapes: THREE.Shape[] = []

  const measureLine = (
    text: string,
    kernAfter: (ch: string, index: number) => number,
  ) => {
    let x = 0
    ;[...text].forEach((ch, i) => {
      const glyph = font.charToGlyph(ch)
      const adv =
        ((glyph.advanceWidth ?? font.unitsPerEm * 0.5) * fontSize) /
        font.unitsPerEm
      x += adv * kernAfter(ch, i)
    })
    return x
  }

  const layoutLine = (
    text: string,
    yBaseline: number,
    xOffset: number,
    kernAfter: (ch: string, index: number) => number,
  ) => {
    let x = xOffset
    ;[...text].forEach((ch, i) => {
      const glyph = font.charToGlyph(ch)
      const gPath = glyph.getPath(x, yBaseline, fontSize)
      shapes.push(...opentypePathToShapes(gPath))
      const adv =
        ((glyph.advanceWidth ?? font.unitsPerEm * 0.5) * fontSize) /
        font.unitsPerEm
      x += adv * kernAfter(ch, i)
    })
  }

  // WI open; ZEROTHON slightly tighter, extra gap after T→H
  const wiKern = () => 1.08
  const zeroKern = (ch: string, _i: number) => (ch === "T" ? 1.08 : 0.96)

  const wiW = measureLine("WI", wiKern)
  const zeroW = measureLine("ZEROTHON", zeroKern)
  layoutLine("WI", 0, (zeroW - wiW) * 0.5, wiKern)
  layoutLine("ZEROTHON", fontSize * 1.02, 0, zeroKern)

  if (!shapes.length) {
    return new THREE.BoxGeometry(1, 0.2, 0.2)
  }

  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: inflate * 1.6,
    bevelEnabled: true,
    bevelThickness: inflate,
    bevelSize: inflate,
    bevelOffset: -inflate * 0.15,
    bevelSegments: 10,
    curveSegments: 20,
  })

  geo.computeVertexNormals()
  geo.computeBoundingBox()
  const bb = geo.boundingBox!
  const size = new THREE.Vector3()
  bb.getSize(size)
  const center = new THREE.Vector3()
  bb.getCenter(center)
  geo.translate(-center.x, -center.y, -center.z)
  geo.scale(
    1 / Math.max(size.x, 0.001),
    1 / Math.max(size.x, 0.001),
    1 / Math.max(size.x, 0.001),
  )

  const pos = geo.attributes.position
  const nor = geo.attributes.normal
  geo.userData.origPos = new Float32Array(pos.array as Float32Array)
  geo.userData.origNor = new Float32Array(nor.array as Float32Array)
  geo.computeBoundingBox()
  const bb2 = geo.boundingBox!
  const dim = new THREE.Vector3()
  bb2.getSize(dim)
  geo.userData.localSize = dim

  return geo
}

function useLobsterFont() {
  const [font, setFont] = useState<OpenTypeFont | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/fonts/Lobster-Regular.ttf")
      .then((r) => {
        if (!r.ok) throw new Error(`font HTTP ${r.status}`)
        return r.arrayBuffer()
      })
      .then((buf) => {
        if (!cancelled) setFont(parse(buf))
      })
      .catch((err) => console.error("[HeroGlass] font load failed", err))
    return () => {
      cancelled = true
    }
  }, [])

  return font
}

/* -------------------------------------------------------------------------- */
/* Bubble-wand interaction                                                    */
/*                                                                            */
/* A) Local pinch / part (elastic, continuous mesh ??not RGB clones)          */
/* B) Iridescent soap film bridging nearby stroke sides across the wand       */
/* -------------------------------------------------------------------------- */

type FilmState = {
  visible: boolean
  ax: number
  ay: number
  bx: number
  by: number
  strength: number
}

const FILM_VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vViewDir;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vViewDir = normalize(cameraPosition - wp.xyz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

const FILM_FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uStrength;
varying vec2 vUv;
varying vec3 vViewDir;

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float mask = 1.0 - smoothstep(0.45, 1.0, length(p * vec2(1.0, 1.25)));
  float edge = smoothstep(0.08, 0.9, abs(p.x));

  float fres = pow(1.0 - abs(normalize(vViewDir).z), 2.0);
  float t = vUv.x * 2.2 + vUv.y * 0.7 + fres * 1.6 + uTime * 0.45;
  vec3 iris = 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
  iris = mix(iris, vec3(0.7, 0.92, 1.0), 0.2);
  iris *= 1.35;

  float alpha = mask * edge * uStrength * (0.55 + fres * 0.7);
  gl_FragColor = vec4(iris, alpha);
}
`

/**
 * Wand stroke: raw mouse position + velocity impulse, snap recover.
 * Softness lives in spring damping only ??not in mouse tracking lag.
 */
function applyWandDeformation(
  geometry: THREE.BufferGeometry,
  mouse: THREE.Vector2,
  wandNormal: THREE.Vector2,
  impulse: number,
  reducedMotion: boolean,
  spring: Float32Array,
): FilmState {
  const origPos = geometry.userData.origPos as Float32Array
  const pos = geometry.attributes.position as THREE.BufferAttribute
  const arr = pos.array as Float32Array

  const empty: FilmState = {
    visible: false,
    ax: 0,
    ay: 0,
    bx: 0,
    by: 0,
    strength: 0,
  }

  if (!origPos || !spring) {
    return empty
  }

  if (reducedMotion) {
    arr.set(origPos)
    spring.fill(0)
    pos.needsUpdate = true
    return empty
  }

  const bladeW = 0.04
  const stickR = 0.11
  const partAmp = 0.022
  // Fast attack / faster snap-back for soap “snap”
  const attack = 0.45
  const recover = 0.78

  let leftX = 0
  let leftY = 0
  let leftN = 0
  let rightX = 0
  let rightY = 0
  let rightN = 0
  let contact = 0

  const nx = wandNormal.x
  const ny = wandNormal.y
  const txDir = -ny
  const tyDir = nx
  const impulseGate = Math.max(0, impulse)

  for (let i = 0; i < arr.length; i += 3) {
    const ox = origPos[i]
    const oy = origPos[i + 1]
    const oz = origPos[i + 2]

    const dx = ox - mouse.x
    const dy = oy - mouse.y

    const plane = dx * nx + dy * ny
    const along = dx * txDir + dy * tyDir
    const side = plane >= 0 ? 1 : -1

    const nearBlade = Math.exp(-((plane * plane) / (bladeW * bladeW)))
    const alongStick = Math.exp(-((along * along) / (stickR * stickR)))
    // Distance falloff 횞 velocity impulse
    const falloff = nearBlade * alongStick * impulseGate

    const amp = partAmp * falloff
    const targetX = nx * side * amp
    const targetY = ny * side * amp
    const targetZ = -amp * 0.28

    const k = falloff > 0.04 ? attack : recover
    spring[i] += (targetX - spring[i]) * k
    spring[i + 1] += (targetY - spring[i + 1]) * k
    spring[i + 2] += (targetZ - spring[i + 2]) * k

    if (falloff < 0.02 && Math.abs(spring[i]) < 1e-4) spring[i] = 0
    if (falloff < 0.02 && Math.abs(spring[i + 1]) < 1e-4) spring[i + 1] = 0
    if (falloff < 0.02 && Math.abs(spring[i + 2]) < 1e-4) spring[i + 2] = 0

    const px = ox + spring[i]
    const py = oy + spring[i + 1]
    arr[i] = px
    arr[i + 1] = py
    arr[i + 2] = oz + spring[i + 2]

    if (falloff > 0.1) contact = Math.max(contact, falloff)

    if (falloff > 0.16 && i % 9 === 0) {
      if (side < 0) {
        leftX += px
        leftY += py
        leftN++
      } else {
        rightX += px
        rightY += py
        rightN++
      }
    }
  }

  pos.needsUpdate = true

  if (leftN < 3 || rightN < 3 || contact < 0.25) return empty

  leftX /= leftN
  leftY /= leftN
  rightX /= rightN
  rightY /= rightN

  const gap = Math.hypot(rightX - leftX, rightY - leftY)
  if (gap < 0.03 || gap > 0.32) return empty

  const midDist = Math.hypot(
    mouse.x - (leftX + rightX) * 0.5,
    mouse.y - (leftY + rightY) * 0.5,
  )
  const strength = Math.max(
    0,
    Math.min(
      1,
      contact * (1 - midDist / stickR) * (1 - Math.abs(gap - 0.12) / 0.16),
    ),
  )
  if (strength < 0.12) return empty

  return {
    visible: true,
    ax: leftX,
    ay: leftY,
    bx: rightX,
    by: rightY,
    strength,
  }
}

function SoapFilm({
  stateRef,
}: {
  stateRef: MutableRefObject<FilmState>
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uStrength: { value: 0 },
        },
        vertexShader: FILM_VERT,
        fragmentShader: FILM_FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  useFrame(({ clock }) => {
    const state = stateRef.current
    mat.uniforms.uTime.value = clock.elapsedTime
    mat.uniforms.uStrength.value = state.strength
    if (!mesh.current) return
    mesh.current.visible = state.visible && state.strength > 0.05
    if (!mesh.current.visible) return

    const mx = (state.ax + state.bx) * 0.5
    const my = (state.ay + state.by) * 0.5
    const dx = state.bx - state.ax
    const dy = state.by - state.ay
    const len = Math.hypot(dx, dy) || 0.1
    const angle = Math.atan2(dy, dx)

    mesh.current.position.set(mx, my, 0.02)
    mesh.current.rotation.z = angle
    mesh.current.scale.set(len * 1.25, Math.min(0.12, len * 0.7), 1)
  })

  return (
    <mesh ref={mesh} frustumCulled={false} visible={false}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

function BalloonGlassText({
  pointerRef,
  reducedMotion,
  onReady,
}: {
  pointerRef: MutableRefObject<{ x: number; y: number }>
  reducedMotion: boolean
  onReady?: () => void
}) {
  const font = useLobsterFont()
  const content = useRef<THREE.Group>(null)
  const letterGroup = useRef<THREE.Group>(null)
  const scaledFor = useRef(0)
  const mouseRaw = useRef(new THREE.Vector2(0, 0))
  const mousePrev = useRef(new THREE.Vector2(0, 0))
  const wandNormal = useRef(new THREE.Vector2(0, 1))
  const parallax = useRef(new THREE.Vector2(0, 0))
  const impulseSmooth = useRef(0)
  const springRef = useRef<Float32Array | null>(null)
  const readySent = useRef(false)
  const readyFrames = useRef(0)
  const filmState = useRef<FilmState>({
    visible: false,
    ax: 0,
    ay: 0,
    bx: 0,
    by: 0,
    strength: 0,
  })
  const { viewport, size } = useThree()

  /** Screen-width fraction for WI/ZEROTHON (applied every frame so edits always stick) */
  const TITLE_FIT = size.width < 640 ? 0.96 : 0.68

  const geometry = useMemo(() => {
    if (!font) return null
    // Single mesh (deploy wand + jelly) — only layout is two lines
    const geo = buildTwoLineBalloonGeometry(font)
    springRef.current = new Float32Array(geo.attributes.position.count * 3)
    return geo
  }, [font])

  useFrame(() => {
    if (content.current && geometry) {
      const fitW =
        (geometry.userData.localSize as THREE.Vector3 | undefined)?.x ?? 1
      content.current.scale.setScalar(
        (viewport.width * TITLE_FIT) / Math.max(fitW, 0.05),
      )
      if (scaledFor.current !== viewport.width) {
        scaledFor.current = viewport.width
      }
    }

    if (geometry && scaledFor.current > 0 && !readySent.current) {
      readyFrames.current += 1
      if (readyFrames.current >= 8) {
        readySent.current = true
        onReady?.()
      }
    }

    const localSize =
      (geometry?.userData.localSize as THREE.Vector3 | undefined) ??
      new THREE.Vector3(1, 0.55, 0.2)

    const pointerX = pointerRef.current.x
    const pointerY = pointerRef.current.y

    const targetParaX = reducedMotion ? 0 : pointerX * localSize.x * 0.012
    const targetParaY = reducedMotion ? 0 : -pointerY * localSize.y * 0.014
    parallax.current.x += (targetParaX - parallax.current.x) * 0.06
    parallax.current.y += (targetParaY - parallax.current.y) * 0.06
    if (letterGroup.current) {
      letterGroup.current.position.set(
        parallax.current.x,
        parallax.current.y,
        0,
      )
    }

    // Deploy wand mapping — no fit hacks
    mouseRaw.current.set(
      pointerX * localSize.x * 0.95 - parallax.current.x,
      -pointerY * localSize.y * 1.05 - parallax.current.y,
    )

    const vx = mouseRaw.current.x - mousePrev.current.x
    const vy = mouseRaw.current.y - mousePrev.current.y
    const speed = Math.hypot(vx, vy)
    const impulseTarget = Math.min(0.7, Math.max(0, (speed - 0.00035) / 0.032))
    impulseSmooth.current += (impulseTarget - impulseSmooth.current) * 0.32
    if (speed > 1e-5) {
      wandNormal.current.set(-vy / speed, vx / speed)
    }
    mousePrev.current.copy(mouseRaw.current)

    if (geometry && springRef.current) {
      const next = applyWandDeformation(
        geometry,
        mouseRaw.current,
        wandNormal.current,
        reducedMotion ? 0 : impulseSmooth.current,
        !!reducedMotion,
        springRef.current,
      )
      const prev = filmState.current
      if (next.visible) {
        filmState.current = {
          visible: true,
          ax: next.ax,
          ay: next.ay,
          bx: next.bx,
          by: next.by,
          strength: prev.strength * 0.4 + next.strength * 0.6,
        }
      } else {
        const strength = prev.strength * 0.7
        filmState.current = {
          ...prev,
          strength,
          visible: strength > 0.04,
        }
      }
    }
  })

  if (!geometry) return null

  const titleOffsetX = size.width < 640 ? 0 : -0.18

  return (
    <group ref={content} position={[titleOffsetX, 0.42, 0]}>
      <Center>
        <group ref={letterGroup}>
          <mesh geometry={geometry} castShadow={false} receiveShadow={false}>
            <MeshTransmissionMaterial
              background={FBO_CLEAR}
              backside
              backsideThickness={0.22}
              samples={reducedMotion ? 4 : 16}
              resolution={reducedMotion ? 384 : 1024}
              transmission={1}
              thickness={0.42}
              ior={1.24}
              chromaticAberration={reducedMotion ? 0.04 : 0.095}
              anisotropicBlur={0.07}
              roughness={0.018}
              metalness={0}
              color={GLASS_TINT}
              attenuationColor={ATTENUATION}
              attenuationDistance={21}
              clearcoat={1}
              clearcoatRoughness={0.01}
              envMapIntensity={MAT_ENV_MAP_INTENSITY}
              // @ts-expect-error physical iridescence
              iridescence={0.55}
              iridescenceIOR={1.3}
              iridescenceThicknessRange={[80, 360]}
              sheen={0.72}
              sheenRoughness={0.2}
              sheenColor="#f0e6ff"
              distortion={0}
              distortionScale={0}
              temporalDistortion={0}
              transparent
              toneMapped
            />
          </mesh>
          {!reducedMotion && <SoapFilm stateRef={filmState} />}
        </group>
      </Center>
    </group>
  )
}

const STICKER_URLS = [
  "/stickers/heart.png",
  "/stickers/kt-is-1.png",
  "/stickers/kt-is-2.png",
  "/stickers/laptop.png",
  "/stickers/mission-clear.png",
  "/stickers/monitor.png",
  "/stickers/robot.png",
  "/stickers/rocket.png",
  "/stickers/smile.png",
  "/stickers/smile-2.png",
  "/stickers/star.png",
  "/stickers/thunder.png",
  "/stickers/up.png",
  "/stickers/win.png",
] as const

/** Per-asset scale tweaks (1UP art reads oversized vs the rest) */
const STICKER_SIZE_MUL: Partial<Record<(typeof STICKER_URLS)[number], number>> = {
  "/stickers/up.png": 0.58,
}

type FallingSticker = {
  texIndex: number
  x: number
  y: number
  z: number
  speed: number
  swayAmp: number
  swayFreq: number
  rot: number
  rotSpeed: number
  size: number
  phase: number
}

const FALL_COUNT = 8

/** Shuffle bag ??each sticker appears once before reshuffle; never consecutive dup */
function createStickerBag(texCount: number) {
  const bag: number[] = []
  let last = -1

  const refill = () => {
    const next = Array.from({ length: texCount }, (_, i) => i)
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    // Avoid starting a new bag with the same as last pick
    if (next.length > 1 && next[0] === last) {
      ;[next[0], next[1]] = [next[1], next[0]]
    }
    bag.push(...next)
  }

  return {
    next(exclude: Set<number>) {
      if (bag.length === 0) refill()
      // Prefer an index not currently on screen
      let pickIdx = bag.findIndex((id) => !exclude.has(id) && id !== last)
      if (pickIdx < 0) pickIdx = bag.findIndex((id) => id !== last)
      if (pickIdx < 0) pickIdx = 0
      const id = bag.splice(pickIdx, 1)[0]
      last = id
      return id
    },
  }
}

function makeFallingSticker(
  viewport: { width: number; height: number },
  texIndex: number,
  fromTop: boolean,
): FallingSticker {
  const w = viewport.width
  const h = viewport.height
  const mobileBoost =
    typeof window !== "undefined" && window.innerWidth < 640 ? 1.7 : 1
  return {
    texIndex,
    x: (Math.random() - 0.5) * w * 1.05,
    y: fromTop
      ? h * (0.45 + Math.random() * 0.55)
      : (Math.random() - 0.5) * h * 1.05,
    z: -0.55 - Math.random() * 1.15,
    speed: 0.1 + Math.random() * 0.12,
    swayAmp: 0.1 + Math.random() * 0.14,
    swayFreq: 0.28 + Math.random() * 0.5,
    rot: (Math.random() - 0.5) * 0.7,
    rotSpeed: (Math.random() - 0.5) * 0.22,
    size:
      w *
      (0.072 + Math.random() * 0.055) *
      mobileBoost *
      (STICKER_SIZE_MUL[STICKER_URLS[texIndex]] ?? 1),
    phase: Math.random() * Math.PI * 2,
  }
}

/**
 * Stickers behind glass letters (MTM refraction) — rain across the full page-1 canvas.
 */
function SceneStickers({
  pointerRef,
  reducedMotion,
  stickerOpacity,
}: {
  pointerRef: MutableRefObject<{ x: number; y: number }>
  reducedMotion: boolean
  stickerOpacity: number
}) {
  const { viewport, size, gl } = useThree()
  const textures = useTexture([...STICKER_URLS]) as THREE.Texture[]
  const groupRefs = useRef<(THREE.Group | null)[]>([])
  const items = useRef<FallingSticker[]>([])
  const bagRef = useRef(createStickerBag(STICKER_URLS.length))
  const ready = useRef(false)
  const opacityRef = useRef(stickerOpacity)
  opacityRef.current = stickerOpacity

  useMemo(() => {
    for (const t of textures) {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 8
      t.needsUpdate = true
    }
  }, [textures])

  useEffect(() => {
    const n =
      reducedMotion ? 3 : size.width < 640 ? Math.min(5, FALL_COUNT) : FALL_COUNT
    bagRef.current = createStickerBag(textures.length)
    const used = new Set<number>()
    items.current = Array.from({ length: n }, () => {
      const texIndex = bagRef.current.next(used)
      used.add(texIndex)
      return makeFallingSticker(viewport, texIndex, false)
    })
    ready.current = true
  }, [viewport.width, viewport.height, textures.length, reducedMotion, size.width])

  useFrame(({ clock }, dt) => {
    if (!ready.current) return
    const t = clock.elapsedTime
    const d = Math.min(dt, 0.05)
    const h = viewport.height
    const vh = typeof window !== "undefined" ? window.innerHeight : size.height

    // Fade only after passing #hero-cta (“지금 신청하기” block)
    let fadeStartFrac = Math.min(0.92, (Math.min(vh * 0.78, size.height * 0.8) + 88) / Math.max(size.height, 1))
    const ctaEl = typeof document !== "undefined" ? document.getElementById("hero-cta") : null
    if (ctaEl) {
      const cr = gl.domElement.getBoundingClientRect()
      const tr = ctaEl.getBoundingClientRect()
      if (cr.height > 1) {
        fadeStartFrac = THREE.MathUtils.clamp((tr.bottom - cr.top) / cr.height, 0.35, 0.95)
      }
    }
    const fadeStart = h * (0.5 - fadeStartFrac)
    const fadeEnd = fadeStart - h * 0.12
    const bottom = fadeEnd - h * 0.02
    const scrollMul = Number.isFinite(opacityRef.current)
      ? opacityRef.current
      : 1
    const px = reducedMotion ? 0 : pointerRef.current.x * 0.12
    const speedScale = Math.min(1, vh / Math.max(h, 1e-3))

    items.current.forEach((it, i) => {
      const g = groupRefs.current[i]
      if (!g) return

      if (!reducedMotion) {
        it.y -= it.speed * d * Math.max(0.35, speedScale)
        it.rot += it.rotSpeed * d
      }

      if (it.y < bottom) {
        const active = new Set(
          items.current.map((s, j) => (j === i ? -1 : s.texIndex)),
        )
        active.delete(-1)
        Object.assign(
          it,
          makeFallingSticker(viewport, bagRef.current.next(active), true),
        )
      }

      const sway =
        Math.sin(t * it.swayFreq + it.phase) * it.swayAmp +
        Math.sin(t * it.swayFreq * 0.37 + it.phase) * it.swayAmp * 0.35

      g.position.set(it.x + sway + px * (0.4 - it.z * 0.15), it.y, it.z)
      g.rotation.z = it.rot + Math.sin(t * 0.5 + it.phase) * 0.06
      g.position.z = it.z + Math.sin(t * 0.4 + it.phase) * 0.04

      const tex = textures[it.texIndex]
      const aspect = tex?.image
        ? (tex.image as HTMLImageElement).width /
          Math.max(1, (tex.image as HTMLImageElement).height)
        : 1
      g.scale.set(it.size * aspect, it.size, 1)

      const yFade =
        it.y > fadeStart
          ? 1
          : it.y < fadeEnd
            ? 0
            : THREE.MathUtils.clamp(
                (it.y - fadeEnd) / Math.max(1e-6, fadeStart - fadeEnd),
                0,
                1,
              )
      const opacity = yFade * yFade * scrollMul

      const mesh = g.children[0] as THREE.Mesh | undefined
      const mat = mesh?.material as THREE.MeshBasicMaterial | undefined
      if (mat) {
        if (mat.map !== tex) {
          mat.map = tex
          mat.needsUpdate = true
        }
        mat.opacity = Math.max(0, Math.min(1, opacity))
        mat.alphaTest = 0
        g.visible = mat.opacity > 0.03
      }
    })
  })

  const count =
    reducedMotion ? 3 : size.width < 640 ? Math.min(5, FALL_COUNT) : FALL_COUNT

  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <group
          key={i}
          ref={(el) => {
            groupRefs.current[i] = el
          }}
          position={[0, viewport.height, -1]}
        >
          <mesh renderOrder={-2}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={textures[i % textures.length]}
              transparent
              depthWrite={false}
              side={THREE.DoubleSide}
              toneMapped={false}
              opacity={1}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Keep WI/ZEROTHON centered in the top window when the page-1 canvas is taller than 100svh. */
function TopViewportLock({ children }: { children: ReactNode }) {
  const { viewport, size } = useThree()
  const frac = Math.min(1, window.innerHeight / Math.max(size.height, 1))
  const y = viewport.height * 0.5 * (1 - frac)
  return <group position={[0, y, 0]}>{children}</group>
}

function GlassScene({
  pointerRef,
  reducedMotion,
  onReady,
  stickerOpacity = 1,
}: {
  pointerRef: MutableRefObject<{ x: number; y: number }>
  reducedMotion: boolean
  onReady?: () => void
  stickerOpacity?: number
}) {
  return (
    <>
      {/* Stickers behind glass — full page-1 canvas */}
      <Suspense fallback={null}>
        <SceneStickers
          pointerRef={pointerRef}
          reducedMotion={reducedMotion}
          stickerOpacity={stickerOpacity}
        />
      </Suspense>
      <BackgroundField pointerRef={pointerRef} />
      <VirtualMouseLight pointerRef={pointerRef} />
      <TopViewportLock>
        <BalloonGlassText
          pointerRef={pointerRef}
          reducedMotion={reducedMotion}
          onReady={onReady}
        />
      </TopViewportLock>
    </>
  )
}

export function HeroGlassText({
  pointerRef,
  reducedMotion = false,
  onReady,
  stickerOpacity = 1,
}: Props) {
  const readyOnce = useRef(false)
  const handleReady = () => {
    if (readyOnce.current) return
    readyOnce.current = true
    onReady?.()
  }

  // Safety: never block the page forever if WebGL/font fails
  useEffect(() => {
    const t = window.setTimeout(() => handleReady(), 8000)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-hidden"
      style={{ pointerEvents: "none" }}
    >
      <Canvas
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{
          background: "transparent",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        dpr={[1, 1.75]}
        gl={{
          alpha: true,
          antialias: true,
          premultipliedAlpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        camera={{ position: [0, 0, 9], fov: 40, near: 0.1, far: 50 }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0)
          scene.background = null
          gl.domElement.style.pointerEvents = "none"
        }}
      >
        <ambientLight intensity={AMBIENT_INTENSITY} />
        {/* Color-feel: white · purple · cyan — mid brightness, purple kept */}
        <directionalLight position={[-6, 8, 5]} intensity={3.9} color="#f8faff" />
        <directionalLight position={[-3, 5, 4]} intensity={2.0} color="#eee8ff" />
        <directionalLight position={[0, 6, 4]} intensity={1.35} color="#c4b5fd" />
        <directionalLight position={[6, 5, 4]} intensity={2.9} color="#67e8f9" />
        <directionalLight position={[7, 1, 2]} intensity={0.9} color="#22d3ee" />
        <pointLight position={[-3.2, 3.6, 4.5]} intensity={3.0} color="#ffffff" distance={16} />
        <pointLight position={[0.1, 2.8, 4]} intensity={1.7} color="#a78bfa" distance={13} />
        <pointLight position={[3.4, 3.2, 4.2]} intensity={2.55} color="#7dd3fc" distance={15} />
        <pointLight
          position={[0.15, 0.55, 1.4]}
          intensity={BASE_KEY_INTENSITY}
          color="#f6f3ff"
          distance={11}
          decay={1.45}
        />

        <Suspense fallback={null}>
          <Environment resolution={128} environmentIntensity={ENV_INTENSITY} frames={1}>
            <Lightformer
              form="rect"
              intensity={13}
              position={[0, 6, 1]}
              scale={[14, 0.32, 1]}
              color="#ffffff"
            />
            <Lightformer
              form="rect"
              intensity={8}
              position={[-5.2, 3.5, 3]}
              scale={[0.45, 7, 1]}
              color="#f4f8ff"
            />
            <Lightformer
              form="rect"
              intensity={4.1}
              position={[0, 2.2, 2]}
              scale={[3.2, 5, 1]}
              color="#c084fc"
            />
            <Lightformer
              form="rect"
              intensity={6.9}
              position={[5.2, 3.2, 3]}
              scale={[0.45, 7, 1]}
              color="#67e8f9"
            />
            <Lightformer
              form="rect"
              intensity={2.8}
              position={[-5, 2, -1]}
              scale={[4, 4, 1]}
              color="#e9d5ff"
            />
            <Lightformer
              form="rect"
              intensity={3.0}
              position={[5, 1, 2]}
              scale={[4, 5, 1]}
              color="#22d3ee"
            />
            <Lightformer
              form="rect"
              intensity={1.9}
              position={[0, -0.35, 3]}
              scale={[5, 5, 1]}
              color="#f0e6ff"
            />
            <Lightformer
              form="rect"
              intensity={0.45}
              position={[0, -1.15, -2]}
              scale={[8, 2, 1]}
              color="#1a1040"
            />
          </Environment>
        </Suspense>

        <GlassScene
          pointerRef={pointerRef}
          reducedMotion={reducedMotion}
          onReady={handleReady}
          stickerOpacity={stickerOpacity}
        />
      </Canvas>
    </div>
  )
}
