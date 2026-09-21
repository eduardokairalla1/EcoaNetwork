/**
 * The ambient network field behind the hero headline.
 */

// --- IMPORTS ---
import { useId, useRef } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTime,
  useTransform,
  type MotionValue,
} from 'motion/react'

import type {
  HeroFieldNode,
  HeroFieldProps,
} from '@/site/landing/motifs/HeroField.t'
import { cn } from '@/components/ui/cn'

// --- GLOBALS ---
const NODES: HeroFieldNode[] = [
  { x: 118, y: 168, r: 7, kind: 'actor', depth: 1 },
  { x: 262, y: 96, r: 5, kind: 'actor', depth: 2 },
  { x: 196, y: 300, r: 9, kind: 'event', depth: 0 },
  { x: 88, y: 430, r: 5, kind: 'actor', depth: 2 },
  { x: 232, y: 534, r: 7, kind: 'actor', depth: 1 },
  { x: 140, y: 662, r: 6, kind: 'event', depth: 1 },
  { x: 318, y: 736, r: 5, kind: 'actor', depth: 2 },
  { x: 430, y: 168, r: 6, kind: 'actor', depth: 1 },
  { x: 512, y: 812, r: 7, kind: 'actor', depth: 1 },
  { x: 690, y: 108, r: 5, kind: 'event', depth: 2 },
  { x: 742, y: 838, r: 6, kind: 'actor', depth: 1 },
  { x: 946, y: 156, r: 7, kind: 'actor', depth: 1 },
  { x: 1002, y: 792, r: 5, kind: 'actor', depth: 2 },
  { x: 1128, y: 262, r: 9, kind: 'event', depth: 0 },
  { x: 1216, y: 116, r: 5, kind: 'actor', depth: 2 },
  { x: 1180, y: 560, r: 7, kind: 'actor', depth: 1 },
  { x: 1312, y: 404, r: 6, kind: 'actor', depth: 1 },
  { x: 1266, y: 700, r: 6, kind: 'event', depth: 1 },
  { x: 1358, y: 842, r: 5, kind: 'actor', depth: 2 },
  { x: 1380, y: 214, r: 5, kind: 'actor', depth: 2 },
]

/** Idle drift. */
const EASE = [0.2, 0.8, 0.2, 1] as const

/** Depth tiers sit back through opacity rather than blur. */
const DEPTH_OPACITY = { 0: 1, 1: 0.7, 2: 0.42 } as const

const DRIFT_AMPLITUDE = { 0: 9, 1: 6, 2: 3.5 } as const

/** Index pairs into NODES. */
const EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [0, 2],
  [1, 7],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 5],
  [4, 6],
  [5, 6],
  [6, 8],
  [7, 9],
  [8, 10],
  [10, 12],
  [9, 11],
  [11, 13],
  [13, 14],
  [13, 15],
  [14, 19],
  [15, 16],
  [15, 17],
  [16, 19],
  [17, 18],
  [12, 17],
]

/** Traffic: which edges carry a visible exchange, and at what cadence. */
const TRAFFIC = [
  { edge: 0, duration: 3.2, delay: 0.8, gap: 4.1 },
  { edge: 4, duration: 2.6, delay: 2.3, gap: 5.4 },
  { edge: 7, duration: 3.8, delay: 1.5, gap: 3.7 },
  { edge: 10, duration: 2.9, delay: 3.6, gap: 4.8 },
  { edge: 13, duration: 3.4, delay: 0.4, gap: 6.2 },
  { edge: 16, duration: 2.4, delay: 4.2, gap: 3.9 },
  { edge: 19, duration: 3.6, delay: 2.9, gap: 5.1 },
  { edge: 21, duration: 3.0, delay: 5.1, gap: 4.4 },
] as const

/** How long the arrival ring takes to expand and fade. */
const RING = 0.9

/** Length of the lit window, in user units. */
const WINDOW = 96

// --- CODE ---
/**
 * Computes a node's idle drift offset.
 *
 * @param elapsed - Milliseconds since the field mounted.
 * @param index - Which node, which also sets its phase.
 * @param axis - Axis being offset.
 * @param depth - Depth tier, which sets the amplitude.
 * @returns The offset, in user units.
 */
