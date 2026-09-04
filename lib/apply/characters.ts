/** Character avatars sliced from public/apply/characters-sheet.png */
export const CHARACTER_COUNT = 10

export function normalizeCharacterId(characterId: unknown): number {
  const id = typeof characterId === "number" ? characterId : Number(characterId)
  if (!Number.isFinite(id)) return 0
  return ((Math.floor(id) % CHARACTER_COUNT) + CHARACTER_COUNT) % CHARACTER_COUNT
}

export function getCharacterSrc(characterId: unknown): string {
  const id = normalizeCharacterId(characterId)
  return `/apply/characters/${String(id + 1).padStart(2, "0")}.png`
}

/** Prefer unused characters; reuse when all 10 are taken. */
export function pickCharacterIdExcluding(excluded: readonly number[]): number {
  const excludedSet = new Set(excluded.map((id) => normalizeCharacterId(id)))
  const pool = Array.from({ length: CHARACTER_COUNT }, (_, i) => i).filter(
    (id) => !excludedSet.has(id),
  )
  const choices = pool.length > 0 ? pool : Array.from({ length: CHARACTER_COUNT }, (_, i) => i)

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    return choices[buf[0] % choices.length]
  }

  return choices[Math.floor(Math.random() * choices.length)]
}

function assignUniqueCharacterIds(posts: { characterId?: number }[]): boolean {
  const used = new Set<number>()
  let migrated = false

  for (const post of posts) {
    let id =
      typeof post.characterId === "number" && Number.isFinite(post.characterId)
        ? normalizeCharacterId(post.characterId)
        : -1

    if (id < 0 || used.has(id)) {
      id = pickCharacterIdExcluding([...used])
      post.characterId = id
      migrated = true
    } else {
      post.characterId = id
    }

    used.add(id)
  }

  return migrated
}

export { assignUniqueCharacterIds }
