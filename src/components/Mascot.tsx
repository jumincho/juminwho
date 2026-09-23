interface Props {
  size: number
  className?: string
}

/** Mongle, the site mascot. It is the favicon drawing, reused as decoration. */
export default function Mascot({ size, className }: Props) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}favicon.svg`}
      alt=""
      width={size}
      height={size}
      className={className}
      draggable={false}
    />
  )
}
