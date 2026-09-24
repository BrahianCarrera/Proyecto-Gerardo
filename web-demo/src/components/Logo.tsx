export default function Logo({
  width = 120,
  height = 120,
  className = '',
}: {
  width?: number
  height?: number
  className?: string
}) {
  return (
    <img
      src="./assets/logo.svg"
      alt="Gerardo App"
      width={width}
      height={height}
      className={className}
      draggable={false}
    />
  )
}