function drift(
  elapsed: number,
  index: number,
  axis: 'x' | 'y',
  depth: 0 | 1 | 2,
) {
  const phase = index * 1.7 + (axis === 'y' ? 2.3 : 0)
  const period = 11000 + ((index * 7) % 5) * 2300
  return (
    Math.sin((elapsed / period) * Math.PI * 2 + phase) * DRIFT_AMPLITUDE[depth]
  )
}

/** Geometry for laying an overlay along an edge. */

/**
 * Computes an edge's length and angle.
 *
 * @param from - Node the edge leaves.
 * @param to - Node it arrives at.
 * @returns Its length, and its angle in degrees.
 */
function edgeGeometry(from: HeroFieldNode, to: HeroFieldNode) {
  const dx = to.x - from.x
  const dy = to.y - from.y

  return {
    length: Math.hypot(dx, dy),
    angle: (Math.atan2(dy, dx) * 180) / Math.PI,
  }
}

/**
 * Tracks a node's drifting absolute position.
 *
 * @param index - Which node.
 * @param time - The shared clock.
 * @param still - Whether motion is stilled.
 * @returns Motion values for the node’s x and y.
 */
function useDriftedPoint(
  index: number,
  time: MotionValue<number>,
  still: boolean,
) {
  const node = NODES[index]
  const x = useTransform(time, (t) =>
    still ? node.x : node.x + drift(t, index, 'x', node.depth),
  )
  const y = useTransform(time, (t) =>
    still ? node.y : node.y + drift(t, index, 'y', node.depth),
  )

  return { x, y }
}

/**
 * Tracks a node's drift as a transform offset.
 *
 * @param index - Which node.
 * @param time - The shared clock.
 * @param still - Whether motion is stilled.
 * @returns Motion values for the node’s x and y offset.
 */
function useDriftOffset(
  index: number,
  time: MotionValue<number>,
  still: boolean,
) {
  const node = NODES[index]
  const x = useTransform(time, (t) =>
    still ? 0 : drift(t, index, 'x', node.depth),
  )
  const y = useTransform(time, (t) =>
    still ? 0 : drift(t, index, 'y', node.depth),
  )

  return { x, y }
}

/**
 * Draws one edge of the field.
 *
 * @param props - The two node indices, the clock, and whether motion is
 * stilled.
 * @returns The edge, as an SVG line.
 */
function FieldEdge({
  from,
  to,
  time,
  still,
  reveal,
}: {
  from: number
  to: number
  time: MotionValue<number>
  still: boolean
  reveal: boolean
}) {
  const a = useDriftedPoint(from, time, still)
  const b = useDriftedPoint(to, time, still)

  return (
    <motion.line
      x1={a.x}
      y1={a.y}
      x2={b.x}
      y2={b.y}
      stroke="var(--ecoa-border-strong)"
      strokeWidth={1}
      strokeDasharray="3 6"
      vectorEffect="non-scaling-stroke"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.55 }}
      transition={
        reveal ? { duration: 0.8, delay: 0.25, ease: EASE } : { duration: 0 }
      }
    />
  )
}

/**
 * Draws one node of the field.
 *
 * @param props - The node index, the clock, and whether motion is stilled.
 * @returns The node, as an SVG shape.
 */
function FieldNode({
  index,
  time,
  still,
  reveal,
}: {
  index: number
  time: MotionValue<number>
  still: boolean
  reveal: boolean
}) {
  const node = NODES[index]
  const offset = useDriftOffset(index, time, still)

  const shared = {
    initial: { opacity: 0, scale: 0.4 },
    animate: { opacity: DEPTH_OPACITY[node.depth], scale: 1 },
    transition: reveal
      ? { duration: 0.24, delay: 0.1 + index * 0.035, ease: EASE }
      : { duration: 0 },
    style: {
      transformBox: 'fill-box' as const,
      transformOrigin: 'center' as const,
    },
  }

  return node.kind === 'event' ? (
    <motion.rect
      x={node.x - node.r}
      y={node.y - node.r}
      width={node.r * 2}
      height={node.r * 2}
      fill="var(--ecoa-signal)"
      {...shared}
      style={{ ...shared.style, x: offset.x, y: offset.y }}
    />
  ) : (
    <motion.circle
      cx={node.x}
      cy={node.y}
      r={node.r}
      fill="var(--ecoa-canvas)"
      stroke="var(--ecoa-border-structural)"
      strokeWidth={1.5}
      vectorEffect="non-scaling-stroke"
      {...shared}
      style={{ ...shared.style, x: offset.x, y: offset.y }}
    />
  )
}

