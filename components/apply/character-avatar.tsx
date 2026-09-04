"use client"

import Image from "next/image"
import { getCharacterSrc } from "@/lib/apply/characters"

export function CharacterAvatar({
  characterId,
  size = 72,
  className = "",
}: {
  characterId: number
  size?: number
  className?: string
}) {
  const src = getCharacterSrc(characterId)

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-white ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        key={`char-${characterId}-${src}`}
        src={src}
        alt=""
        width={size}
        height={size}
        unoptimized
        className="h-full w-full object-contain p-1"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  )
}
