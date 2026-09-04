import sharp from "sharp"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const sheet = path.join("public", "apply", "characters-sheet.png")
const outDir = path.join("public", "apply", "characters")

const meta = await sharp(sheet).metadata()
const count = 10
const cellW = Math.floor(meta.width / count)
const cellH = meta.height

await mkdir(outDir, { recursive: true })

for (let i = 0; i < count; i++) {
  await sharp(sheet)
    .extract({ left: i * cellW, top: 0, width: cellW, height: cellH })
    .png()
    .toFile(path.join(outDir, `${String(i + 1).padStart(2, "0")}.png`))
}

console.log(`Sliced ${count} characters (${cellW}x${cellH}) from ${meta.width}x${meta.height}`)
