import Image from "next/image"

/** kt is CI mark for dark backgrounds (white kt + red accents). */
export function KtIsMark({
  className = "h-7 w-auto",
}: {
  className?: string
}) {
  return (
    <Image
      src="/brand/kt-is-ci-dark.png"
      alt="kt is"
      width={492}
      height={229}
      unoptimized
      draggable={false}
      className={`select-none object-contain object-left ${className}`}
      style={{ imageRendering: "auto" }}
    />
  )
}
