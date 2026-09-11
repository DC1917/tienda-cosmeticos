function SakuraIcon({ className = "h-8 w-8" }) {
  const petal = "M30 30 C20 24 14 12 22 4 C25 1 28 3 30 7 C32 3 35 1 38 4 C46 12 40 24 30 30 Z"

  return (
    <svg viewBox="0 0 60 60" className={className} xmlns="http://www.w3.org/2000/svg">
      {[0, 72, 144, 216, 288].map(angle => (
        <path
          key={angle}
          d={petal}
          fill="currentColor"
          transform={`rotate(${angle} 30 30)`}
        />
      ))}
      <circle cx="30" cy="30" r="4" className="fill-amber-300" />
    </svg>
  )
}

export default SakuraIcon
