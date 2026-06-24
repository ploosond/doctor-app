type LogoProps = {
  height?: number
  title?: string
}

// Pill wordmark — teal background, white "dr.lila", trailing white dot.
// viewBox aspect drives width; callers set height only.
export function Logo({ height = 40, title = "dr.lila" }: LogoProps) {
  return (
    <svg
      height={height}
      viewBox='0 0 124 44'
      role='img'
      aria-label={title}
      style={{ display: "block" }}
    >
      <rect
        x='0'
        y='0'
        width='124'
        height='44'
        rx='22'
        fill='var(--color-brand)'
      />
      <text
        x='22'
        y='22'
        fill='#fff'
        fontFamily='var(--font-zilla-slab), serif'
        fontWeight={700}
        fontSize={21}
        letterSpacing='-0.03em'
        dominantBaseline='central'
        textLength={66}
        lengthAdjust='spacingAndGlyphs'
      >
        Dr.lila
      </text>
      <circle cx='92' cy='30' r='5' fill='#508991' />
    </svg>
  )
}