/**
 * Draws a lit exchange travelling along an edge.
 *
 * @param props - The edge to light, its timing, the clock and the stilled
 * flag.
 * @returns The lit overlay riding the edge.
 */
function TrafficEdge({
  edge,
  duration,
  delay,
  gap,
  time,
  still,
  uid,
}: {
  edge: number
  duration: number
  delay: number
  gap: number
  time: MotionValue<number>
  still: boolean
  uid: string
}) {
  const [fromIndex, toIndex] = EDGES[edge]
  const from = NODES[fromIndex]
  const to = NODES[toIndex]
  const b = useDriftedPoint(toIndex, time, still)
  const groupRef = useRef<SVGGElement>(null)

  // The window and the mask region are sized from the resting geometry.
  const { length, angle } = edgeGeometry(from, to)

  // The transform is written to the attribute, not a motion value.
  useMotionValueEvent(time, 'change', (t) => {
    const group = groupRef.current
    if (!group || still) return

    const ax = from.x + drift(t, fromIndex, 'x', from.depth)
    const ay = from.y + drift(t, fromIndex, 'y', from.depth)
    const bx = to.x + drift(t, toIndex, 'x', to.depth)
    const by = to.y + drift(t, toIndex, 'y', to.depth)
    const live = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI

    group.setAttribute('transform', `translate(${ax} ${ay}) rotate(${live})`)
  })

  return (
    <>
      <defs>
        <mask
          id={`${uid}-trail-${edge}`}
          maskUnits="userSpaceOnUse"
          x={-WINDOW}
          y={-6}
          width={length + WINDOW * 2}
          height={12}
        >
          <motion.rect
            y={-6}
            width={WINDOW}
            height={12}
            fill={`url(#${uid}-fade)`}
            initial={{ x: -WINDOW }}
            animate={{ x: length }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              repeatDelay: gap,
              ease: [0.4, 0, 0.6, 1],
            }}
          />
        </mask>
      </defs>

      <g
        ref={groupRef}
        transform={`translate(${from.x} ${from.y}) rotate(${angle})`}
      >
        <line
          x1={0}
          y1={0}
          x2={length}
          y2={0}
          stroke="var(--ecoa-signal)"
          strokeWidth={1.5}
          strokeDasharray="3 6"
          vectorEffect="non-scaling-stroke"
          mask={`url(#${uid}-trail-${edge})`}
        />
      </g>

      <motion.circle
        cx={b.x}
        cy={b.y}
        r={NODES[toIndex].r}
        fill="none"
        stroke="var(--ecoa-signal)"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: [1, 2.6], opacity: [0, 0.7, 0] }}
        transition={{
          repeat: Infinity,
          delay: delay + duration * 0.82,
          duration: RING,
          // repeatDelay is per-animation, so the ring needs its own gap.
          repeatDelay: duration + gap - RING,
          ease: EASE,
        }}
      />
    </>
  )
}

/**
 * Draws the ambient network field behind the hero.
 *
 * @param props - Extra classes for the field.
 * @returns The field, as inline SVG.
 */
export function HeroField({ className }: HeroFieldProps) {
  const reduceMotion = useReducedMotion()
  // Mask and gradient ids are document-global, so they must be unique.
  const uid = useId().replace(/:/g, '')
  const time = useTime()
  const still = reduceMotion ?? false

  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={cn('absolute inset-0 size-full', className)}
    >
      <g>
        {EDGES.map(([from, to]) => (
          <FieldEdge
            key={`${from}-${to}`}
            from={from}
            to={to}
            time={time}
            still={still}
            reveal={!still}
          />
        ))}
      </g>

      {/* Information in transit. */}
      {!still ? (
        <>
          <defs>
            {/* Luminance mask: black hides, white shows. */}
            <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#000" />
              <stop offset="0.55" stopColor="#4a4a4a" />
              <stop offset="0.86" stopColor="#d2d2d2" />
              <stop offset="1" stopColor="#fff" />
            </linearGradient>
          </defs>

          {TRAFFIC.map((entry) => (
            <TrafficEdge
              key={`traffic-${entry.edge}`}
              {...entry}
              time={time}
              still={still}
              uid={uid}
            />
          ))}
        </>
      ) : null}

      <g>
        {NODES.map((_, index) => (
          <FieldNode
            key={index}
            index={index}
            time={time}
            still={still}
            reveal={!still}
          />
        ))}
      </g>
    </svg>
  )
}
